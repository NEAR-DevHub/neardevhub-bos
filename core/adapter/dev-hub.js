const contractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  get_access_control_info: () =>
    Near.view(contractAccountId, "get_access_control_info"),

  get_community: ({ handle }) =>
    Near.view(contractAccountId, "get_community", { handle }),

  get_root_members: () => Near.view(contractAccountId, "get_root_members"),
};
