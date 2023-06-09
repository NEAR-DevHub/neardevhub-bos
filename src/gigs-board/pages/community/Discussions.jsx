/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "jgdev.near").split("/", 1)[0];

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

/* INCLUDE: "communities.jsx" */
const communities = {
  "zero-knowledge": {
    overviewId: 397,
    eventsId: 401,
    icon: "https://ipfs.near.social/ipfs/bafkreiajwq6ep3n7veddozji2djv5vviyisabhycbweslvpwhsoyuzcwi4",
    cover:
      "https://ipfs.near.social/ipfs/bafkreihgxg5kwts2juldaeasveyuddkm6tcabmrat2aaq5u6uyljtyt7lu",
    title: "Zero Knowledge",
    desc: "Building a zero knowledge ecosystem on NEAR.",
  },
  protocol: {
    overviewId: 412,
    eventsId: 413,
    icon: "https://ipfs.near.social/ipfs/bafkreidpitdafcnhkp4uyomacypdgqvxr35jtfnbxa5s6crby7qjk2nv5a",
    cover:
      "https://ipfs.near.social/ipfs/bafkreicg4svzfz5nvllomsahndgm7u62za4sib4mmbygxzhpcl4htqwr4a",
    title: "Protocol",
    desc: "Supporting the ongoing innovation of the NEAR Protocol.",
  },
  tooling: {
    overviewId: 416,
    eventsId: 417,
    icon: "https://ipfs.near.social/ipfs/bafkreie2eaj5czmpfe6pe53kojzcspgozebdsonffwvbxtpuipnwahybvi",
    cover:
      "https://ipfs.near.social/ipfs/bafkreiehzr7z2fhoqqmkt3z667wubccbch6sqtsnvd6msodyzpnf72cszy",
    title: "Tooling",
    desc: "Supporting the ongoing innovation of tooling.",
  },
  "contract-standards": {
    overviewId: 414,
    eventsId: 415,
    icon: "https://ipfs.near.social/ipfs/bafkreiepgdnu7soc6xgbyd4adicbf3eyxiiwqawn6tguaix6aklfpir634",
    cover:
      "https://ipfs.near.social/ipfs/bafkreiaowjqxds24fwcliyriintjd4ucciprii2rdxjmxgi7f5dmzuscey",
    title: "Contract Standards",
    desc: "Coordinating the contribution to the NEAR dapp standards.",
  },
};
/* END_INCLUDE: "communities.jsx" */

if (!props.label) {
  return (
    <div class="alert alert-danger" role="alert">
      Error: label is required
    </div>
  );
}

const label = props.label;

const discussionRequiredPosts =
  Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
    label,
  }) ?? [];

const community = communities[props.label];

const SearchResults = (
  <div class="row">
    <div class="col">
      {widget("components.search.Search", { query: "your-query-string" })}
    </div>
  </div>
);

const onMention = (accountId) => (
  <span key={accountId} className="d-inline-flex" style={{ fontWeight: 500 }}>
    <Widget
      src="neardevgov.near/widget/ProfileLine"
      props={{
        accountId: accountId.toLowerCase(),
        hideAccountId: true,
        tooltip: true,
      }}
    />
  </span>
);

const LabelsDisplay = (
  <div className="d-flex flex-wrap gap-2 mb-2">
    {tags.length > 0 && (
      <div>
        {tags.map((tag, i) => (
          <span
            key={i}
            className="me-1 mb-1 fw-light badge border border-secondary text-bg-light"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}
    <div className="collapse public-tags">
      <Widget src="mob.near/widget/PublicTags" props={{ accountId }} />
    </div>
  </div>
);

const Discussions = (
  <div class="row">
    <div class="col-md-8">
      {widget("components.layout.Controls", {
        labels: discussionsRequiredLabels,
      })}
      <div className="row mb-2">
        <div className="col">
          <small className="text-muted">
            Required label:
            <a href={href("Feed", { label })} key={label}>
              <span
                className="badge text-bg-grey me-1"
                style={{
                  color: "black",
                  fontSize: "1.em",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                }}
              >
                {label}
              </span>
            </a>
          </small>
        </div>
      </div>

      <div class="row">
        <div class="col">
          {discussionRequiredPosts.map((postId) =>
            widget("components.posts.Search", { id: postId }, postId)
          )}
        </div>
      </div>
    </div>
    <div>
      <Widget
        src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.community.Sidebar`}
        props={{
          metadata: metadata,
          accountId: accountId,
          widgetName: widgetName,
        }}
      />
    </div>
  </div>
);

return widget("components.community.Layout", {
  label: props.label,
  tab: "Discussions",
  children: (
    <div class="row">
      <div class="col-md-8">
        <div className="row mb-2">
          <div className="col">
            <small className="text-muted">
              Required label:
              <a href={href("Feed", { label })} key={label}>
                <span
                  className="badge text-bg-grey me-1"
                  style={{
                    color: "black",
                    fontSize: "1.em",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {label}
                </span>
              </a>
            </small>
          </div>
          {widget("components.layout.PlusPost", {
            labels: discussionsRequiredLabels,
          })}
        </div>

        <div class="row">
          <div class="col">
            {discussionRequiredPosts.map((postId) =>
              widget(
                "components.posts.Search",
                { id: postId, collapsed: true },
                postId
              )
            )}
          </div>
        </div>
      </div>
      <div class="col-4 container-fluid">
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.community.Sidebar`}
          props={{
            metadata: metadata,
            accountId: accountId,
            widgetName: widgetName,
            label: props.label,
          }}
        />
      </div>
    </div>
  ),
});
