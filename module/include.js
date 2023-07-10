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
    from: /\/\* INCLUDE: "core\/lib\/gui\/form" \*\/.*\/\* END_INCLUDE: "core\/lib\/gui\/form" \*\//gms,
    to: `/* INCLUDE: "core/lib/gui/form" */\n${fs
      .readFileSync("./module/core/lib/gui/form.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/gui/form" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/gui\/attractable" \*\/.*\/\* END_INCLUDE: "core\/lib\/gui\/attractable" \*\//gms,
    to: `/* INCLUDE: "core/lib/gui/attractable" */\n${fs
      .readFileSync("./module/core/lib/gui/attractable.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/gui/attractable" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/struct" \*\/.*\/\* END_INCLUDE: "core\/lib\/struct" \*\//gms,
    to: `/* INCLUDE: "core/lib/struct" */\n${fs
      .readFileSync("./module/core/lib/struct.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/struct" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/uuid" \*\/.*\/\* END_INCLUDE: "core\/lib\/uuid" \*\//gms,
    to: `/* INCLUDE: "core/lib/uuid" */\n${fs
      .readFileSync("./module/core/lib/uuid.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/uuid" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/adapter\/dev-hub" \*\/.*\/\* END_INCLUDE: "core\/adapter\/dev-hub" \*\//gms,
    to: `/* INCLUDE: "core/adapter/dev-hub" */\n${fs
      .readFileSync("./module/core/adapter/dev-hub.js", "utf8")
      .toString()}/* END_INCLUDE: "core/adapter/dev-hub" */`,
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
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/draftstate" \*\/.*\/\* END_INCLUDE: "core\/lib\/draftstate" \*\//gms,
    to: `/* INCLUDE: "core/lib/draftstate" */\n${fs
      .readFileSync("./module/core/lib/draftstate.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/draftstate" */`,
  })
  .then(({ changedFiles, countOfMatchesByPaths }) => {
    console.log("DONE");
  })
  .catch(console.error);
