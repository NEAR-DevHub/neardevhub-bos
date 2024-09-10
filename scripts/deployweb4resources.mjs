import nearApi from "near-api-js";
import { readFile, readdir } from 'fs/promises';

// near contract call-function as-transaction $CONTRACT_ID post_javascript file-args web4/args.json prepaid-gas '100.0 Tgas' attached-deposit '0 NEAR' sign-as $CONTRACT_ID network-config testnet sign-with-plaintext-private-key --signer-public-key $SIGNER_PUBLIC_KEY --signer-private-key $SIGNER_PRIVATE_KEY send

const networkId = 'mainnet';
const contractId = 'social.near';
const accountId = process.env.SIGNER_ACCOUNT_ID;

const keyStore = new nearApi.keyStores.InMemoryKeyStore();
const keyPair = nearApi.KeyPair.fromString(process.env.SIGNER_PRIVATE_KEY);
await keyStore.setKey(networkId, accountId, keyPair);

const near = await nearApi.connect({
  networkId,
  nodeUrl: 'https://rpc.mainnet.near.org',
  keyStore,
});

const account = await near.account(accountId);

const web4Folder = new URL('../web4', import.meta.url);
const web4FolderContents = await readdir(web4Folder);
const data = {};
data[accountId] = { web4: {} };

for (const resourceFileName of web4FolderContents) {
  const resourceFileContent = (await readFile(new URL(`${web4Folder}/${resourceFileName}`))).toString();
  const currentDeployedResourceFileContent = await account.viewFunction({contractId, methodName: 'get', args: {keys: [`${accountId}/web4/${resourceFileName}`]}});

  if (currentDeployedResourceFileContent[accountId]?.web4[resourceFileName] !== resourceFileContent) {
    data[accountId].web4[resourceFileName] = resourceFileContent;
  }
}

if (Object.keys(data[accountId].web4).length > 0) {
  console.log('deploying', Object.keys(data[accountId].web4));
  await account.functionCall({ contractId, methodName: "set", args: {data} });
} else {
  console.log('no web4 resources to deploy');
}

