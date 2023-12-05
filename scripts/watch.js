import { spawn } from "child_process";
import Watcher from "watcher";

var dir_of_interest = process.cwd() + "/src";

// Passing an "all" handler directly
const watcher = new Watcher(
  dir_of_interest,
  {}, // passing some options
  (event, targetPath, targetPathNext) => {
    // This is what the library does internally when you pass it a handler directly
    console.log(event); // => could be any target event: 'add', 'addDir', 'change', 'rename', 'renameDir', 'unlink' or 'unlinkDir'
    console.log(targetPath); // => the file system path where the event took place, this is always provided
    console.log(targetPathNext); // => the file system path "targetPath" got renamed to, this is only provided on 'rename'/'renameDir' events

    console.log("file changed: " + targetPath);
    console.log(`Building...`);

    // Start the 'npm run build' process
    const npmRunBuild = spawn("npm", ["run", "build"], { stdio: "ignore" });

    npmRunBuild.on("close", (code) => {
      console.log(`Build finished`);
    });
  }
);

watcher.on("error", (error) => {
  console.log(error instanceof Error); // => true, "Error" instances are always provided on "error"
});

watcher.on("ready", () => {
  // The app just finished instantiation and may soon emit some events
});
watcher.on("close", () => {
  // The app just stopped watching and will not emit any further events
});

watcher.on("add", (filePath) => {
  console.log(filePath); // "filePath" just got created, or discovered by the watcher if this is an initial event
});
watcher.on("addDir", (directoryPath) => {
  console.log(directoryPath); // "directoryPath" just got created, or discovered by the watcher if this is an initial event
});
watcher.on("change", (filePath) => {
  console.log(filePath); // "filePath" just got modified
});
watcher.on("rename", (filePath, filePathNext) => {
  console.log(filePath, filePathNext); // "filePath" got renamed to "filePathNext"
});
watcher.on("renameDir", (directoryPath, directoryPathNext) => {
  console.log(directoryPath, directoryPathNext); // "directoryPath" got renamed to "directoryPathNext"
});
