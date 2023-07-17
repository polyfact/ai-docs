import "dotenv/config";
import { Reference, File } from "./types";
import { generateWithTypeWithTokenUsage } from "polyfact";
import * as t from "io-ts";

import dotenv from "dotenv";
import { chunkBigFiles, splitFilesByTokenCount } from "./utils/splitter";

dotenv.config();

const { TOKEN_LIMIT, BATCH_SIZE } = process.env;

const maxTokens = Number(TOKEN_LIMIT);
const batchSize = Number(BATCH_SIZE);

// function formatReferencePrompt(content: string, path: string): string {
//   return `
//   Examine the provided content from file ${path} :
//   \`\`\`\n ${content}\n\`\`\`

//   Write a JSON object that describes that will be used to generate the reference of the file.
//   The string inside the JSON must be plain text, and not contain any markdown or HTML.
//   The JSON object should follow this type:
//   \`\`\`
//   {
//       "description": string, // A 200 word description of the file and what it's used for.
//       "references": [
//           {
//               "name": string, // The name of the function/method/class/type/structure/etc...
//               "category": "function" | "method" | "class" | "type" | "structure" | "enum" | string,
//               "prototype": string, // The prototype of the function or method. Should only be used for functions and methods.
//               "enum": [string], // The possible values of the enum. Should only be used for enums.
//               "description": string, // A 100 word description of its purpose.
//               "keywords": string[], // A list of keywords that can be used to search for this reference.
//               "parameters": [
//                   {
//                       "name": string,
//                       "type": string,
//                       "description": string, // A description of the purpose of the parameter.
//                   }
//               ],
//               "returns": {
//                   "type": string,
//                   "description": string, // A description of the purpose of the return value.
//               }
//               "public": boolean,
//               "subreferences": [
//                   ... // A list of references that are contained within this reference following the same format (e.g. methods within a class)
//               ]
//               "errors": [
//                   {
//                       "name": string,
//                       "description": string,
//                   }
//               ],
//           }
//       ],
//       "examples": [
//           {
//               "title": string,
//               "description": string,
//               "example": string, // A commented code example that uses the functions in the reference. If the examples are bash command, make it so it's runnable from the root of the project and use the most standard way of running it. (This file path: \`root/${path}\`)
//               "example_markdown_language": "python" | "rust" | "ruby" | "c" | "bash" | string,
//           }
//       ]
//   }
//   \`\`\`
//   Write as much example code as you can, and make sure to include comments that explain what the code does.
//   Include all the possible errors that can occur.
//   Only add the references of things that are defined in the file. Don't include imports or dependencies.
//   Don't forget to make it so all the examples are runnable from the root of the project (This file path: \`root/${path}\`). YOU SHOULD NOT ASSUME THE USER IS ANYWHERE ELSE THAN THE ROOT DIRECTORY.
//   To launch from the root directory, if the project contains multiple modules (which is clear by the fact that the lib/src path is not directly a child of the root directory), use the most standard way of running it. For example, in python you should use \`python -m <module>\`, in rust you should use \`cargo run --bin <bin>\`, etc...
//   If the project doesn't appear to use modules and the code is directly in the root directory, don't use the module/bin.
//   For example, a file located at \`root/src/main.rs\` should be runnable with \`cargo run\` from the root directory while a file located at \`root/module-a/src/main.rs\` should be runnable with \`cargo run --bin module-a\` from the root directory.
//   If some command line arguments are defined in the file, don't forget to include them in the example. If the command line tool is not clear, replace it with <base_command>. (e.g. \`<base_command> --arg1 path1\`)
//   The example should contain the command and command lines arguments only if the file is clearly defining a cli command or argument. If it is clearly related to CLI, don't forget to include the command line usage in the example as a bash program. You can use <base_command> is the base command is not defined in the file.
//   ALL THE CLI COMMANDS USAGE DEFINED SHOULD BE EXPLICITLY WRITTEN IN THE EXAMPLES IN A COMMENTED BASH PROGRAM.

//   Please only provide the JSON in a single json markdown code block with the keys described above. Do not include any other text.
//   If the content is not code or doesn't define anything, just return "None" and nothing else.
//   If at least one function is defined, you're not allowed to return None.
//   You must include all the functions defined in the reference.
//   Please make sure the JSON is a single line and does not contain any newlines outside of the strings.
//   `;
// }

