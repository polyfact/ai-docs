import { generateSummaryFromStructure } from "../src/structure";
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

(async () => {
  console.log(await generateSummaryFromStructure(filesList));
})();

/*
OUTPUT (from console.log):

The project file structure consists of a 'test' folder, containing two files named 'test_1' and 'test_2'. 
There is also a standalone file named 'test_3' outside the 'test' folder. 
The project does not include any details about test files, database management, environment management, APIs, endpoints, programming language, web frameworks, or the type of application being developed. 
Additionally, there is no information available about Linter & Formatter Configurations. 
The structure seems to be limited and lacks important elements for a comprehensive analysis. 
*/
