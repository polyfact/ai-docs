import {
  generateReferenceForEachFile,
  extractDescriptionFromReference,
  generateFolderSummaryInAllFolders,
  generateGettingStarted,
  generateOverview,
  generateSummaryFromStructure,
} from "../src";

import { File, Reference, TFolderSummary } from "../src/types";

const filesList: File[] = [
  {
    content: "\n          def add(a, b):\n              return a + b\n      ",
    name: "add.py",
    path: "src/add.py",
  },
  {
    content:
      "\n          def subtract(a, b):\n              return a - b\n      ",
    name: "subtract.py",
    path: "src/subtract.py",
  },
];

async function generateReferences(files: File[]): Promise<Reference[]> {
  let references: Reference[] = [];
  try {
    await generateReferenceForEachFile(files, (file: Reference) => {
      if (file?.path) {
        references.push(file);
      } else {
        console.info("No path");
      }
      console.info(
        `${Math.round(
          (Object.entries(references).length / files.length) * 100
        )}%`
      );
    });
    return references;
  } catch (e) {
    throw e;
  }
}

async function generateDocumentation(files: File[]) {
  let references: Reference[] = [];
  let folderSummaries: TFolderSummary[] = [];
  let structureSummary = "";
  let referenceDescriptions = {};
  let overview = "";
  let gettingStarted = {};

  let loop = true;

  while (loop) {
    try {
      if ((Object.entries(references).length / files.length) * 100 !== 100) {
        console.info("Generating references...");
        references = await generateReferences(files);
      }
      if (!structureSummary) {
        console.info("Generating structure summary...");
        structureSummary = await generateSummaryFromStructure(files);
      }

      if (!Object.entries(referenceDescriptions).length) {
        console.info("Extracting reference descriptions..");
        referenceDescriptions = extractDescriptionFromReference(references);

        console.info("Generating folder summaries...");
        await generateFolderSummaryInAllFolders(
          referenceDescriptions,
          (content: string, path: string) => {
            folderSummaries.push({ path, content });
          }
        );
      }

      if (!overview) {
        console.info("Generating overview...");
        overview = (await generateOverview(folderSummaries, structureSummary))
          .result;
      }

      console.info("Generating getting started...");
      gettingStarted = await generateGettingStarted(
        references,
        structureSummary,
        overview
      );
    } catch (e) {
      console.info(e);
      continue;
    }

    loop = false;

    console.info(gettingStarted);
  }
}

generateDocumentation(filesList);

/* OUTPUT (from console.info):

# Math Operations: a project for performing addition and subtraction

Math Operations is a project that focuses on implementing mathematical operations. It contains two Python files, 'add.py' and 'subtract.py', located in the 'src' folder. The project follows a modular approach to organizing code.


## Introduction

The Math Operations project is designed to perform addition and subtraction operations. It provides a modular structure for organizing code, with the main files, 'add.py' and 'subtract.py', located in the 'src' folder. This project aims to simplify mathematical computations by providing easy-to-use functions.


In this guide, we will walk you through the installation process, basic usage, and advanced features of the Math Operations project.



## Installation

- **Prerequisites**: Make sure you have Python installed on your system.



- **Clone the repository**: Clone the repository to your local machine by running the following command in your terminal:

```
$ git clone https://github.com/your-username/math-operations.git

```


- **Navigate to the project directory**: Change your current directory to the project's root folder:
```
$ cd math-operations

```


- **Install dependencies**: Install the required dependencies by running the following command:

```
$ pip install -r requirements.txt

```


## Basic Usage

### Addition

To perform addition using Math Operations, follow these steps:

1. Open your terminal

2. Navigate to the project's root directory
3. Execute the following command:

```
$ python src/add.py

```


### Subtraction

To perform subtraction using Math Operations, follow these steps:

1. Open your terminal

2. Navigate to the project's root directory
3. Execute the following command:

```
$ python src/subtract.py

```


## Advanced Usage

### Advanced Features

- *Multiplication*: To perform multiplication operations, you can extend the project's functionality by creating a new Python file in the 'src' folder. Implement the multiplication logic in the new file and follow the same command format for execution.


- *Division*: Similar to multiplication, you can add division functionality to the project by creating a new Python file in the 'src' folder. Implement the division logic in the new file and execute it using the appropriate command.


Note: The examples provided in the above sections cover the basic operations of the Math Operations project. For more advanced mathematical calculations, you can explore the project's source code and extend it with additional functionalities.
*/