function formatReferencePrompt(content: string, path: string): string {
  return `
    Examine the provided content from file ${path} :
    \`\`\`\n ${content}\n\`\`\`
    
    Write a JSON object that describes that will be used to generate the reference of the file.
    The string inside the JSON must be plain text, and not contain any markdown or HTML.
    The JSON object should follow this type:
    \`\`\`
    {
        "description": string, // A 200 word description of the file and what it's used for.
        "references": [
            {
                "name": string, // The name of the function/method/class/type/structure/etc...
                "prototype": string, // The prototype of the function or method. Should only be used for functions and methods.
                "enum": [string], // The possible values of the enum. Should only be used for enums.
                "description": string, // A 100 word description of its purpose.
                "keywords": string[], // A list of keywords that can be used to search for this reference.
                "parameters": [
                    {
                        "name": string,
                        "type": string,
                        "description": string, // A description of the purpose of the parameter.
                    }
                ],
                "returns": {
                    "type": string,
                    "description": string, // A description of the purpose of the return value.
                }
                "errors": [
                    {
                        "name": string,
                        "description": string,
                    }
                ],
            }
        ],
        "examples": [
            {
                "title": string,
                "description": string,
                "example": string, // A commented code example that uses the functions in the reference. If the examples are bash command, make it so it's runnable from the root of the project and use the most standard way of running it. (This file path: \`root/${path}\`)
            }
        ]
    }
    \`\`\`
    Write as much example code as you can, and make sure to include comments that explain what the code does.
    Include all the possible errors that can occur.
    Only add the references of things that are defined in the file. Don't include imports or dependencies.
    Don't forget to make it so all the examples are runnable from the root of the project (This file path: \`root/${path}\`). YOU SHOULD NOT ASSUME THE USER IS ANYWHERE ELSE THAN THE ROOT DIRECTORY.
    To launch from the root directory, if the project contains multiple modules (which is clear by the fact that the lib/src path is not directly a child of the root directory), use the most standard way of running it. For example, in python you should use \`python -m <module>\`, in rust you should use \`cargo run --bin <bin>\`, etc...
    If the project doesn't appear to use modules and the code is directly in the root directory, don't use the module/bin.
    For example, a file located at \`root/src/main.rs\` should be runnable with \`cargo run\` from the root directory while a file located at \`root/module-a/src/main.rs\` should be runnable with \`cargo run --bin module-a\` from the root directory.
    If some command line arguments are defined in the file, don't forget to include them in the example. If the command line tool is not clear, replace it with <base_command>. (e.g. \`<base_command> --arg1 path1\`)
    The example should contain the command and command lines arguments only if the file is clearly defining a cli command or argument. If it is clearly related to CLI, don't forget to include the command line usage in the example as a bash program. You can use <base_command> is the base command is not defined in the file.
    ALL THE CLI COMMANDS USAGE DEFINED SHOULD BE EXPLICITLY WRITTEN IN THE EXAMPLES IN A COMMENTED BASH PROGRAM.
    
    Please only provide the JSON in a single json markdown code block with the keys described above. Do not include any other text.
    If the content is not code or doesn't define anything, just return "None" and nothing else.
    If at least one function is defined, you're not allowed to return None.
    You must include all the functions defined in the reference.
    Please make sure the JSON is a single line and does not contain any newlines outside of the strings.
    `;
}

const ReferenceParameter = t.type({
  name: t.string,
  type: t.string,
  description: t.string,
});

const ErrorType = t.type({
  name: t.string,
  description: t.string,
});

const ReturnsType = t.type({
  type: t.string,
  description: t.string,
});

const Example = t.type({
  title: t.string,
  description: t.string,
  example: t.string,
  //   example_markdown_language: t.keyof({
  //     python: null,
  //     rust: null,
  //     ruby: null,
  //     c: null,
  //     bash: null,
  //   }),
});

const TReference = t.type({
  name: t.string,
  //   category: t.keyof({
  //     function: null,
  //     method: null,
  //     class: null,
  //     type: null,
  //     structure: null,
  //     enum: null,
  //   }),
  prototype: t.string,
  enum: t.array(t.string),
  description: t.string,
  keywords: t.array(t.string),
  parameters: t.array(ReferenceParameter),
  returns: ReturnsType,
  //   publics: t.boolean,
  errors: t.array(ErrorType),
});

