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
  const linkPropsQuery = Object.entries(linkProps)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const allPosts = (
  Near.view(nearDevGovGigsContractAccountId, "get_all_post_ids") ?? []
).reverse();
const allTopPosts = (
  Near.view(nearDevGovGigsContractAccountId, "get_children_ids") ?? []
).reverse();

const postIds = props.label
  ? Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label: props.label,
    }).reverse()
  : props.recency == "all"
  ? allPosts
  : allTopPosts;

console.log("Showing list of ids %s", postIds, props);

return (
  <div>
    {postIds.map((postId) =>
      widget(
        `components.posts.Post`,
        {
          id: postId,
          referral: props.referral,
          expandable: true,
          defaultExpanded: false,
        },
        postId
      )
    )}
  </div>
);
