import { generateWithTypeWithTokenUsage, t } from "polyfact";
import { TResponseWithTokenUsage, Reference } from "./types";

export function gettingStartedPrompt(
  structure: string,
  summaries: string,
  overview: string
) {
  return `
Here is the folder structure of the project:
\`${structure}\`

Here are examples from each reference file :
\`${summaries}\`

Here is the overview of the project to help you for creating the "Introduction" section:
\`${overview}\`

Write a JSON object that will be used to generate a getting started guide for this project.
The string inside the JSON must be formatted in markdown.
Provide the following keys:
- title: a description in around 10 words of what this project is about (e.g. "ABC: a tool to do XYZ")
- description: a 50 words description of what this project is about
- commands: a json list of 3 commands that can be used to interact with this project.
(e.g. ["cd my_project", "cargo install path --my_subproject", "my_subproject --arg1 <param1>"])
- introduction: a 200 words explanation of the project.
This should be in 2 paragraphs.
Use two newlines "\\n\\n" between the paragraphs
- installation: a list of steps to install the project.
This should a single string with each step as a markdown list.
This should only cover installation.
DO NOT INCLUDE BASIC USAGE OR START THE PROGRAM IN THIS FIELD.
Make sure that every command can be launched from the root directory.
Use as much the same command format as possible.
Make sure every file you're mentioning actually exists.
(e.g. "- *Prerequisites*: Do this and that...\\n\`\`\`The command to do this and that\`\`\`\\n - *Clone the repository*: Clone the repository...\\n\`\`\`git clone ...\`\`\`\\n - etc...")
- basic_usage: Here is where we start the program and explain the differents basic usages.This should be a single string with each basic usage in a block with a ### title.
If a usage has multiple steps, use a markdown list.
Make sure that every command can be launched from the root directory.
Use as much the same command format as possible.
Make sure you are talking about real commands and are not trying to directly launch internal files that cannot be launched.
If you're not sure, don't include it.
- advanced_usage: This section covers advanced features and use cases of Tomb, providing detailed instructions and examples for users who are already familiar with the basics.
It should have the same format as basic_usage though you can be less specific.
Use the examples but keep in mind not all of them are relevant.
You should not cover how the code works but how to use the project.
If there is no relevant advanced usage, just set this to null.

Please use the examples from the reference files to help you but keep in mind not all of them are relevant to a getting started.
They were all made for their own file so you also need to take their path into account and adjust the commands so they all can be launch from the root directory.

Please only provide the JSON in a single json markdown code block with the keys "title", "description", "commands", "introduction", "installation", "basic_usage", "advanced_usage".
Do not include any other text
Remember it's important that the properties JSON are formated only on a single line without return.
`;
}

const RequiredGettingStartedType = t.type({
  title: t.string,
  installation: t.string,
  basic_usage: t.string,
});

const PartialGettingStartedType = t.partial({
  description: t.string,
  commands: t.array(t.string),
  introduction: t.string,
  advanced_usage: t.string,
});

const GettingStartedType = t.intersection([
  RequiredGettingStartedType,
  PartialGettingStartedType,
]);

export async function generateGettingStartedSection(
  prompt: any
): TResponseWithTokenUsage {
  try {
    const response = await generateWithTypeWithTokenUsage(
      prompt,
      t.type({ res: GettingStartedType })
    );

    GettingStartedType.decode(response?.result.res);

    return response;
  } catch (error) {
    console.error(
      `An error occurred while generating getting started: ${error}`
    );
    throw error;
  }
}

export function generateExampleFromJson(json: {
  [key: string]: any;
}): string | undefined {
  if (
    ["bash", "shell", "sh"].includes(json["example_markdown_language"]) &&
    json["example"]
  ) {
    const title: string = json["title"];
    const description: string = String(json["description"]);
    const exampleMarkdownLanguage: string = json["example_markdown_language"];
    const example: string = json["example"];

    const markdownTitle: string = `### ${title}`;
    const markdownExample: string = `\`\`\`${exampleMarkdownLanguage}\n${example}\n\`\`\``;

    return [markdownTitle, description, markdownExample].join("\n").trim();
  }
}

export function generateExampleFromJsons(
  jsons: { [key: string]: any }[]
): string {
  return jsons
    .map((json) => generateExampleFromJson(json))
    .filter((result) => result !== undefined)
    .join("\n\n");
}

export function generateExampleSectionFromFile(file: {
  [key: string]: any;
}): string | undefined {
  let path: string = file["fullPath"];
  if (path === undefined) {
    path = file["path"];
  }

  const examples: any[] = file["reference_json"]["examples"];
  const generatedExample: string = generateExampleFromJsons(examples).trim();

  if (generatedExample) {
    const sectionHeader: string = `## root/${path}`;
    return [sectionHeader, generatedExample].join("\n");
  }
}

export async function generateGettingStarted(
  references: Reference[],
  structure: string,
  overview: string
): Promise<[string, { [key: string]: any }]> {
  const filteredExamples: any[] = references.filter(
    (file) =>
      file && file["reference_json"] && file["reference_json"]["examples"]
  );

  const summaries: string = filteredExamples
    .map((file) => generateExampleSectionFromFile(file))
    .filter((section) => section !== undefined)
    .join("\n\n");

  const prompt = gettingStartedPrompt(structure, summaries, overview);
  const gettingStarted = await generateGettingStartedSection(prompt);

  const data: { [key: string]: any } = gettingStarted.result.res;

  const title: string = `# ${data["title"]}\n`;
  const description: string = `${data["description"]}\n\n`;
  const intro: string = `## Introduction\n${data["introduction"]}\n\n`;
  const install: string = `## Installation\n${data["installation"]}\n\n`;
  const basicUsage: string = `## Basic Usage\n${data["basic_usage"]}\n\n`;
  const advancedUsage: string = `## Advanced Usage\n${data["advanced_usage"]}\n\n`;

  const guide: string =
    title + description + intro + install + basicUsage + advancedUsage;

  return [guide, data];
}
