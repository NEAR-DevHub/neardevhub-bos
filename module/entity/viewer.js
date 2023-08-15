const Viewer = {
  communityPermissions: ({ handle }) =>
    DevHub.useQuery("account_community_permissions", {
      account_id: context.accountId,
      community_handle: handle,
    }).data ?? {
      can_configure: false,
      can_delete: false,
    },

  role: {
    isDevHubModerator:
      DevHub.has_moderator({ account_id: context.accountId }) ?? false,
  },
};