// const TReferenceWithSubreferences = t.intersection([
//   TReference,
//   t.type({
//     subreferences: t.array(TReference),
//   }),
// ]);

const ReferenceType = t.type({
  description: t.string,
  //   references: t.array(TReferenceWithSubreferences),
  references: t.array(TReference),
  examples: t.array(Example),
  //   hasReference: t.string,
});

async function processForEachFile(
  filesList: File[],
  callback: (file: File) => Promise<Reference>
): Promise<Reference[]> {
  async function batchProcess(batch: File[]): Promise<Reference[]> {
    return Promise.all(batch.map(callback));
  }

  const [validFiles, bigFiles] = splitFilesByTokenCount(filesList, maxTokens);

  const chunkedBigFiles = await chunkBigFiles(bigFiles, maxTokens);

  filesList = [...validFiles, ...chunkedBigFiles];

  const totalBatches = Math.floor(filesList.length / batchSize) + 1;
  let fileListWithData: Reference[] = [];

  for (let i = 0; i < filesList.length; i += batchSize) {
    const batch = filesList.slice(i, i + batchSize);
    console.info(`Batch ${Math.floor(i / batchSize) + 1} of ${totalBatches}`);
    const batchResults = await batchProcess(batch);
    fileListWithData = [...fileListWithData, ...batchResults];
  }

  return fileListWithData;
}

async function generateFileReference(
  file: File,
  updateFileProgress: (ref: Reference) => void
): Promise<Reference> {
  let content = file.content;
  let path = file.path;

  console.info(`Generating reference for : ${file.path}`);

  let prompt = formatReferencePrompt(content, path);

  let updatedFile = { ...file };
  let reference;

  try {
    reference = await generateWithTypeWithTokenUsage(prompt, ReferenceType);
  } catch (error) {
    console.log(error);
    updateFileProgress(updatedFile);

    return updatedFile;
  }

  if (Boolean(!reference?.result?.references?.length)) {
    console.info(`Skipped file: ${file.path}`);
    updateFileProgress(file);

    return file;
  }

  const fileReferenceJson = reference.result;

  updatedFile = { ...updatedFile, reference_json: fileReferenceJson };

  updateFileProgress(updatedFile);

  return updatedFile;
}

function mergeFiles(file1: Reference, file2: Reference): Reference {
  let f1 = { ...file1 };
  let f2 = { ...file2 };

  let d1 =
    f1.reference_json && f1.reference_json.description
      ? f1.reference_json.description
      : "";
  let d2 =
    f2.reference_json && f2.reference_json.description
      ? f2.reference_json.description
      : "";

  let r1 =
    f1.reference_json && f1.reference_json.references
      ? f1.reference_json.references
      : [];
  let r2 =
    f2.reference_json && f2.reference_json.references
      ? f2.reference_json.references
      : [];

  let c1 = f1.content ? f1.content : "";
  let c2 = f2.content ? f2.content : "";

  if (String(f1.name) < String(f2.name)) {
    f1.content = (c1 + "\n" + c2).trim();
  } else {
    f1.content = (c2 + "\n" + c1).trim();
  }
  f1.reference_json = {
    description: (d1 + "\n" + d2).trim(),
    references: [...r1, ...r2],
  };
  f1.chunk = (f1.chunk || 0) + (f2.chunk || 0);

  return f1;
}

export async function generateReferenceForEachFile(
  fileList: File[],
  updateFileProgress: (ref: Reference) => void = () => {}
): Promise<Reference[]> {
  let filesPath: { [key: string]: Reference } = {};

  function progress(ref: Reference) {
    ref.path = ref.originalPath || "";
    ref.name = ref.path.split("/").pop() || "";
    ref.chunk = 1;

    if (filesPath?.[ref.path]) {
      filesPath[ref.path] = mergeFiles(filesPath[ref.path], ref);
    } else {
      filesPath[ref.path] = ref;
    }

    if (!ref.chunkTotal || ref.chunkTotal === filesPath[ref.path].chunk) {
      updateFileProgress(filesPath[ref.path]);
    }
  }

  return await processForEachFile(fileList, (file: File) =>
    generateFileReference(file, progress)
  );
}
