import { generateReferenceForEachFile } from "../src/fileReference";
import { File } from "../src/types";

const filesList: File[] = [
  {
    content: "function test() {console.log('test')}",
    path: "test/test_1",
    name: "test_1",
  },
  {
    content: "I have 31 letters, it's too much",
    path: "test/test_2",
    name: "test_2",
  },
];

generateReferenceForEachFile(filesList, (file) => {
  console.log({ progress: file });
});
