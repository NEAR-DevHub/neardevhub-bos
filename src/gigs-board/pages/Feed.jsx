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

const Gradient = styled.div`
   {
    height: 250px;
    text-align: center;
    background: radial-gradient(
      circle,
      rgba(29, 55, 57, 1) 30%,
      rgba(24, 24, 24, 1) 80%
    );

    font-family: Arial, sans-serif;
  }

  .text-primary-gradient {
    color: #53fdca;
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(#8e76ba, #1ed2f0);
    -webkit-background-clip: text;
    background-clip: text;
  }

  .subtitle-above {
    font-size: 18px;
    letter-spacing: 1px;
    font-family: Courier, monospace;
  }

  .subtitle-below {
    font-size: 16px;
  }

  .slogan {
    font-weight: 600;
    font-size: 60px;
  }
`;

const header = (
  <div className="d-flex flex-column">
    <Gradient className="d-flex flex-column justify-content-center">
      <div className="subtitle-above text-white opacity-75 mb-2">
        A decentralized community of
      </div>

      <h1 className="mb-3 text-white slogan">
        <span className="text-primary-gradient">NEAR </span>Developers
      </h1>

      <div className="subtitle-below text-white opacity-75">
        Share your ideas, match solutions, and access support and funding.
      </div>
    </Gradient>

    <div className="d-flex flex-column gap-4 py-4">
      <div className="d-flex justify-content-between">
        <h5 className="h5 m-0">Featured Communities</h5>
      </div>

      <div className="row">
        {Near.view(nearDevGovGigsContractAccountId, "get_all_communities").map(
          (community) => (
            <div className="col">
              {widget("entity.community.card", community, community.handle)}
            </div>
          )
        )}
      </div>
    </div>

    <div className="h5 pb-4">Activity</div>
  </div>
);

const FeedPage = ({ author, recency, tag }) => {
  State.init({ propsTag: tag, tag, author });

  // When rerendered with different props, State will be preserved, so we need to update the state when we detect that the props have changed.
  if (tag !== state.propsTag) {
    State.update({
      propsTag: tag,
      tag,
    });
  }

  const onSearchLabel = (value) => {
    State.update({ tag: value });
  };

  const onSearchAuthor = (value) => {
    State.update({ author: value });
  };

  return widget("components.layout.Page", {
    header,

    children: widget("components.posts.Search", {
      children: widget("components.layout.Controls"),
      recency,
      label: tag,
      author,
      //
      labelQuery: { label: tag },
      onSearchLabel,
      //
      authorQuery: { author },
      onSearchAuthor,
    }),
  });
};

return FeedPage(props);
