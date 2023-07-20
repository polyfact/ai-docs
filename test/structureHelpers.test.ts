import { expect } from "chai";
import { describe, it } from "mocha";
import {
  createStructureFromFiles,
  createStructure,
  getOrCreateFolder,
  addFileToStructure,
} from "../src/utils/structure";
import { clone } from "lodash";

const file = { path: "src/test", name: "test", content: "test content" };

// TODO: add more tests to cover each use case

describe("File Structure", () => {
  describe("createStructure", () => {
    it("should create a structure with default values", () => {
      const structure = createStructure();
      expect(structure).to.deep.equal({
        name: "root",
        path: "root",
        summary: "",
        children: [],
      });
    });
  });

  describe("getOrCreateFolder", () => {
    it("should get existing folder", () => {
      const parent = { children: [{ type: "folder", name: "test" }] };
      const folder = getOrCreateFolder("test", parent);
      expect(folder).to.deep.equal({ type: "folder", name: "test" });
    });

    it("should create new folder if not exists", () => {
      const structure = createStructure("", "", "", []);
      const folder = getOrCreateFolder("test", structure);
      expect(folder).to.deep.equal({
        name: "test",
        path: "test",
        summary: "",
        content: "",
        children: [],
        type: "folder",
      });
    });
  });

  describe("addFileToStructure", () => {
    it("should add a file to a new folder in the structure", () => {
      const structure = createStructure("", "", "", []);
      const initialFile = clone(file);

      addFileToStructure(file, structure, initialFile);
      expect(structure.children[0]).to.have.a.property("children");
    });
  });

  describe("createStructureFromFiles", () => {
    it("should create a structure from a list of files", () => {
      const files = [file];
      const structure = createStructureFromFiles(files);
      expect(structure[0]).to.have.a.property("type");
    });
  });
});
