import httpServer from 'http-server';
import path from 'path';
import { spawn } from 'child_process';
import { homedir, tmpdir } from 'os';
import { readFile, writeFile } from 'fs/promises';

const instanceName = process.argv[process.argv.length - 1];
const instanceFolder = `instances/${instanceName}`;

// Start the HTTP server
const server = httpServer.createServer({
  root: path.join(process.cwd(), 'node_modules/near-bos-webcomponent/dist/')
});

server.listen(8080, () => {
  console.log('HTTP server is listening on port 8080');
});

const replacements = JSON.parse((await readFile(`${instanceFolder}/aliases.mainnet.json`)).toString());
const replacementsWithEnvFileName = `${tmpdir()}/replacements.json`;
await writeFile(replacementsWithEnvFileName, JSON.stringify(
  Object.assign(replacements, { 'REPL_POSTHOG_API_KEY': process.env['POSTHOG_API_KEY'] })
  , null, 1)
);
// Start the 'npm run dev' process
const bosLoader = spawn(`${homedir()}/.cargo/bin/bos-loader`, ['-p', `${instanceFolder}/widget`, '-r', replacementsWithEnvFileName, instanceName], { stdio: 'inherit' });

bosLoader.on('close', (code) => {
  console.log(`bos-loader process exited with code ${code}`);
});
