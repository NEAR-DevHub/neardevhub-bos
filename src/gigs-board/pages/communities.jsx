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
const contractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const initialState = { data: null, error: null, loading: true };

const DevHub = {
  edit_community_github: ({ handle, github }) =>
    Near.call(contractAccountId, "edit_community_github", { handle, github }) ??
    null,

  get_access_control_info: () =>
    Near.view(contractAccountId, "get_access_control_info") ?? null,

  get_all_authors: () =>
    Near.view(contractAccountId, "get_all_authors") ?? null,

  get_all_communities: () =>
    Near.view(contractAccountId, "get_all_communities") ?? null,

  get_all_labels: () => Near.view(contractAccountId, "get_all_labels") ?? null,

  get_community: ({ handle }) =>
    Near.view(contractAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(contractAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(contractAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(contractAccountId, "get_root_members") ?? null,

  subscribe: (functionName, args) =>
    useCache(
      () =>
        Near.asyncCall(contractAccountId, functionName, args)
          .then((data) => ({
            ...initialState,
            data,
            error: null,
            loading: false,
          }))
          .catch((error) => ({
            ...initialState,
            error,
            loading: false,
          })),

      functionName,
      { subscribe: true }
    ),
};
/* END_INCLUDE: "core/adapter/dev-hub" */

const CommunitiesPage = () => (
  <div className="d-flex flex-column">
    {widget("components.layout.app-header", { style: { marginBottom: 0 } })}

    <div className="d-flex flex-column gap-4 p-4">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column gap-2">
          <h1 className="m-0 fs-4">Communities</h1>

          <p className="m-0 text-secondary fs-6">
            Discover NEAR developer communities
          </p>
        </div>

        <div className="d-flex flex-column justify-content-center">
          <a className="btn btn-primary" href={href("community.new")}>
            Create community
          </a>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-4">
        {(DevHub.get_all_communities() ?? []).map((community) =>
          widget("entity.community.card", community, community.handle)
        )}
      </div>
    </div>
  </div>
);

return CommunitiesPage(props);
