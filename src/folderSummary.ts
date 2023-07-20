import { generateWithTypeWithTokenUsage, t } from "polyfact";

export function folderSummaryPrompt(content: string): string {
  return `
Give me a complete and detailed 500 words summary from all these summaries. 
The summary should be contextual and explain exactly what the code that was summarized does.
Here is all summaries that you have to process : \`\`\`\n${content}\n\`\`\`"
`;
}

export function structureFromPaths(
  referencesJson: { [key: string]: any },
  paths: string[] = Object.keys(referencesJson),
  prefix: string = ""
): { [key: string]: any } {
  const files: [string, string][] = paths.map((path) => [
    path.split("/")[0],
    path.split("/").slice(1).join("/"),
  ]);
  const structure: { [key: string]: any } = {};
  for (const file of files) {
    if (!(file[0] in structure)) {
      structure[file[0]] = [];
    }
    if (file[1] !== "") {
      structure[file[0]].push(file[1]);
    }
  }

  for (const key in structure) {
    if (structure[key].length === 0) {
      try {
        structure[key] = referencesJson[prefix + key];
      } catch (e) {
        console.error(e);
        console.error(prefix + key);
      }
    } else {
      structure[key] = structureFromPaths(
        referencesJson,
        structure[key],
        prefix + key + "/"
      );
    }
  }

  return structure;
}

export async function generateFolderSummaryFromStructure(
  structure: { [key: string]: any },
  updateFolderProgress: (summary: string, path: string) => void = () => {},
  prefix: string = "",
  summaries: { [key: string]: string } = {}
): Promise<{ [key: string]: string }> {
  for (const key in structure) {
    if (typeof structure[key] === "object" && structure[key] !== null) {
      summaries = await generateFolderSummaryFromStructure(
        structure[key],
        updateFolderProgress,
        prefix + key + "/",
        summaries
      );
      structure[key] = summaries[prefix + key + "/"];
    }
  }

  const mergedSummaries: string = Object.values(structure)
    .filter((value) => value)
    .join("\n\n");

  const prompt = folderSummaryPrompt(mergedSummaries);

  const response = await generateWithTypeWithTokenUsage(
    prompt,
    t.type({ summary: t.string })
  );

  updateFolderProgress(response?.result?.summary, prefix);
  summaries[prefix] = response?.result?.summary;

  return summaries;
}

export function extractDescriptionFromReference(referencesJson: {
  [key: string]: any;
}) {
  return referencesJson.reduce(
    (obj: { [key: string]: any }, file: { [key: string]: any }) => {
      obj[file["path"]] = file["content"]["description"];
      return obj;
    },
    {}
  );
}

export async function generateFolderSummaryInAllFolders(
  referencesJson: { [key: string]: string },
  updateFolderProgress: (summary: string, path: string) => void = () => {}
): Promise<{ [key: string]: string }> {
  const structure = structureFromPaths(referencesJson);
  const summaries = await generateFolderSummaryFromStructure(
    structure,
    updateFolderProgress
  );
  return summaries;
}
