import http from 'http';
import { createHash } from 'crypto';

async function tryFetchingLocalBosLoaderComponent(instanceAccountId, requestPostData) {  
  if (
    requestPostData.params &&
    requestPostData.params.account_id === "social.near" &&
    requestPostData.params.method_name === "get"
  ) {
    const social_get_key = JSON.parse(
      atob(requestPostData.params.args_base64)
    ).keys[0];

    const social_get_key_parts = social_get_key.split("/");
    if (social_get_key_parts[0] === instanceAccountId && social_get_key_parts[1] === 'widget') {
      const bosLoaderComponents = (
        await fetch("http://localhost:3030").then((r) => r.json())
      ).components;
          
      const devWidget = {};
      devWidget[social_get_key_parts[0]] = { widget: {} };
      devWidget[social_get_key_parts[0]].widget[social_get_key_parts[2]] = bosLoaderComponents[social_get_key].code;
      console.log('Found local component', social_get_key);

      const rpcResponse = {
        "jsonrpc": "2.0",
        "result": {
          "result":  Array.from(
            new TextEncoder().encode(JSON.stringify(devWidget))
          ),
          "logs": [],
          "block_height": 17817336,
          "block_hash": "4qkA4sUUG8opjH5Q9bL5mWJTnfR4ech879Db1BZXbx6P"
        },
        "id": "dontcare"
      };
      
      return JSON.stringify(rpcResponse);
    }
  }
  return null;
}

export async function rpcProxy(instanceAccountId) {
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
      headers: { ...reqHeaders, 'host': new URL(url).host, 'referer': 'https://near.social/' },
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
      try {
        const bosLoaderLocalComponent = await tryFetchingLocalBosLoaderComponent(instanceAccountId, JSON.parse(body));
        if (bosLoaderLocalComponent) {
          return res.end(bosLoaderLocalComponent);
        }
      } catch(e) {
        
      }
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

      let targetUrls = [
        'https://rpc.fastnear.com/',
        'https://1rpc.io/near',
        'https://rpc.mainnet.near.org'
      ];

      if (body.includes('"method":"tx"')) {
        targetUrls = [
          'https://1rpc.io/near',
        ]
      }

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