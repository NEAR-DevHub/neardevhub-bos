// const { nearDevGovGigsWidgetsAccountId } = props;
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

const FeedPage = ({ author, recency, tag }) => {
  State.init({
    initial: { author, tag },
    author,
    tag,
  });

  // When rerendered with different props, State will be preserved, so we need to update the state when we detect that the props have changed.
  if (tag !== state.initial.tag || author !== state.initial.author) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      initial: { author, tag },
      author,
      tag,
    }));
  }

  const onTagSearch = (tag) => {
    State.update((lastKnownState) => ({ ...lastKnownState, tag }));
  };

  const onAuthorSearch = (author) => {
    State.update((lastKnownState) => ({ ...lastKnownState, author }));
  };
  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.post.Panel`}
      props={{
        author: state.author,
        authorQuery: { author: state.author },
        children: widget("components.layout.Controls", {
          title: "Post",
          href: href("Create"),
        }),
        onAuthorSearch,
        onTagSearch,
        recency,
        tag: state.tag,
        tagQuery: { tag: state.tag },
        transactionHashes: props.transactionHashes,
      }}
    />
  );
};

return FeedPage(props);
