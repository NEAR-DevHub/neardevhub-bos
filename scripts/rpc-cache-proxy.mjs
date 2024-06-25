import http from 'http';
import { createHash } from 'crypto';

export async function rpcProxy() {
  // Simple in-memory cache
  const cache = new Map();

  // Function to generate a unique cache key based on the POST body
  function getCacheKey(body) {
    return createHash('md5').update(body).digest('hex');
  }

  // Function to handle incoming requests
  function handleRequest(req, res) {
    if (req.method !== 'POST') {
      res.writeHead(405, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const cacheKey = getCacheKey(body);

      if (cache.has(cacheKey)) {
        console.log(`Cache hit for request with body: ${body}`);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end(JSON.stringify(cache.get(cacheKey)));
      }

      const targetUrl = `https://rpc.mainnet.near.org`;

      fetch(targetUrl, {
        method: 'POST',
        headers: { ...req.headers, 'host': 'rpc.fastnear.com', Referer: 'https://near.social/' },
        body: body
      })
        .then(response => response.json())
        .then(data => {
          cache.set(cacheKey, data);
          console.log(`Fetched from NEAR RPC and cached request with body: ${body}`);
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
          res.end(JSON.stringify(data));
        })
        .catch(error => {
          console.error(`Error fetching from NEAR RPC: ${error.message}`);
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        });
    });
  }

  const server = http.createServer(handleRequest);

  const PORT = 20000;
  await new Promise(resolve =>
    server.listen(PORT, () => {
      console.log(`Proxy server running at http://localhost:${PORT}`);
      resolve();
    })
  );
}