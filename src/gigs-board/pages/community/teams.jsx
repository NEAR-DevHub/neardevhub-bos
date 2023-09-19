/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "core/adapter/dev-hub" */
const devHubAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  get_root_members: () =>
    Near.view(devHubAccountId, "get_root_members") ?? null,

  has_moderator: ({ account_id }) =>
    Near.view(devHubAccountId, "has_moderator", { account_id }) ?? null,

  create_community: ({ inputs }) =>
    Near.call(devHubAccountId, "create_community", { inputs }),

  get_community: ({ handle }) =>
    Near.view(devHubAccountId, "get_community", { handle }) ?? null,

  get_account_community_permissions: ({ account_id, community_handle }) =>
    Near.view(devHubAccountId, "get_account_community_permissions", {
      account_id,
      community_handle,
    }) ?? null,

  update_community: ({ handle, community }) =>
    Near.call(devHubAccountId, "update_community", { handle, community }),

  delete_community: ({ handle }) =>
    Near.call(devHubAccountId, "delete_community", { handle }),

  update_community_board: ({ handle, board }) =>
    Near.call(devHubAccountId, "update_community_board", { handle, board }),

  update_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "update_community_github", { handle, github }),

  get_access_control_info: () =>
    Near.view(devHubAccountId, "get_access_control_info") ?? null,

  get_all_authors: () => Near.view(devHubAccountId, "get_all_authors") ?? null,

  get_all_communities_metadata: () =>
    Near.view(devHubAccountId, "get_all_communities_metadata") ?? null,

  get_all_labels: () => Near.view(devHubAccountId, "get_all_labels") ?? null,

  get_post: ({ post_id }) =>
    Near.view(devHubAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  useQuery: (name, params) => {
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
/* END_INCLUDE: "core/adapter/dev-hub" */

const communityData = DevHub.get_community({ handle: props.handle }) ?? null;

if (communityData === null) {
  return <div>Loading...</div>;
}

const UserList = (name, users) => {
  return (
    <div>
      {(users ?? []).map((user, i) => (
        <div className={`row ${i < users.length - 1 ? "mb-3" : ""}`}>
          <div class="col-3">
            <b>{name + " #" + (i + 1)}</b>
          </div>
          <div class="col-9">
            <span
              key={user}
              className="d-inline-flex"
              style={{ fontWeight: 500 }}
            >
              <Widget
                src="neardevgov.near/widget/ProfileLine"
                props={{
                  accountId: user,
                  hideAccountId: true,
                  tooltip: true,
                }}
              />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Teams = (
  <div class="d-flex flex-column align-items-center gap-4">
    {widget("components.molecule.tile", {
      heading: "Admins",
      minHeight: 0,
      children: UserList("Admin", communityData.admins),
    })}
  </div>
);

return widget("entity.community.layout", {
  path: [{ label: "Communities", pageId: "communities" }],
  handle: props.handle,
  title: "Teams",
  children: Teams,
});
