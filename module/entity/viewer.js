const access_control_info = DevHub.useQuery({
  name: "access_control_info",
});

const Viewer = {
  can: {
    editCommunity: (communityData) =>
      Struct.typeMatch(communityData) &&
      (communityData.admins.includes(context.accountId) ||
        Viewer.role.isDevHubModerator),
  },

  workspacePermissions: (workspaceId) => {
    const workspace_id = parseInt(workspaceId);

    const defaultPermissions = { can_configure: false };

    return !isNaN(workspace_id)
      ? Near.view(devHubAccountId, "get_account_workspace_permissions", {
          account_id: context.accountId,
          workspace_id: workspace_id,
        }) ?? defaultPermissions
      : defaultPermissions;
  },

  role: {
    isDevHubModerator:
      access_control_info.data === null || access_control_info.isLoading
        ? false
        : access_control_info.data.members_list[
            "team:moderators"
          ]?.children?.includes?.(context.accountId) ?? false,
  },
};
