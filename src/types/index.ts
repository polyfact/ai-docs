export type Reference = {
  reference_json?: ReferenceJson;

  originalPath?: string;
  reference?: string;
  content?: string;
  summary?: string;
  path?: string;
  name?: string;

  chunk?: number;
  chunkTotal?: number;
};

export type Example = {
  title: string;
  description: string;
  example_markdown_language: string;
  example: string;
};

export type ReferenceJson = {
  description: string;
  references: Reference[];
  examples: Example[];
};

export type File = {
  path: string;
  name: string;
  content: string;
  [key: string]: any;
};

export type TFolderSummary = {
  path: string;
  content: string;
};

export type Folder = {
  name: string;
  path: string;
  type: string;
  summary?: string;
  content?: string[];
  children?: Project;
};

export type Project = Array<File | Folder>;

interface LanguageDetails {
  language: string;
  separators: string[];
}

export type Languages = {
  [extension: string]: LanguageDetails;
};

export type TResponseWithTokenUsage = Promise<{
  tokenUsage: { input: number; output: number };
  result: any | string;
}>;
