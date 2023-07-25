# AI-DOCS

AI-DOCS is a powerful documentation generator. It analyzes the source code and automatically generates comprehensive documentation, helping you to create meaningful and easy-to-understand references for your projects.

This package is primarily focused on generating:

1. Getting started guides
2. Overviews
3. Summaries from project structure
4. Descriptions of individual files
5. Folder level summaries

[![version](https://img.shields.io/badge/version-1.0.6-blue)](https://github.com/polyfact/ai-docs) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install AI-DOCS.

```bash
npm install ai-docs
```

## Getting Your PolyFact Token

AI-DOCS uses the powerful package called PolyFact to generate AI responses. To use it, you need to get a PolyFact token.

Follow these steps to get your PolyFact token:

1. Go to app.polyfact.com.
2. Connect with GitHub.
3. Copy the token.

Then, you need to export the PolyFact token in your environment:

```bash
export POLYFACT_TOKEN=<your_polyfact_token>
```

Remember to replace `<your_polyfact_token>` with your actual token.

## Usage

To use AI-DOCS, you need to import various functions from the package and use them in your script to generate documentation. The functions should be executed in the order they are shown below. This ensures correct cross-referencing and linking within the generated documentation.

Here's a detailed usage example with each function:

```typescript
import {
  generateReferenceForEachFile,
  extractDescriptionFromReference,
  generateFolderSummaryInAllFolders,
  generateGettingStarted,
  generateOverview,
  generateSummaryFromStructure,
} from "ai-docs-package";
```

```typescript
const filesList: File[] = [
  {
    content: "\n          def add(a, b):\n              return a + b\n      ",
    name: "add.py",
    path: "src/add.py",
  },
  // ...other files...
];
```

1. **generateReferenceForEachFile**

   This function generates a reference for each file in your project. The progress callback allows you to track the progress of the reference generation.

```typescript
generateReferenceForEachFile(filesList, (file: Reference, progress: number) => {
  console.log(`Generated references for ${file.name}. Progress: ${progress}%`);
})
.then((references) => {
  console.log("All references generated.");
});
```

2. **extractDescriptionFromReference**

   This function extracts descriptions from the generated references.

```typescript
const descriptions = extractDescriptionFromReference(references);
console.log(descriptions);
```

3. **generateFolderSummaryInAllFolders**

   This function generates a summary for each folder in your project. The progress callback allows you to track the progress of the summary generation.

```typescript
generateFolderSummaryInAllFolders(descriptions, (content: string, path: string, progress: number) => {
  console.log(`Generated summary for folder ${path}. Progress: ${progress}%`);
})
.then((folderSummaries) => {
  console.log("All folder summaries generated.");
});
```

4. **generateSummaryFromStructure**

   This function generates a summary from your project's structure.

```typescript
generateSummaryFromStructure(filesList)
.then((structureSummary) => {
  console.log(structureSummary);
});
```

5. **generateOverview**

   This function generates an overview of your project.

```typescript
generateOverview(folderSummaries, structureSummary)
.then((overview) => {
  console.log(overview.result);
});
```

6. **generateGettingStarted**

   This function generates a "getting started" guide for your project.

```typescript
generateGettingStarted(references, structureSummary, overview)
.then((gettingStarted) => {
  console.log(gettingStarted);
});
```

## Scripts

This package provides several npm scripts for development:

- `npm run lint` : Lint the codebase using ESLint.
- `npm run build` : Compile TypeScript source files to JavaScript (`dist/`).
- `npm start` : Run the compiled JavaScript entrypoint.
- `npm test` : Run the Mocha test suite.
- `npm run test:watch` : Run the Mocha test suite in watch mode.
- `npm run prepare` : Set up Git Hooks using Husky.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Need Help?

If you run into any issues or need help, please raise an issue on the [GitHub issue tracker](https://github.com/polyfact/ai-docs/issues).
