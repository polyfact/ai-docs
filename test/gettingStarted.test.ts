import { expect } from "chai";
import { describe, it } from "mocha";
import {
  gettingStartedPrompt,
  generateExampleFromJson,
  generateExampleFromJsons,
  generateExampleSectionFromFile,
  generateGettingStarted,
} from "../src/gettingStarted";
import { Reference } from "../src/types";

describe("Getting Started Module", function () {
  this.timeout(120000);
  it("gettingStartedPrompt should return a formatted string", () => {
    const result = gettingStartedPrompt("structure", "summaries", "overview");
    expect(result).to.be.a("string");
    expect(result).to.include("structure");
    expect(result).to.include("summaries");
    expect(result).to.include("overview");
  });

  it("generateExampleFromJson should return a formatted string or undefined", () => {
    const json = {
      title: "Test",
      description: "Test description",
      example_markdown_language: "bash",
      example: 'echo "Hello, World!"',
    };
    const result = generateExampleFromJson(json);
    expect(result).to.be.a("string");
    expect(result).to.include("Test");
    expect(result).to.include("Test description");
    expect(result).to.include('echo "Hello, World!"');
  });

  it("generateExampleFromJsons should return a formatted string", () => {
    const jsons = [
      {
        title: "Test1",
        description: "Test description1",
        example_markdown_language: "bash",
        example: 'echo "Hello, World!1"',
      },
      {
        title: "Test2",
        description: "Test description2",
        example_markdown_language: "bash",
        example: 'echo "Hello, World!2"',
      },
    ];
    const result = generateExampleFromJsons(jsons);
    expect(result).to.be.a("string");
    expect(result).to.include("Test1");
    expect(result).to.include("Test2");
    expect(result).to.include('echo "Hello, World!1"');
    expect(result).to.include('echo "Hello, World!2"');
  });

  it("generateExampleSectionFromFile should return a formatted string or undefined", () => {
    const file = {
      fullPath: "path/to/file",
      path: "path/to/file",
      reference_json: {
        examples: [
          {
            title: "Test",
            description: "Test description",
            example_markdown_language: "bash",
            example: 'echo "Hello, World!"',
          },
        ],
      },
    };
    const result = generateExampleSectionFromFile(file);
    expect(result).to.be.a("string");
    expect(result).to.include("## root/path/to/file");
    expect(result).to.include("Test");
    expect(result).to.include("Test description");
    expect(result).to.include('echo "Hello, World!"');
  });

  it("generateGettingStarted should return a guide and data", async () => {
    const references: Reference[] = [];
    const structure = "structure";
    const overview = "overview";
    const [guide, data] = await generateGettingStarted(
      references,
      structure,
      overview
    );
    expect(guide).to.be.a("string");
    expect(data).to.be.an("object");
  });
});
