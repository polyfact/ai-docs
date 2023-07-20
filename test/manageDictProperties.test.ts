import { expect } from "chai";
import { describe, it } from "mocha";
import manageDictProperties, {
  Action,
} from "../src/utils/manageDictProperties";

const inputList = [
  {
    name: "file1",
    path: "/path/to/file1",
    content: "content file1",
    type: "file",
  },
  {
    name: "file2",
    path: "/path/to/file2",
    content: "content file2",
    type: "file",
  },
];

describe("manageDictProperties", () => {
  it("should select properties", () => {
    const properties = ["name", "type"];
    const action = Action.SELECT;
    const result = manageDictProperties(inputList, properties, action);
    expect(result).to.deep.equal([
      { name: "file1", type: "file" },
      { name: "file2", type: "file" },
    ]);
  });

  it("should remove properties", () => {
    const properties = ["path"];
    const action = Action.REMOVE;
    const result = manageDictProperties(inputList, properties, action);
    expect(result).to.deep.equal([
      { name: "file1", type: "file", content: "content file1" },
      { name: "file2", type: "file", content: "content file2" },
    ]);
  });
});
