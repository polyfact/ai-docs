type ReferenceJson = {
  description: string;
  references: any[];
};

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

export type File = {
  path: string;
  name: string;
  content: string;
  [key: string]: any;
};

interface LanguageDetails {
  language: string;
  separators: string[];
}

type Languages = {
  [extension: string]: LanguageDetails;
};
