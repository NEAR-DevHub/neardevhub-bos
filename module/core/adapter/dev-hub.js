const devHubAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  edit_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "edit_community_github", { handle, github }) ??
    null,

  create_workspace: ({ author_community_handle, metadata }) =>
    Near.call(devHubAccountId, "create_workspace", {
      author_community_handle,
      metadata,
    }) ?? null,

  delete_workspace: ({ id }) =>
    Near.call(devHubAccountId, "delete_workspace", { id }) ?? null,

  update_workspace_metadata: ({ metadata }) =>
    Near.call(devHubAccountId, "update_workspace_metadata", { metadata }) ??
    null,

  get_workspace_views_metadata: ({ workspace_id }) =>
    Near.view(devHubAccountId, "get_workspace_views_metadata", {
      workspace_id,
    }) ?? null,

  create_workspace_view: ({ view }) =>
    Near.call(devHubAccountId, "create_workspace_view", { view }) ?? null,

  update_workspace_view: ({ view }) =>
    Near.call(devHubAccountId, "update_workspace_view", { view }) ?? null,

  delete_workspace_view: ({ id }) =>
    Near.call(devHubAccountId, "delete_workspace_view", { id }) ?? null,

  get_access_control_info: () =>
    Near.view(devHubAccountId, "get_access_control_info") ?? null,

  get_all_authors: () => Near.view(devHubAccountId, "get_all_authors") ?? null,

  get_all_communities: () =>
    Near.view(devHubAccountId, "get_all_communities") ?? null,

  get_all_labels: () => Near.view(devHubAccountId, "get_all_labels") ?? null,

  get_community: ({ handle }) =>
    Near.view(devHubAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(devHubAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(devHubAccountId, "get_root_members") ?? null,

  useQuery: ({ name, params }) => {
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
      { subscribe: true }
    );

    return cacheState === null ? initialState : cacheState;
  },
};
