import { decodeResultJSON, encodeResultJSON } from "./transaction.js";

export async function mockDefaultTabs(route) {
  const request = await route.request();
  const requestPostData = request.postDataJSON();

  if (
    requestPostData.params &&
    requestPostData.params.account_id === "devhub.near" &&
    requestPostData.params.method_name === "get_community" &&
    atob(requestPostData.params.args_base64).includes("handle")
  ) {
    // Add default tabs to community
    const response = await route.fetch();
    let json = {};
    try {
      json = await response.json();
    } catch (error) {
      console.error("Error parsing JSON response");
      console.log(await response.text());
    }

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
        "authorEnabled": "enabled",\
        "searchEnabled": "enabled",\
        "orderBy": "timeasc",\
        "postPerPage": 5,\
        "categoriesEnabled": "enabled",\
        "categories": [{"category":"News","value":"news"},\
        {"category":"Guide","value":"guide"},\
        {"category":"Reference","value":"reference"}],\
        "categoryRequired": "required"}',
      },
      {
        addon_id: "blogv2",
        display_name: "Second Blog",
        enabled: true,
        id: "blogv2instance2",
        parameters: "{}",
      },
      {
        addon_id: "blogv2",
        display_name: "Third Blog",
        enabled: true,
        id: "g1709r",
        parameters:
          '{"title": "WebAssemblyMusic",\
          "subtitle": "Stay up to date with the community blog",\
          "authorEnabled": "disabled",\
          "searchEnabled": "disabled",\
          "orderBy": "alpha",\
          "postPerPage": 10,\
          "categoriesEnabled": "disabled",\
          "categories": [],\
          "categoryRequired": "not_required"\
        }',
      },
      {
        addon_id: "blogv2",
        display_name: "Fourth Blog",
        enabled: true,
        id: "blogv2instance4",
        parameters:
          '{"title": "WebAssemblyMusic",\
          "subtitle": "Stay up to date with the community blog",\
          "authorEnabled": "disabled",\
          "searchEnabled": "disabled",\
          "orderBy": "alpha",\
          "postPerPage": 10,\
          "categoriesEnabled": "enabled",\
          "categories": [{"category":"News","value":"news"}],\
          "categoryRequired": "not_required"\
        }',
      },
    ];

    json.result.result = encodeResultJSON(resultObj);

    await route.fulfill({ response, json });
    return;
  } else {
    await route.continue();
  }
}
