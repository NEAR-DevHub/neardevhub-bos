import httpServer from "http-server";
import path from "path";
import { spawn } from "child_process";
import { homedir, tmpdir } from "os";
import { readFile, writeFile, cp, copyFile } from "fs/promises";
import { rpcProxy } from "./rpc-cache-proxy.mjs";

const instanceName = process.argv[process.argv.length - 1];
await rpcProxy(instanceName);
const instanceFolder = `instances/${instanceName}`;

const statingWebHostinFolder =
  tmpdir() + "/bos" + new Date().toJSON().replace(/[^0-9]/g, "");

await cp(
  path.join(process.cwd(), "node_modules/near-bos-webcomponent/dist"),
  statingWebHostinFolder,
  { recursive: true }
);
const web4browserclientFileName = 'web4browserclient.js';
await copyFile(new URL(web4browserclientFileName, import.meta.url), `${statingWebHostinFolder}/${web4browserclientFileName}`);

const replaceRpc = async (htmlfile) => {
  const indexHtmlFilePath = `${statingWebHostinFolder}/${htmlfile}`;

  let indexHtmlData = await readFile(indexHtmlFilePath, "utf8");
  indexHtmlData = indexHtmlData.replace(
    "<near-social-viewer></near-social-viewer>",
    `<near-social-viewer rpc="http://localhost:20000"></near-social-viewer>
    <script type="module" src="${web4browserclientFileName}"></script>
    `
  );
  await writeFile(indexHtmlFilePath, indexHtmlData, "utf8");
};
await replaceRpc("index.html");
await replaceRpc("404.html");

const server = httpServer.createServer({
  root: statingWebHostinFolder,
});

server.listen(8080, () => {
  console.log("HTTP server is listening on port 8080");
});

const replacements = JSON.parse(
  (await readFile(`${instanceFolder}/aliases.mainnet.json`)).toString()
);
const replacementsWithEnvFileName = `${tmpdir()}/replacements.json`;
await writeFile(
  replacementsWithEnvFileName,
  JSON.stringify(
    Object.assign(replacements, {
      REPL_POSTHOG_API_KEY: process.env["POSTHOG_API_KEY"],
      REPL_RPC_URL: "http://localhost:20000",
    }),
    null,
    1
  )
);

// Start the 'npm run dev' process
const bosLoader = spawn(
  `${homedir()}/.cargo/bin/bos-loader`,
  [
    "-p",
    `${instanceFolder}/widget`,
    "-r",
    replacementsWithEnvFileName,
    instanceName,
  ],
  { stdio: "inherit" }
);

bosLoader.on("close", (code) => {
  console.log(`bos-loader process exited with code ${code}`);
});
