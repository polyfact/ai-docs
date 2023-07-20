import { generateGettingStarted } from "../src/gettingStarted";
import { File } from "../src/types";

const ref = [
  {
    fullPath: "src/add.py",
    path: "src/add.py",
    reference_json: {
      references: [],
      description: "",
      examples: [
        {
          title: "add.py",
          description: "Description for add.py",
          example_markdown_language: "python",
          example: "def add(a, b):\n    return a + b",
        },
      ],
    },
  },
  {
    fullPath: "src/subtract.py",
    path: "src/subtract.py",
    reference_json: {
      references: [],
      description: "",
      examples: [
        {
          title: "subtract.py",
          description: "Description for subtract.py",
          example_markdown_language: "python",
          example: "def subtract(a, b):\n    return a - b",
        },
      ],
    },
  },
  {
    fullPath: "src/calculator/calculator.py",
    path: "src/calculator/calculator.py",
    reference_json: {
      references: [],
      description: "",
      examples: [
        {
          title: "calculator.py",
          description: "Description for calculator.py",
          example_markdown_language: "python",
          example:
            "from src.add import add\nfrom src.subtract import subtract\n\nclass Calculator:\n    def __init__(self):\n        self.result = 0\n\n    def add_numbers(self, a, b):\n        self.result = add(a, b)\n        return self.result\n\n    def subtract_numbers(self, a, b):\n        self.result = subtract(a, b)\n        return self.result",
        },
      ],
    },
  },
];

const overview = `The code you provided appears to be a small module or part of a larger program that deals with basic arithmetic operations like addition and subtraction.

Here's a breakdown of the code:

1. **Import Statements**: The code imports two functions, \`add\` and \`subtract\`, from two different modules located at \`src.add\` and \`src.subtract\` respectively. These imported functions are likely to perform the operations of addition and subtraction.

2. **Calculator Class**: A class named \`Calculator\` is defined. A class in Python is like a blueprint for creating objects. 

3. **Class Constructor**: The \`Calculator\` class has a constructor method, \`__init__\`, that is automatically called whenever a new object of this class is created. This constructor initializes an attribute \`result\` to 0.

4. **add_numbers Method**: This class has a method \`add_numbers\` which takes two arguments, \`a\` and \`b\`. It adds these two numbers using the \`add\` function and stores the result in the \`self.result\` attribute. It then returns this result.

5. **subtract_numbers Method**: Similarly, there is a \`subtract_numbers\` method which takes two arguments, \`a\` and \`b\`. It subtracts \`b\` from \`a\` using the \`subtract\` function and stores the result in the \`self.result\` attribute. It then returns this result.

The first part of the code you provided, i.e., \`"def subtract(a, b): return a - b"\`, seems to be a string representation of a function that performs subtraction. It's unclear from the provided context how this string is used, as it is not directly related to the subsequent code.

Overall, this code seems to define a basic calculator that can perform addition and subtraction. The actual addition and subtraction operations are carried out by the \`add\` and \`subtract\` functions imported from elsewhere in the codebase.`;

const structure = `The structure of your project appears to be as follows:

\`\`\`
.
└── src
    ├── add.py
    ├── subtract.py
    └── calculator
        └── calculator.py
\`\`\`

Here is a brief overview of each file:

1. \`add.py\`: This Python file contains a function \`add(a, b)\` that takes two parameters \`a\` and \`b\`, and returns their sum.

2. \`subtract.py\`: This Python file contains a function \`subtract(a, b)\` that takes two parameters \`a\` and \`b\`, and returns the result of \`a\` subtracted by \`b\`.

3. \`calculator/calculator.py\`: This Python file contains a class \`Calculator\` which uses the \`add\` and \`subtract\` functions from the \`add.py\` and \`subtract.py\` files respectively. The \`Calculator\` class has two methods:
    - \`add_numbers(a, b)\`: This method uses the \`add\` function to add the numbers \`a\` and \`b\`, and stores the result in the \`result\` attribute of the \`Calculator\` object.
    - \`subtract_numbers(a, b)\`: This method uses the \`subtract\` function to subtract the number \`b\` from \`a\`, and stores the result in the \`result\` attribute of the \`Calculator\` object.

This project seems to be a simple calculator application that performs addition and subtraction operations.`;

(async () => {
  console.log(await generateGettingStarted(ref, structure, overview));
})();

/*
OUTPUT (from console.log):

The project file structure consists of a 'test' folder, containing two files named 'test_1' and 'test_2'. 
There is also a standalone file named 'test_3' outside the 'test' folder. 
The project does not include any details about test files, database management, environment management, APIs, endpoints, programming language, web frameworks, or the type of application being developed. 
Additionally, there is no information available about Linter & Formatter Configurations. 
The structure seems to be limited and lacks important elements for a comprehensive analysis. 
*/
