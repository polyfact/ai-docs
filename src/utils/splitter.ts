import { basename, dirname, extname, join } from "path";
import { Reference, File, Languages } from "../types";
import {
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
} from "langchain/text_splitter";

import { getEncodingNameForModel, TiktokenModel } from "js-tiktoken";

import dedent from "ts-dedent";

import { flatten } from "lodash"; // Import flatten from lodash package

import dotenv from "dotenv";

import countTokens from "./countTokens";
import { fileTypes } from "../constants/fileTypes";
import { languages } from "../constants/separators";

dotenv.config();

const { OPENAI_MODEL_NAME } = process.env;

const CHUNK_OVERLAP = 256;

export function changeFilename(path: string, newFileName: string): string {
  let directory = dirname(path);
  let newFilePath = join(directory, newFileName);

  return newFilePath;
}

export async function splitFile(
  file: File,
  chunkSize: number
): Promise<File[]> {
  try {
    let newFileList: string[] = [];

    let filename: string = basename(file.name || "", extname(file.name || ""));
    let extension: string = extname(file.name || "");

    const encodingName = getEncodingNameForModel(
      (OPENAI_MODEL_NAME || "gpt-3.5-turbo") as TiktokenModel
    );

    if (fileTypes.includes(extension)) {
      let separators = (languages as Languages)[extension].separators;
      let codeSplitter = new RecursiveCharacterTextSplitter({
        separators,
        chunkSize,
        chunkOverlap: 0,
      });

      let code = dedent(file.content || "");

      newFileList = await codeSplitter.splitText(code);

      for (let f of newFileList) {
        if (countTokens(f) > chunkSize) {
          let splitter = new TokenTextSplitter({
            encodingName,
            chunkSize,
            chunkOverlap: Math.floor(chunkSize / 100),
          });
          let splittedText = await splitter.splitText(f);
          newFileList = newFileList
            .filter((item) => item !== f)
            .concat(splittedText);
        }
      }
    } else {
      let splitter = new TokenTextSplitter({
        encodingName,
        chunkSize,
        chunkOverlap: Math.floor(chunkSize / 100),
      });
      newFileList = await splitter.splitText(file.content || "");
    }

    let fileInfoList: File[] = [];

    for (let index = 0; index < newFileList.length; index++) {
      let chunk = newFileList[index];
      let newFilename = `${filename}_chunk_${index}${extension}`;

      let newPath = changeFilename(file.path, newFilename);
      let fileInfo: File = {
        content: chunk,
        name: newFilename,
        path: newPath,
        originalPath: file.path,
        chunkTotal: newFileList.length,
      };

      fileInfoList.push(fileInfo);
    }

    return fileInfoList;
  } catch (e) {
    return [];
  }
}

export async function chunkBigFiles(
  fileList: File[],
  chunkSize: number
): Promise<File[]> {
  try {
    let nestedFileList: File[][] = [];
    for (const file of fileList) {
      const splittedFiles = await splitFile(file, chunkSize);
      nestedFileList.push(splittedFiles);
    }
    return flatten(nestedFileList);
  } catch (e) {
    return fileList;
  }
}

// TODO: add filter by if it has a summary

export function splitFilesByTokenCount(
  fileList: File[],
  threshold: number
): [File[], File[]] {
  let filesAboveThreshold: File[] = [];
  let filesBelowOrEqualThreshold: File[] = [];

  for (let file of fileList) {
    let tokensCount = countTokens(file.content || "");

    if (tokensCount <= threshold) {
      filesBelowOrEqualThreshold.push(file);
    } else {
      filesAboveThreshold.push(file);
    }
  }

  return [filesBelowOrEqualThreshold, filesAboveThreshold];
}
