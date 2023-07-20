import { expect } from "chai";
import { describe, it } from "mocha";
import {
  folderSummaryPrompt,
  structureFromPaths,
  generateFolderSummaryFromStructure,
  generateFolderSummaryInAllFolders,
  extractDescriptionFromReference,
} from "../src/folderSummary";

const referencesJson = [
  {
    path: "test/path1",
    content: {
      description: "description 1",
    },
  },
  {
    path: "test/path3",
    content: {
      description: "description 3",
    },
  },
  {
    path: "path2",
    content: {
      description: "description 2",
    },
  },
];

// TODO: add more tests to cover each use case

describe("extractDescriptionFromReference", () => {
  it("should extract description from reference", async () => {
    const expected = {
      "test/path1": "description 1",
      "test/path3": "description 3",
      path2: "description 2",
    };

    const result = extractDescriptionFromReference(referencesJson);
    expect(result).to.deep.equal(expected);
  });
});

describe("folderSummaryPrompt", () => {
  it("should return a formatted string", () => {
    const content = "test content";
    const result = folderSummaryPrompt(content);

    expect(result).to.include(content);
  });
});

describe("structureFromPaths", () => {
  it("should return a structured object", () => {
    const descriptions = extractDescriptionFromReference(referencesJson);
    const result = structureFromPaths(descriptions);

    expect(result).to.deep.equal({
      path2: "description 2",
      test: {
        path1: "description 1",
        path3: "description 3",
      },
    });
  });
});

describe("generateFolderSummaryFromStructure", function () {
  this.timeout(30000);

  it("should return a summary object", async () => {
    const descriptions = extractDescriptionFromReference(referencesJson);

    const structure = structureFromPaths(descriptions);
    const result = await generateFolderSummaryFromStructure(structure);

    expect(result).to.have.property("test/");
    expect(result).to.have.property("");
  });
});

describe("generateFolderSummaryInAllFolders", function () {
  this.timeout(30000);

  it("should return a summary object", async () => {
    const descriptions = extractDescriptionFromReference(referencesJson);
    const result = await generateFolderSummaryInAllFolders(descriptions);

    expect(result).to.have.property("test/");
    expect(result).to.have.property("");
  });
});
