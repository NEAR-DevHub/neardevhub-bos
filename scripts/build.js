import fs from "fs";
import replaceInFiles from "replace-in-files";

const transpiledPathPrefix = "./build/src";

async function build() {
  await replaceInFiles({
    files: [`${transpiledPathPrefix}/**/*.jsx`],
    from: /export\s+default\s+function\s+(\w+)\((.*)/gms,
    to: (_match, funcName, rest) =>
      `function ${funcName}(${rest}\nreturn ${funcName}(props, context);`,
  });

  await replaceInFiles({
    files: [`${transpiledPathPrefix}/**/*.jsx`],
    from: /^export /,
    // NOTE: Empty string is ignored, so we use a function workaround it
    to: () => "",
  });

  console.log("DONE");
}

build();
