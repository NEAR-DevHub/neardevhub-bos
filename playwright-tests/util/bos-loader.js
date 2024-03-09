export async function modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
  page
) {
  console.log(
    "Getting local widgets by modifying RPC responses from social.near get function, remember to not have the bos loader flags in local storage"
  );
  const devComponents = (
    await fetch("http://localhost:3030").then((r) => r.json())
  ).components;

  await page.route("https://rpc.mainnet.near.org/", async (route) => {
    const request = await route.request();

    const requestPostData = request.postDataJSON();
    if (
      requestPostData.params &&
      requestPostData.params.account_id === "social.near" &&
      requestPostData.params.method_name === "get"
    ) {
      const social_get_key = JSON.parse(
        atob(requestPostData.params.args_base64)
      ).keys[0];

      const response = await route.fetch();
      const json = await response.json();

      if (devComponents[social_get_key]) {
        console.log("using local dev widget", social_get_key);
        const social_get_key_parts = social_get_key.split("/");
        const devWidget = {};
        devWidget[social_get_key_parts[0]] = { widget: {} };
        devWidget[social_get_key_parts[0]].widget[social_get_key_parts[2]] =
          devComponents[social_get_key].code;
        json.result.result = Array.from(
          new TextEncoder().encode(JSON.stringify(devWidget))
        );
      }
      await route.fulfill({ response, json });
    } else {
      await route.continue();
    }
  });
}
