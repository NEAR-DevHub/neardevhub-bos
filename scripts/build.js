import fs from "fs";
import replaceInFiles from "replace-in-files";

const transpiledPathPrefix = "./build/src";

async function build() {
  // await replaceInFiles({
  //   files: [`${transpiledPathPrefix}/**/*.jsx`],
  //   from: /export\s+default\s+function[^(]*\((.*)/gms,
  //   to: (_match, rest) =>
  //     `function MainComponent(${rest}\nreturn MainComponent(props, context);`,
  // });
  // TODO test
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

  // WARNING: Don't allow "imports" in includes as this may lead to undefined
  // behavior as replacements are done in parallel and one file may be getting
  // replacements saved while the other file needs to include it, which ends up
  // with empty content includes.
  await new Promise((resolve) => {
    fs.rename(
      `${transpiledPathPrefix}/includes`,
      `${transpiledPathPrefix}/../../includes`,
      () => {
        resolve();
      }
    );
  });

  const packageJson = JSON.parse(
    fs.readFileSync(new URL("../package.json", import.meta.url))
  );

  // await replaceInFiles({
  //   files: [`${transpiledPathPrefix}/**/*.jsx`],
  //   from: /^/m,
  //   to: `/*\nLicense: ${packageJson.license}\nAuthor: ${packageJson.author}\nHomepage: ${packageJson.homepage}\n*/\n`,
  // });

  await new Promise((resolve) => {
    fs.rename(
      transpiledPathPrefix,
      `${transpiledPathPrefix}/../../${packageJson.name}`,
      () => {
        resolve();
      }
    );
  });

  console.log("DONE");
}

build();
