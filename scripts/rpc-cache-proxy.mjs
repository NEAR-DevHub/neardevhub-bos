import http from 'http';
import { createHash } from 'crypto';

export async function rpcProxy() {
  // Simple in-memory cache
  const cache = new Map();

  // Function to generate a unique cache key based on the POST body
  function getCacheKey(body) {
    return createHash('md5').update(body).digest('hex');
  }

  // Function to fetch from a URL and return the JSON response
  async function fetchFromUrl(url, reqBody, reqHeaders) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...reqHeaders, 'host': new URL(url).host },
      body: reqBody
    });
    return response.json();
  }

  // Function to handle incoming requests
  function handleRequest(req, res) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': 2592000, // 30 days
        'Content-Length': 0
      });
      return res.end();
    }

    if (req.method !== 'POST') {
      res.writeHead(405, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const cacheKey = getCacheKey(body);

      if (cache.has(cacheKey)) {
        console.log(`Cache hit for request with body: ${body}`);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        return res.end(JSON.stringify(cache.get(cacheKey)));
      }

      const targetUrls = [
        
        'https://1rpc.io/near',
        'https://rpc.mainnet.near.org'
      ];

      for (const targetUrl of targetUrls) {
        try {
          const data = await fetchFromUrl(targetUrl, body, req.headers);
          cache.set(cacheKey, data);
          console.log(`Fetched from ${targetUrl} and cached request with body: ${body}`);
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          });
          return res.end(JSON.stringify(data));
        } catch (error) {
          console.error(`Error fetching from ${targetUrl}: ${error.message}`);
        }
      }

      // If all requests fail
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
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