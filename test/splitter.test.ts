import { assert } from "chai";
import * as splitter from "../src/utils/splitter";
import { File } from "../src/types";

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

describe("changeFilename", () => {
  it("should change the filename of a file", () => {
    const result = splitter.changeFilename("test/test_1", "test_2");
    assert.equal(result, "test/test_2");
  });
});

describe("splitFile", () => {
  it("should split a file into an array of strings", async () => {
    const result = await splitter.splitFile(filesList[0], 2);

    assert.deepEqual(result, [
      {
        content: "test test",
        name: "test_1_chunk_0",
        path: "test_1_chunk_0",
        originalPath: "test/",
        chunkTotal: 2,
      },
      {
        content: " test",
        name: "test_1_chunk_1",
        path: "test_1_chunk_1",
        originalPath: "test/",
        chunkTotal: 2,
      },
    ] as File[]);
  });

  it("should split a too big files list into an array of strings", async () => {
    const result = await splitter.chunkBigFiles(filesList, 2);
    assert.deepEqual(result, [
      {
        content: "test test",
        name: "test_1_chunk_0",
        path: "test_1_chunk_0",
        originalPath: "test/",
        chunkTotal: 2,
      },
      {
        content: " test",
        name: "test_1_chunk_1",
        path: "test_1_chunk_1",
        originalPath: "test/",
        chunkTotal: 2,
      },
      {
        content: "I have",
        name: "test_2_chunk_0",
        path: "test_2_chunk_0",
        originalPath: "test/",
        chunkTotal: 5,
      },
      {
        content: " 31",
        name: "test_2_chunk_1",
        path: "test_2_chunk_1",
        originalPath: "test/",
        chunkTotal: 5,
      },
      {
        content: " letters,",
        name: "test_2_chunk_2",
        path: "test_2_chunk_2",
        originalPath: "test/",
        chunkTotal: 5,
      },
      {
        content: " it's",
        name: "test_2_chunk_3",
        path: "test_2_chunk_3",
        originalPath: "test/",
        chunkTotal: 5,
      },
      {
        content: " too much",
        name: "test_2_chunk_4",
        path: "test_2_chunk_4",
        originalPath: "test/",
        chunkTotal: 5,
      },
    ] as File[]);
  });
});

// TODO: add more tests to cover each use case

describe("splitFilesByTokenCount", () => {
  it("should partition a string array into two separate string arrays based on the number of tokens ", () => {
    const result = splitter.splitFilesByTokenCount(filesList, 5);
    assert.deepEqual(result, [
      [
        {
          content: "test test test",
          path: "test/",
          name: "test_1",
        },
      ],
      [
        {
          content: "I have 31 letters, it's too much",
          path: "test/",
          name: "test_2",
        },
      ],
    ]);
  });
});
