const fs = require("fs");
const replaceInFiles = require("replace-in-files");

const options = {
  files: ["src/**/*.jsx"],
  from: /\/\* INCLUDE: "common\.jsx" \*\/.*\/\* END_INCLUDE: "common\.jsx" \*\//gms,
  to: `/* INCLUDE: "common.jsx" */\n${fs
    .readFileSync("./common.jsx", "utf8")
    .toString()}/* END_INCLUDE: "common.jsx" */`,
};

replaceInFiles(options)
  .pipe({
    from: /\/\* INCLUDE: "shared\/lib\/form" \*\/.*\/\* END_INCLUDE: "shared\/lib\/form" \*\//gms,
    to: `/* INCLUDE: "shared/lib/form" */\n${fs
      .readFileSync("./shared/lib/form.js", "utf8")
      .toString()}/* END_INCLUDE: "shared/lib/form" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "shared\/lib\/gui" \*\/.*\/\* END_INCLUDE: "shared\/lib\/gui" \*\//gms,
    to: `/* INCLUDE: "shared/lib/gui" */\n${fs
      .readFileSync("./shared/lib/gui.js", "utf8")
      .toString()}/* END_INCLUDE: "shared/lib/gui" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "shared\/lib\/uuid" \*\/.*\/\* END_INCLUDE: "shared\/lib\/uuid" \*\//gms,
    to: `/* INCLUDE: "shared/lib/uuid" */\n${fs
      .readFileSync("./shared/lib/uuid.js", "utf8")
      .toString()}/* END_INCLUDE: "shared/lib/uuid" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "shared\/mocks" \*\/.*\/\* END_INCLUDE: "shared\/mocks" \*\//gms,
    to: `/* INCLUDE: "shared/mocks" */\n${fs
      .readFileSync("./shared/mocks.js", "utf8")
      .toString()}/* END_INCLUDE: "shared/mocks" */`,
  })
  .then(({ changedFiles, countOfMatchesByPaths }) => {
    console.log("DONE");
  })
  .catch(console.error);
