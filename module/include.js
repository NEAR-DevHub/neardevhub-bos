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
    from: /\/\* INCLUDE: "core\/lib\/data-request" \*\/.*\/\* END_INCLUDE: "core\/lib\/data-request" \*\//gms,
    to: `/* INCLUDE: "core/lib/data-request" */\n${fs
      .readFileSync("./module/core/lib/data-request.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/data-request" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/gui\/form" \*\/.*\/\* END_INCLUDE: "core\/lib\/gui\/form" \*\//gms,
    to: `/* INCLUDE: "core/lib/gui/form" */\n${fs
      .readFileSync("./module/core/lib/gui/form.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/gui/form" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/uuid" \*\/.*\/\* END_INCLUDE: "core\/lib\/uuid" \*\//gms,
    to: `/* INCLUDE: "core/lib/uuid" */\n${fs
      .readFileSync("./module/core/lib/uuid.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/uuid" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/autocomplete" \*\/.*\/\* END_INCLUDE: "core\/lib\/autocomplete" \*\//gms,
    to: `/* INCLUDE: "core/lib/autocomplete" */\n${fs
      .readFileSync("./module/core/lib/autocomplete.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/autocomplete" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "entity\/viewer" \*\/.*\/\* END_INCLUDE: "entity\/viewer" \*\//gms,
    to: `/* INCLUDE: "entity/viewer" */\n${fs
      .readFileSync("./module/entity/viewer.js", "utf8")
      .toString()}/* END_INCLUDE: "entity/viewer" */`,
  })
  .then(({ changedFiles, countOfMatchesByPaths }) => {
    console.log("DONE");
  })
  .catch(console.error);
