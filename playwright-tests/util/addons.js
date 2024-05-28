import { decodeResultJSON, encodeResultJSON } from "./transaction.js";

export async function mockDefaultTabs(route) {
  const request = await route.request();
  const requestPostData = request.postDataJSON();

  const devComponents = (
    await fetch("http://localhost:3030").then((r) => r.json())
  ).components;

  if (
    requestPostData.params &&
    requestPostData.params.account_id === "devhub.near" &&
    requestPostData.params.method_name === "get_community" &&
    atob(requestPostData.params.args_base64).includes("handle")
  ) {
    // Add default tabs to community
    const response = await route.fetch();
    const json = await response.json();

    let resultObj = decodeResultJSON(json.result.result);

    resultObj.addons = [
      ...resultObj.addons,
      {
        id: "9yhcct",
        addon_id: "announcements",
        display_name: "Announcements",
        enabled: true,
        parameters: "{}",
      },
      {
        addon_id: "discussions",
        display_name: "Discussions",
        enabled: true,
        id: "gqyrw7",
        parameters: "{}",
      },
      {
        addon_id: "activity",
        display_name: "Activity",
        enabled: true,
        id: "bqyrw6",
        parameters: "{}",
      },
      {
        addon_id: "teams",
        display_name: "Teams",
        enabled: true,
        id: "cqyrw8",
        parameters: "{}",
      },
      {
        addon_id: "blogv2",
        display_name: "First Blog",
        enabled: true,
        id: "blogv2",
        parameters:
          '{"title":"Mocked configured blog page title",\
        "subtitle":"Mocked configured subtitle",\
        "authorEnabled": "disabled",\
        "searchEnabled": "enabled",\
        "orderBy": "timedesc",\
        "categoriesEnabled": "enabled",\
        "categories": ["news", "guide", "reference"],\
        "categoryRequired": false}',
      },
      {
        addon_id: "blogv2",
        display_name: "Second Blog",
        enabled: true,
        id: "blogv2instance2",
        parameters: "{}",
      },
    ];

    json.result.result = encodeResultJSON(resultObj);

    await route.fulfill({ response, json });
    return;
  } else if (requestPostData.method === "tx") {
    await route.continue({ url: "https://archival-rpc.mainnet.near.org/" });
  } else if (
    requestPostData.params &&
    requestPostData.params.account_id === "social.near" &&
    requestPostData.params.method_name === "get"
  ) {
    const social_get_key = JSON.parse(atob(requestPostData.params.args_base64))
      .keys[0];

    const response = await route.fetch({
      url: "https://rpc.mainnet.near.org/",
    });
    const json = await response.json();

    // Replace component with local component
    if (devComponents[social_get_key]) {
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
}
