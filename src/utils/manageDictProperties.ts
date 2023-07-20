import { File } from "../types";

export enum Action {
  REMOVE = "REMOVE",
  SELECT = "SELECT",
}

/**
Function Description: This function iterates over an input list, manipulates object properties based on the given action ('REMOVE' or 'KEEP'), and returns the modified list.
Parameters:
- inputList: File[]
- properties: string[]
- action: string
Returns: any[]
Exceptions: No specific exceptions can be raised by this function.
*/
export default function manageDictProperties(
  inputList: File[],
  properties: string[],
  action: Action = Action.SELECT
): any[] {
  let result: any[] = [];
  for (let item of inputList) {
    if (typeof item === "object" && item !== null && !Array.isArray(item)) {
      let newDict: { [key: string]: any };
      if (action === "REMOVE") {
        newDict = Object.fromEntries(
          Object.entries(item).filter(([key]) => !properties.includes(key))
        );
      } else {
        newDict = Object.fromEntries(
          Object.entries(item).filter(([key]) => properties.includes(key))
        );
      }

      for (let [key, value] of Object.entries(newDict)) {
        if (Array.isArray(value)) {
          newDict[key] = manageDictProperties(value, properties, action);
        }
      }

      result.push(newDict);
    } else if (Array.isArray(item)) {
      result.push(manageDictProperties(item, properties, action));
    } else {
      result.push(item);
    }
  }
  return result;
}
