import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

let NETWORK_ENV = "mainnet";
let CREATOR_REPL = "REPL_DEVHUB";
let CONTRACT_REPL = "REPL_DEVHUB_CONTRACT";
let ACCOUNT_ID = "";
let SIGNER_ID = "";
let CONTRACT_ID = "";

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "-a":
    case "--account":
      ACCOUNT_ID = args[++i];
      break;
    case "-s":
    case "--signer":
      SIGNER_ID = args[++i];
      break;
    case "-c":
    case "--contract":
      CONTRACT_ID = args[++i];
      break;
    case "-n":
    case "--network":
      NETWORK_ENV = args[++i].toLowerCase();
      break;
    default:
      console.error(`Unknown option: ${args[i]}`);
      process.exit(1);
  }
}

console.log(`NETWORK_ENV: ${NETWORK_ENV}`);

// Check if account is provided
if (!ACCOUNT_ID) {
  console.error(
    "Error: Account is not provided. Please provide the account to deploy the widgets to."
  );
console.log(`\nExample usage:\n
npm run build:preview -- -a devgovgigs.petersalomonsen.near -c devhub.near

Arguments: 
-a account for deploying BOS components
-c backend contract account
`)
  process.exit(1);
}

if (!SIGNER_ID) {
  SIGNER_ID = ACCOUNT_ID;
}

// Check if network is provided but not contract
if (NETWORK_ENV === "testnet" && !CONTRACT_ID) {
  console.error(
    "Error: Network is set to testnet but no contract is provided. Please specify a contract to use with testnet."
  );
  process.exit(1);
}

// Update the value in replacements.json
let REPLACEMENTS_JSON = `replacements.${NETWORK_ENV}.json`;

if (fs.existsSync(REPLACEMENTS_JSON)) {
  // Replace the value in the JSON file
  let replacements = JSON.parse(fs.readFileSync(REPLACEMENTS_JSON, "utf8"));
  replacements[CREATOR_REPL] = ACCOUNT_ID;
  replacements[CONTRACT_REPL] = CONTRACT_ID;
  fs.writeFileSync(
    `${REPLACEMENTS_JSON}.tmp`,
    JSON.stringify(replacements, null, 2)
  );
} else {
  console.error(`Error: ${REPLACEMENTS_JSON} file not found.`);
  process.exit(1);
}

// Read the content of the .tmp file
let replacements = JSON.parse(
  fs.readFileSync(`${REPLACEMENTS_JSON}.tmp`, "utf8")
);

// Extract all keys (placeholders to be replaced)
let keys = Object.keys(replacements);

// Recursively get all .jsx files
function getAllFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

let FILES = getAllFiles("src").filter((file) => file.endsWith(".jsx"));

console.log("Building widgets...");

// If the build directory exists, delete it
if (fs.existsSync("build")) {
  fs.rmdirSync("build", { recursive: true });
}

// Iterate over each .jsx file
FILES.forEach((file) => {
  // Create corresponding directory structure in build/src folder
  let dir = path.dirname(file);
  if (!fs.existsSync(`build/${dir}`)) {
    fs.mkdirSync(`build/${dir}`, { recursive: true });
  }

  // Define the output path
  let outfile = `build/${file}`;
  fs.copyFileSync(file, outfile); // initialize outfile with the original file content
});

console.log("Making replacements...");

// Iterate over each .jsx file again for replacements
FILES.forEach((file) => {
  let outfile = `build/${file}`;
  console.log(outfile);

  let content = fs.readFileSync(outfile, "utf8");
  // Iterate over each key to get the replacement value
  keys.forEach((key) => {
    let replace = replacements[key];
    let search = new RegExp(`\\$\\{${key}\\}`, "g");
    content = content.replace(search, replace);
  });
  fs.writeFileSync(outfile, content);
});
