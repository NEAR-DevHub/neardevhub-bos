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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

State.init({
  propsLabel: props.label,
  label: props.label,
  author: props.author,
});

// When rerendered with different props, State will be preserved, so we need to update the state when we detect that the props have changed.
if (props.label !== state.propsLabel) {
  State.update({
    propsLabel: props.label,
    label: props.label,
  });
}

const onSearchLabel = (label) => {
  State.update({ label });
};

const onSearchAuthor = (author) => {
  State.update({ author });
};

return widget("components.layout.Page", {
  header: widget("components.community.FeedHeader"),
  navbarChildren: [
    widget("components.layout.SearchByLabel", {
      searchQuery: { label: state.label },
      onSearchLabel,
    }),
    widget("components.layout.SearchByAuthor", {
      searchQuery: { author: state.author },
      onSearchAuthor,
    }),
  ],
  children: widget("components.posts.Search", {
    recency: props.recency,
    label: state.label,
    author: state.author,
  }),
});
