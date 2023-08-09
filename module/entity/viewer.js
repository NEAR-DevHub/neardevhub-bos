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

  projectPermissions: (projectId) => {
    const project_id = parseInt(projectId);

    const defaultPermissions = { can_configure: false };

    return !isNaN(project_id)
      ? Near.view(devHubAccountId, "get_account_project_permissions", {
          account_id: context.accountId,
          project_id: project_id,
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
