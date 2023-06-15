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

const DiscussionsPage = ({ handle }) => {
  if (!handle) {
    return (
      <div class="alert alert-danger" role="alert">
        Error: community handle not found in URL parameters
      </div>
    );
  }

  const communityData = Near.view(
    nearDevGovGigsContractAccountId,
    "get_community",
    { handle }
  );

  console.log(communityData);

  const discussionRequiredPosts =
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label: communityData.tag,
    }) ?? [];

  return widget("entity.community.layout", {
    handle,
    tab: "Discussions",

    children: (
      <div>
        <div class="row mb-2">
          <div class="col text-center">
            <small class="text-muted">
              Required tags:
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
          labels: tag,
        })}

        <div class="row">
          <div class="col">
            {discussionRequiredPosts.map((postId) =>
              widget("components.posts.Post", { id: postId }, postId)
            )}
          </div>
        </div>
      </div>
    ),
  });
};

return DiscussionsPage(props);
