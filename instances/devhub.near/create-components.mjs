import { promises as fs } from 'fs';
import path from 'path';

// Function to recursively find all .jsx files
async function findJSXFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await findJSXFiles(filePath, fileList);
    } else if (path.extname(file) === '.jsx') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Function to convert file path to JSON key format
function convertToJSONKey(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath);
  const key = relativePath.replace(new RegExp(`\\${path.sep}`, 'g'), '.').replace(/\.jsx$/, '');
  return key;
}

// Main function to generate the JSON output
async function generateJSONOutput(baseDir) {
  const fileList = await findJSXFiles(baseDir);
  const jsonOutput = { data: { 'devhub.near': { widget: {} } } };

  for (const file of fileList) {
    const key = convertToJSONKey(file, baseDir);
    const fileContent = await fs.readFile(file, 'utf8');
    jsonOutput.data['devhub.near'].widget[key] = { '': fileContent };
  }

  return jsonOutput;
}

// Specify the base directory to start searching
const baseDir = path.join(process.cwd(), 'widget');

// Generate the JSON output and write to a file
const jsonOutput = await generateJSONOutput(baseDir);
await fs.writeFile('components.json', JSON.stringify(jsonOutput, null, 2), 'utf8');
console.log('JSON output has been generated and saved to output.json');
