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

const DevHub = {
  edit_community_github: ({ handle, github }) =>
    Near.call(contractAccountId, "edit_community_github", { handle, github }) ??
    null,

  get_access_control_info: () =>
    Near.view(contractAccountId, "get_access_control_info") ?? null,

  get_all_communities: () =>
    Near.view(contractAccountId, "get_all_communities") ?? null,

  get_community: ({ handle }) =>
    Near.view(contractAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(contractAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(contractAccountId, "get_root_members") ?? null,
};
/* END_INCLUDE: "core/adapter/dev-hub" */

const CommunityActivityPage = ({ handle }) => {
  if (!handle) {
    return (
      <div class="alert alert-danger" role="alert">
        Error: community handle not found in URL parameters
      </div>
    );
  }

  const communityData = DevHub.get_community({ handle });

  const communityPostIds =
    DevHub.get_posts_by_label({ label: communityData?.tag }) ?? [];

  return widget("components.template.community-page", {
    handle,
    title: "Activity",

    children:
      communityData !== null ? (
        <div>
          <div class="row mb-2">
            <div class="col text-center">
              <small class="text-muted">
                <span>Required tags:</span>

                <a
                  href={href("Feed", { tag: communityData.tag })}
                  key={communityData.tag}
                >
                  <span class="badge text-bg-primary me-1">
                    {communityData.tag}
                  </span>
                </a>
              </small>
            </div>
          </div>

          {widget("components.layout.Controls", {
            labels: communityData.tag,
          })}

          <div class="row">
            <div class="col">
              {communityPostIds.map((postId) =>
                widget("entity.post.Post", { id: postId }, postId)
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading ...</div>
      ),
  });
};

return CommunityActivityPage(props);
