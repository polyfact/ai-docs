import { assert, expect } from "chai";
import { File } from "../src/types";

import { generateReferenceForEachFile } from "../src/fileReference";

const filesList: File[] = [
  {
    content: "test test test",
    path: "test/test_1",
    name: "test_1",
  },
  {
    content: "I have 31 letters, it's too much",
    path: "test/test_2",
    name: "test_2",
  },
];

// TODO: add more tests to cover each use case

describe("fileReference", function () {
  this.timeout(120000);
  it("should generate a reference for each file", async () => {
    const result = await generateReferenceForEachFile(filesList);

    expect(result[0]).to.have.property("reference_json");
    expect(result[0]).to.have.property("originalPath");
  });
});
