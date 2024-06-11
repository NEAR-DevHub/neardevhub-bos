import httpServer from 'http-server';
import path from 'path';
import { spawn } from 'child_process';
import { homedir } from 'os';

const instanceName = process.argv[process.argv.length-1];
const instanceFolder = `instances/${instanceName}`;

// Start the HTTP server
const server = httpServer.createServer({
  root: path.join(process.cwd(), 'node_modules/near-bos-webcomponent/dist/')
});

server.listen(8080, () => {
  console.log('HTTP server is listening on port 8080');
});

// Start the 'npm run dev' process
const npmRunDev = spawn(`${homedir()}/.cargo/bin/bos-loader`, ['-p', `${instanceFolder}`, '-r', `${instanceFolder}/aliases.mainnet.json`, instanceName], { stdio: 'inherit' });

npmRunDev.on('close', (code) => {
  console.log(`npm run dev process exited with code ${code}`);
});
