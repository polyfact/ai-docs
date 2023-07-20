import { generateWithTypeWithTokenUsage, t } from "polyfact";
import { TFolderSummary, TResponseWithTokenUsage } from "./types";

// Overview Prompt
function overviewPrompt(
  functionality: string,
  purpose: string,
  summaries: string
) {
  return `
Analyze the given content and provide a usefull overview of the project. : 

1.  Code Functionality: 
    \`\`\`\n${functionality}\n\`\`\`
2. Purpose:
    \`\`\`\n${purpose}\n\`\`\`
3. Summaries of the project:
    \`\`\`\n${summaries}\n\`\`\`


Now, create a useful and complete overview of the IT project should cover various aspects that provide a clear understanding of the project's purpose, its structure, and how to interact with it.
Here are the key components you should include:

1. **Introduction**: A brief explanation of what the project is, its purpose, and what problem it solves.

2. **Features**: A list or description of the main features or functionalities of the project.
    Highlight any unique or innovative aspects.

3. **Architecture**: A high-level explanation of the project's architecture.
    This could include the main components of the system and how they interact, the technologies and frameworks used, or any relevant design patterns or principles.

4. **Installation and Configuration**: Some things to not forget during the installation and configuation. No need to be too detailed since the detailed version will be written later. Just provide some things not to forget.

5. **Basic Usage**: A brief explanation of what are the basic functionalities of the project that should be explained in the getting started as well as the file(s) most probable to be relevant to it. No need to be too detailed. Just list the functionalities.

6. **API Documentation**: If your project provides an API, include detailed API documentation.
    This should cover all endpoints, methods, parameters, and responses, along with examples.
    If there is no API, you can skip this section.

7. **Advanced Usage**: In the getting started Advanced usage section and specific guide sections, some subjects might need to be explained in more detail. List them here. Use the functionality listed in the "Code functionnality" section. If there is no advanced functionnalities, just write "No Advanced usage needed" and skip. Take into account what you are seeing. If it's a game for example, advanced usage will be related to using the game and not touching anything in the deep code.

8. **Testing**: Information on how to run and write tests for the project.
    Explain the testing framework used and any relevant commands.

Remember, the goal is to provide a comprehensive yet concise overview of the project.
Be specific ! Don't write a Prompt, but a real overview of the project.
Don't use any markdown. Just write in plain English.
`;
}

// Code Functionality Prompt

function overviewCodeFunctionalityPrompt(
  summaries: string,
  structure: string
): string {
  return `
Analyze the given content and provide a summary "Code functionality". 
You must to examine the code to determine its primary purpose and key functions.

Here are summaries that explain the project :
\`\`\`\n${summaries}\n\`\`\`

Here is the summary of the structure project to help you for creating the overview of "Code Functionality":
\`\`\`\n${structure}\n\`\`\`

Now, Create a summary of code functionalities involves explaining what the code does in a high-level, easy-to-understand manner. 
Here are steps you can follow to create a concise and accurate summary:
Write a one-line summary of each functionnalities.
Do not list files or functions but functionnalities. For example "Create a new user" is a functionnality. "lib Folder" is not.
Use the informations you have. Don't worry about missing some functionnalities. It's intended as a broad list.
Do not write a template, but a real summary of the code functionalities.
Write everything in a list

Always consider your audience's needs and knowledge level, and aim to make your summary as clear and understandable as possible.

`;
}

// Purpose Prompt
function overviewPurposePrompt(summaries: string, structure: string): string {
  return `
Analyze the given content and provide a summary "Purpose" of the project. 
You must to examine the code to determine its primary purpose and key functions.

Here are summaries that explain the project :
\`\`\`\n${summaries}\n\`\`\`

Here is the summary of the structure project to help you for creating the overview of "Code Functionality":
\`\`\`\n${structure}\n\`\`\`

Now, Create a summary of the "Purpose" to explain why the software, library, or feature exists and what it's meant to achieve. 
Here are the steps to create a clear and effective "Purpose" section:

1. **Describe the Software/System**: Start by giving a brief description of what the software or system does. 
    This should be a high-level overview that's understandable even to non-technical readers.

2. **Explain the Need**: Explain the problem or need that the software or system addresses. 
    This helps users understand why the software or system exists in the first place.

3. **Highlight the Benefits**: Talk about the benefits that the software or system provides. 
    This might include increased efficiency, improved accuracy, cost savings, or any other advantages.

4. **Identify the Users**: Identify who the intended users of the software or system are. 
    This could be a specific profession (like data scientists or web developers), a type of user (like home users or business users), or a more general category (like anyone who needs to manage large amounts of data).

5. **Outline the Features**: Briefly outline the main features or capabilities of the software or system. 
    This gives users a sense of what they can achieve with it.

6. **Connect to Larger Context**: If applicable, explain how the software or system fits into a larger context. 
    For example, it might be a part of a suite of tools, or it might integrate with other common software in its domain.

7. **Reference to Detailed Description**: At the end of the "Purpose" section, provide a reference or link to a more detailed description of the software or system for users who wish to learn more.

Remember, the "Purpose" section should be clear, concise, and engaging. 
`;
}

async function generateOverviewSection(prompt: string): Promise<string> {
  try {
    let response = await generateWithTypeWithTokenUsage(
      prompt,
      t.type({ summary: t.string })
    );

    return response?.result?.summary;
  } catch (error) {
    console.error(
      `An error occurred while generating summary from structure: ${error}`
    );
    throw error;
  }
}

export async function generateOverview(
  foldersSummaries: TFolderSummary[],
  structureSummary: string
): TResponseWithTokenUsage {
  try {
    const listOfFolderSummaries: string[] = foldersSummaries
      .filter((f) => f["path"].includes("/"))
      .map((f) => f["content"]);
    const summaries: string = listOfFolderSummaries.join("\n");

    const purpose: string = await generateOverviewSection(
      overviewPurposePrompt(summaries, structureSummary)
    );

    const functionality: string = await generateOverviewSection(
      overviewCodeFunctionalityPrompt(summaries, structureSummary)
    );

    const prompt = overviewPrompt(functionality, purpose, summaries);

    const responseType = t.type({ overview: t.string });
    const response = await generateWithTypeWithTokenUsage(prompt, responseType);

    responseType.decode(response?.result);

    return response;
  } catch (error) {
    console.error(
      `An error occurred while generating summary from structure: ${error}`
    );
    throw error;
  }
}
