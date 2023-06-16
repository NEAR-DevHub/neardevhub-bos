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
    from: /\/\* INCLUDE: "core\/lib\/form" \*\/.*\/\* END_INCLUDE: "core\/lib\/form" \*\//gms,
    to: `/* INCLUDE: "core/lib/form" */\n${fs
      .readFileSync("./core/lib/form.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/form" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/gui\/attractable" \*\/.*\/\* END_INCLUDE: "core\/lib\/gui\/attractable" \*\//gms,
    to: `/* INCLUDE: "core/lib/gui/attractable" */\n${fs
      .readFileSync("./core/lib/gui/attractable.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/gui/attractable" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/record" \*\/.*\/\* END_INCLUDE: "core\/lib\/record" \*\//gms,
    to: `/* INCLUDE: "core/lib/record" */\n${fs
      .readFileSync("./core/lib/record.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/record" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/lib\/uuid" \*\/.*\/\* END_INCLUDE: "core\/lib\/uuid" \*\//gms,
    to: `/* INCLUDE: "core/lib/uuid" */\n${fs
      .readFileSync("./core/lib/uuid.js", "utf8")
      .toString()}/* END_INCLUDE: "core/lib/uuid" */`,
  })
  .pipe({
    from: /\/\* INCLUDE: "core\/adapter\/dev-hub" \*\/.*\/\* END_INCLUDE: "core\/adapter\/dev-hub" \*\//gms,
    to: `/* INCLUDE: "core/adapter/dev-hub" */\n${fs
      .readFileSync("./core/adapter/dev-hub.js", "utf8")
      .toString()}/* END_INCLUDE: "core/adapter/dev-hub" */`,
  })
  .then(({ changedFiles, countOfMatchesByPaths }) => {
    console.log("DONE");
  })
  .catch(console.error);
