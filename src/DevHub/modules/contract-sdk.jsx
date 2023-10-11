const devHubAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function getRootMembers() {
  return Near.view(devHubAccountId, "get_root_members") ?? null;
}

function hasModerator({ account_id }) {
  return Near.view(devHubAccountId, "has_moderator", { account_id }) ?? null;
}

function createCommunity({ inputs }) {
  return Near.call(devHubAccountId, "create_community", { inputs });
}

function getCommunity({ handle }) {
  return Near.view(devHubAccountId, "get_community", { handle }) ?? null;
}

function getAccountCommunityPermissions({ account_id, community_handle }) {
  return (
    Near.view(devHubAccountId, "get_account_community_permissions", {
      account_id,
      community_handle,
    }) ?? null
  );
}

function updateCommunity({ handle, community }) {
  return Near.call(devHubAccountId, "update_community", { handle, community });
}

function deleteCommunity({ handle }) {
  return Near.call(devHubAccountId, "delete_community", { handle });
}

function updateCommunityBoard({ handle, board }) {
  return Near.call(devHubAccountId, "update_community_board", {
    handle,
    board,
  });
}

function updateCommunityGithub({ handle, github }) {
  return Near.call(devHubAccountId, "update_community_github", {
    handle,
    github,
  });
}

function addCommunityAddon({ handle, config }) {
  return Near.call(devHubAccountId, "add_community_addon", {
    community_handle: handle,
    addon_config: config,
  });
}

function updateCommunityAddon({ handle, config }) {
  return Near.call(devHubAccountId, "update_community_addon", {
    community_handle: handle,
    addon_config: config,
  });
}

function removeCommunityAddon({ handle, config_id }) {
  return Near.call(devHubAccountId, "remove_community_addon", {
    community_handle: handle,
    config_id,
  });
}

function getAccessControlInfo() {
  return Near.view(devHubAccountId, "get_access_control_info") ?? null;
}

function getAllAuthors() {
  return Near.view(devHubAccountId, "get_all_authors") ?? null;
}

function getAllCommunitiesMetadata() {
  return Near.view(devHubAccountId, "get_all_communities_metadata") ?? null;
}

function getAvailableAddons() {
  return Near.view(devHubAccountId, "get_available_addons") ?? null;
}

function getCommunityAddons({ handle }) {
  return Near.view(devHubAccountId, "get_community_addons", { handle });
}

function getCommunityAddonConfigs({ handle }) {
  return Near.view(devHubAccountId, "get_community_addon_configs", { handle });
}

function getAllLabels() {
  return Near.view(devHubAccountId, "get_all_labels") ?? null;
}

function getPost({ post_id }) {
  return Near.view(devHubAccountId, "get_post", { post_id }) ?? null;
}

function getPostsByAuthor({ author }) {
  return Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null;
}

function getPostsByLabel({ label }) {
  return (
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null
  );
}

function useQuery(name, params) {
  const initialState = { data: null, error: null, isLoading: true };

  const cacheState = useCache(
    () =>
      Near.asyncView(devHubAccountId, ["get", name].join("_"), params ?? {})
        .then((response) => ({
          ...initialState,
          data: response ?? null,
          isLoading: false,
        }))
        .catch((error) => ({
          ...initialState,
          error: props?.error ?? error,
          isLoading: false,
        })),

    JSON.stringify({ name, params }),
    { subscribe: false } // NOTE: I'm turning off subscribe to stop the constant re-rendering
  );

  return cacheState === null ? initialState : cacheState;
}

return {
  getRootMembers,
  hasModerator,
  createCommunity,
  getCommunity,
  getAccountCommunityPermissions,
  updateCommunity,
  deleteCommunity,
  updateCommunityBoard,
  updateCommunityGithub,
  addCommunityAddon,
  updateCommunityAddon,
  removeCommunityAddon,
  getAccessControlInfo,
  getAllAuthors,
  getAllCommunitiesMetadata,
  getAvailableAddons,
  getCommunityAddons,
  getCommunityAddonConfigs,
  getAllLabels,
  getPost,
  getPostsByAuthor,
  getPostsByLabel,
  useQuery,
};
