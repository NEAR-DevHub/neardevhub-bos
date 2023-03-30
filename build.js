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
    from: /\/\* INCLUDE: "communities\.jsx" \*\/.*\/\* END_INCLUDE: "communities\.jsx" \*\//gms,
    to: `/* INCLUDE: "communities.jsx" */\n${fs
      .readFileSync("./communities.jsx", "utf8")
      .toString()}/* END_INCLUDE: "communities.jsx" */`,
  })
  .then(({ changedFiles, countOfMatchesByPaths }) => {
    console.log("DONE");
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
