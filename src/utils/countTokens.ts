import { TiktokenModel, encodingForModel } from "js-tiktoken";

export default function countTokens(
  str: string,
  modelName: TiktokenModel = "gpt-4"
): number {
  try {
    return encodingForModel(modelName).encode(str).length;
  } catch (error) {
    console.error(
      `Error occurred while encoding and counting tokens: ${error}`
    );
    throw new Error(`Unable to count tokens for the model: ${modelName}`);
  }
}
