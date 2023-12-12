import { spawn } from "child_process";
import Watcher from "watcher";

const npmRunBuildInitial = spawn("npm", ["run", "build"]);
console.log("Building..");
npmRunBuildInitial.on("close", () => console.log("Initial build finished"));

var dir_of_interest = process.cwd() + "/src";

const watcher = new Watcher(dir_of_interest, {
  depth: 20,
  debounce: 300,
  ignoreInitial: true,
  persistent: true,
  renameDetection: true,
  recursive: true,
});

watcher.on("error", (error) => {
  console.log(error instanceof Error); // => true, "Error" instances are always provided on "error"
});

watcher.on("all", (event, targetPath, targetPathNext) => {
  console.log(`${event} detected in file: ${targetPath}`);
  if (targetPathNext) {
    console.log("file path changed to: " + targetPathNext);
  }
  process.stdout.write(`Building..`);

  // Start the 'npm run build' process
  const npmRunBuild = spawn("npm", ["run", "build"], { stdio: "ignore" });

  npmRunBuild.on("close", () => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Build finished\n`);
  });
});
