import { readFile, writeFile, cp, copyFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

const staticWebHostingFolder =
  tmpdir() + "/bos" + new Date().toJSON().replace(/[^0-9]/g, "");

await cp(
  path.join(process.cwd(), "node_modules/near-bos-webcomponent/dist"),
  staticWebHostingFolder,
  { recursive: true }
);
const web4browserclientFileName = 'web4browserclient.js';
await copyFile(new URL(`../web4/${web4browserclientFileName}`, import.meta.url), `${staticWebHostingFolder}/${web4browserclientFileName}`);

const replaceRpc = async (htmlfile) => {
  const indexHtmlFilePath = `${staticWebHostingFolder}/${htmlfile}`;

  let indexHtmlData = await readFile(indexHtmlFilePath, "utf8");
  indexHtmlData = indexHtmlData.replace(
    "<near-social-viewer></near-social-viewer>",
    `<near-social-viewer rpc="http://127.0.0.1:8080/api/proxy-rpc"></near-social-viewer>
    <script type="module" src="${web4browserclientFileName}"></script>
    `
  );
  await writeFile(indexHtmlFilePath, indexHtmlData, "utf8");
};
await replaceRpc("index.html");
await replaceRpc("404.html");

console.log(staticWebHostingFolder);
