import { assert } from "chai";
import { File } from "../src/types";

import { generateReferenceForEachFile } from "../src/fileReference";

const filesList: File[] = [
  {
    content: "test test test",
    path: "test/",
    name: "test_1",
  },
  {
    content: "I have 31 letters, it's too much",
    path: "test/",
    name: "test_2",
  },
];

describe("fileReference", () => {
  it.only("should generate a reference for each file", async () => {
    const result = await generateReferenceForEachFile(filesList);
    console.log(result);
  });
});
