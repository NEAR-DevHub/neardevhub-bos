const access_control_info = DevHub.useQuery({
  name: "get_access_control_info",
});

const Viewer = {
  isDevHubModerator:
    access_control_info.data === null || access_control_info.isLoading
      ? false
      : access_control_info.data.members_list[
          "team:moderators"
        ]?.children?.includes?.(context.accountId) ?? false,
};
