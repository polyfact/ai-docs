import { generateFolderSummaryInAllFolders } from "../src/folderSummary";

const referencesJson = {
  "test/path": "function explodePath(path) { return path.split('/')}",
  "test/add": "function add(a,b) { return a + b}",
};

(async () => {
  const result = await generateFolderSummaryInAllFolders(
    referencesJson,
    (folder) => {
      console.log(folder);
    }
  );
  console.log(result);
})();
