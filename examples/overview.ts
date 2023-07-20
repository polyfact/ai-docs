import { generateOverview } from "../src/overview";
import { TFolderSummary } from "../src/types";

const folderSummary: TFolderSummary[] = [
  {
    content:
      "The extension.ts file is a TypeScript file that contains the implementation of a Visual Studio Code extension. The file defines several functions that are used to enhance the functionality of the editor. These functions include getting the active editor, registering commands, and handling activation and deactivation events. The file also imports and uses other modules and utilities to perform specific tasks.\nThis file defines the configuration constants for the API endpoints of the application. It specifies the base URL for the API requests and the endpoint for commenting on the API.\nThis file contains the implementation of an APIHandler class, which provides methods for making API calls. The class uses the axios library to send HTTP requests. It also defines a cancelOperation method to cancel a pending API request.",
    path: "extension.ts",
  },
  {
    content:
      "The extension.ts file is a TypeScript file that contains the implementation of a Visual Studio Code extension. The file defines several functions that are used to enhance the functionality of the editor. These functions include getting the active editor, registering commands, and handling activation and deactivation events. The file also imports and uses other modules and utilities to perform specific tasks.\n",
    path: "test/test_2",
  },
  {
    content: "this function destroys the overview function",
    path: "test/destroyer.ts",
  },
];

(async () => {
  const structureSummary = `
  The project has a single top-level folder named 'src', which contains several files.
  It appears to be a software project developed in an unknown programming language.
  There are key files such as 'helpers.ts', 'extension.ts', 'api.ts', 'config.ts', and 'commentUtils.ts'.
  It seems to follow a modular approach, as each file serves a different purpose.
  However, without further information, it is difficult to determine the exact nature of the application being developed.
  The project structure does not include any sub-folders or test files.
  There is no information about database management, environment management, or specific APIs and endpoints.
  The presence of 'helpers.ts' suggests the project might utilize helper functions.
  There is no information about the existence of a linter or formatter configuration.
  Without more context, it is challenging to assess the project's strengths, weaknesses, and its potential impact on success.
  Further information is needed to provide a more detailed analysis.
`;

  console.log(await generateOverview(folderSummary, structureSummary));
})();

/*
OUTPUT (from console.log):

This project is a software application designed to provide a clear and concise summary of the purpose, functionality, and benefits of a given project.
It aims to assist users in understanding the primary objective and key features of the project, helping them determine if it meets their specific needs.
The main features of the project include the ability to analyze code and project structure, extract relevant information, and generate a comprehensive summary.
The project architecture follows a modular design, with various components interacting to achieve its functionalities.
Technologies and frameworks used include [list of technologies and frameworks].
During installation and configuration, it is important to set up [specific configuration details].
The basic usage of the project involves [list of basic functionalities] and is explained in the project's getting started guide and relevant file(s).
The project does not provide an API.
For advanced usage, users can explore [list of advanced functionalities] which are explained in the project's advanced guide sections.
Testing for the project can be done using [testing framework] with relevant commands provided in the testing documentation.
*/
