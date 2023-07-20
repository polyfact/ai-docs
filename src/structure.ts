import { generateWithType, t } from "polyfact";
import { createStructureFromFiles } from "./utils/structure";
import manageDictProperties from "./utils/manageDictProperties";
import { File } from "./types";

// Structure Prompt
/**
Function Description: This function structures a prompt for project file structure analysis.
Parameters:
- content: string
Returns: string
Exceptions: None
*/
function structurePrompt(content: string): string {
  return `
    Given a project file structure in JSON format, please provide a detailed analysis of the project's organization, including an examination of the interplay between files and folders, key folders and files, language-specific files, and CI/CD integration. 
    Evaluate the project structure, noting the presence of test files, database management, environment management, APIs and endpoints, programming language, web frameworks, and the type of application being developed. 
    Additionally, assess the presence of Linter & Formatter Configurations and provide context on their use.
    
    Your response should provide a clear and concise overview of the key elements of the project, including its structure, organization, and management capabilities. 
    You should provide detailed information on each aspect of the project, highlighting its strengths and weaknesses and its potential impact on the project's success.
    
    Please note that your response should provide flexibility for potential variations in the project structure and organization. 
    You should structure your analysis in a way that allows for creative and unique responses while maintaining a clear structure and focus on accuracy.
    Keep it under 200 words.
    Now, make a powerful contextual summary from this structure :  \`\`\`\n${content}\n\`\`\`.
    `;
}

/**
Function Description: This async function processes file properties, creates a project structure from them, and generates a summary from the structure.
Parameters: fileList: Array of file objects
Returns: Promise<string> - A string summary of the project structure generated.
Exceptions: Throws an error if there is an issue in generating summary from structure.
*/
export async function generateSummaryFromStructure(
  fileList: File[]
): Promise<string> {
  try {
    const processedFiles = manageDictProperties(fileList, ["name", "path"]);
    const projectStructure = createStructureFromFiles(processedFiles);

    const result = await generateWithType(
      structurePrompt(JSON.stringify(projectStructure, null, 2)),
      t.type({ summary: t.string })
    );

    return result?.summary;
  } catch (error) {
    console.error(
      `An error occurred while generating summary from structure: ${error}`
    );
    throw error;
  }
}
