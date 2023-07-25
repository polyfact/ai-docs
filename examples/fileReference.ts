import { generateReferenceForEachFile } from "../src";
import { File } from "../src/types";

const filesList: File[] = [
  {
    content: "\n          def add(a, b):\n              return a + b\n      ",
    name: "add.py",
    path: "src/add.py",
  },
  {
    content:
      "\n          def subtract(a, b):\n              return a - b\n      ",
    name: "subtract.py",
    path: "src/subtract.py",
  },
  {
    content:
      "\n          from src.add import add\n          from src.subtract import subtract\n\n          class Calculator:\n              def __init__(self):\n                  self.result = 0\n\n              def add_numbers(self, a, b):\n                  self.result = add(a, b)\n                  return self.result\n\n              def subtract_numbers(self, a, b):\n                  self.result = subtract(a, b)\n                  return self.result\n      ",
    name: "calculator.py",
    path: "src/calculator/calculator.py",
  },
];

generateReferenceForEachFile(filesList, (file) => {
  console.log({ progress: file });
});
