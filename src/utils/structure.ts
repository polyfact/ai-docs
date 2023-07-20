import { File, Project } from "../types";

/*
Function Description: This function creates a structure with specified name, path, summary and children.
Default values are provided for all parameters.
Parameters:
- name: string
- path: string
- summary: string
- children: any
Returns: Undefined as no return statement is present in the function.
Exceptions: None as no exceptions are being thrown in the function.
*/
export function createStructure(
  name: string = "root",
  path: string = "root",
  summary: string = "",
  children: any = null
): any {
  if (children === null) {
    children = [];
  }
  return { name: name, path: path, summary: summary, children: children };
}

export function getOrCreateFolder(
  name: string,
  parent: { [key: string]: any }
): { [key: string]: any } {
  for (let child of parent["children"]) {
    if (child["type"] === "folder" && child["name"] === name) {
      return child;
    }
  }

  let newFolder = {
    name: name,
    path: `${parent["path"]}/${name}`.replace(/^\//, ""),
    summary: "",
    content: "",
    children: [],
    type: "folder",
  };
  parent["children"].push(newFolder);
  return newFolder;
}

export function addFileToStructure(
  file: File,
  structure: { [key: string]: any },
  initialFile: File
): void {
  let fileCopy = { ...file };
  if (file["fullPath"] === undefined) {
    fileCopy["fullPath"] = fileCopy["path"];
  }
  let chunkedPath = fileCopy["path"].split("/");
  if (chunkedPath.length === 1) {
    initialFile["type"] = "file";
    structure["children"].push(initialFile);
  } else {
    try {
      let folder = getOrCreateFolder(chunkedPath[0], structure);
      fileCopy["path"] = chunkedPath.slice(1).join("/");
      addFileToStructure(fileCopy, folder, file);
    } catch (e) {
      console.error(e);
    }
  }
}

/**
Function Description: This function creates a project structure from an array of files and returns it as a Project type.

 Parameters: 
 - files: an array of type File[] 
 Returns: 
 - Project: the type of the function's return value.

 Exceptions: 
 - No exceptions can be raised by this function.
*/
export function createStructureFromFiles(files: File[]): Project {
  let rootStructure = createStructure("", "", "", []);
  for (let file of files) {
    addFileToStructure(file, rootStructure, file);
  }

  return rootStructure["children"] as Project;
}
