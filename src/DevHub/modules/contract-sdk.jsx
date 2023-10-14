function getRootMembers(devHubAccountId) {
  return Near.view(devHubAccountId, "get_root_members") ?? null;
}

function hasModerator(devHubAccountId, { account_id }) {
  return Near.view(devHubAccountId, "has_moderator", { account_id }) ?? null;
}

function createCommunity(devHubAccountId, { inputs }) {
  return Near.call(devHubAccountId, "create_community", { inputs });
}

function getCommunity(devHubAccountId, { handle }) {
  return Near.view(devHubAccountId, "get_community", { handle }) ?? null;
}

function getFeaturedCommunities(devHubAccountId) {
  return Near.view(devHubAccountId, "get_featured_communities") ?? null;
}

function getAccountCommunityPermissions(devHubAccountId, { account_id, community_handle }) {
  return (
    Near.view(devHubAccountId, "get_account_community_permissions", {
      account_id,
      community_handle,
    }) ?? null
  );
}

function updateCommunity(devHubAccountId, { handle, community }) {
  return Near.call(devHubAccountId, "update_community", { handle, community });
}

function deleteCommunity(devHubAccountId, { handle }) {
  return Near.call(devHubAccountId, "delete_community", { handle });
}

function updateCommunityBoard(devHubAccountId, { handle, board }) {
  return Near.call(devHubAccountId, "update_community_board", {
    handle,
    board,
  });
}

function updateCommunityGithub(devHubAccountId, { handle, github }) {
  return Near.call(devHubAccountId, "update_community_github", {
    handle,
    github,
  });
}

function addCommunityAddon(devHubAccountId, { handle, config }) {
  return Near.call(devHubAccountId, "add_community_addon", {
    community_handle: handle,
    addon_config: config,
  });
}

function updateCommunityAddon(devHubAccountId, { handle, config }) {
  return Near.call(devHubAccountId, "update_community_addon", {
    community_handle: handle,
    addon_config: config,
  });
}

function removeCommunityAddon(devHubAccountId, { handle, config_id }) {
  return Near.call(devHubAccountId, "remove_community_addon", {
    community_handle: handle,
    config_id,
  });
}

function getAccessControlInfo(devHubAccountId) {
  return Near.view(devHubAccountId, "get_access_control_info") ?? null;
}

function getAllAuthors(devHubAccountId) {
  return Near.view(devHubAccountId, "get_all_authors") ?? null;
}

function getAllCommunitiesMetadata(devHubAccountId) {
  return Near.view(devHubAccountId, "get_all_communities_metadata") ?? null;
}

function getAvailableAddons(devHubAccountId) {
  return Near.view(devHubAccountId, "get_available_addons") ?? null;
}

function getCommunityAddons(devHubAccountId, { handle }) {
  return Near.view(devHubAccountId, "get_community_addons", { handle });
}

function getCommunityAddonConfigs(devHubAccountId, { handle }) {
  return Near.view(devHubAccountId, "get_community_addon_configs", { handle });
}

function getAllLabels(devHubAccountId) {
  return Near.view(devHubAccountId, "get_all_labels") ?? null;
}

function getPost(devHubAccountId, { post_id }) {
  return Near.view(devHubAccountId, "get_post", { post_id }) ?? null;
}

function getPostsByAuthor(devHubAccountId, { author }) {
  return Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null;
}

function getPostsByLabel(devHubAccountId, { label }) {
  return (
    Near.view(devHubAccountId, "get_posts_by_label", {
      label,
    }) ?? null
  );
}

function useQuery(devHubAccountId, name, params) {
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
  getFeaturedCommunities,
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
