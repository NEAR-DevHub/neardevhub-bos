export const MOCK_RPC_URL = "https://rpc.mainnet.near.org";

export async function mockRpcRequest({
  page,
  filterParams = {},
  mockedResult = {},
  modifyOriginalResultFunction = null,
}) {
  await page.route(MOCK_RPC_URL, async (route, request) => {
    const postData = request.postDataJSON();

    const filterParamsKeys = Object.keys(filterParams);
    if (
      filterParamsKeys.filter(
        (param) => postData.params[param] === filterParams[param]
      ).length === filterParamsKeys.length
    ) {
      const json = await route.fetch().then((r) => r.json());

      if (modifyOriginalResultFunction) {
        const originalResult = JSON.parse(
          new TextDecoder().decode(new Uint8Array(json.result.result))
        );
        mockedResult = await modifyOriginalResultFunction(originalResult);
      }

      const mockedResponse = {
        jsonrpc: "2.0",
        id: "dontcare",
        result: {
          result: Array.from(
            new TextEncoder().encode(JSON.stringify(mockedResult))
          ),
        },
      };

      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedResponse),
      });
    } else {
      route.fallback();
    }
  });
}
