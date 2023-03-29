/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId || "devgovgigs.near".split("/", 1)[0];
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
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const Scroll = styled.div`
   {
    z-index: -1;
    margin-top: calc(-24px + 100px + 25px + 200px);
  }
`;

if (!props.overviewId) {
  return;
}
const overviewPost = Near.view(nearDevGovGigsContractAccountId, "get_post", {
  post_id: Number(props.overviewId),
});
if (!overviewPost) {
  return <div>Loading ...</div>;
}

if (!props.eventsId) {
  return;
}
const eventsPost = Near.view(nearDevGovGigsContractAccountId, "get_post", {
  post_id: Number(props.eventsId),
});
if (!eventsPost) {
  return <div>Loading ...</div>;
}

initState({
  tab: "Overview",
});

function switchTab(tab) {
  State.update({ tab });
}

const discussionsRequiredLabels = ["community", props.label];
const sponsorshipRequiredLabels = ["funding-funded", props.label];

const postIdsWithLabels = (labels) => {
  const ids = labels
    .map(
      (label) =>
        Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
          label,
        }) ?? []
    )
    .map((ids) => new Set(ids))
    .reduce((previous, current) => {
      console.log(previous, current);
      let res = new Set();
      for (let id of current) {
        if (previous.has(id)) {
          res.add(id);
        }
      }
      return res;
    });
  return [...ids];
};

const discussionRequiredPosts = postIdsWithLabels(discussionsRequiredLabels);
const sponsorshipRequiredPosts = postIdsWithLabels(sponsorshipRequiredLabels);
console.log(sponsorshipRequiredPosts);

return (
  <>
    {widget("components.layout.Banner")}
    {widget("components.layout.CommunityHeader", {
      title: props.title,
      icon: props.icon,
      desc: props.desc,
      switchTab,
    })}
    <Scroll>
      {state.tab === "Overview" ? (
        <div>
          <Markdown
            class="card-text"
            text={overviewPost.snapshot.description}
          ></Markdown>
        </div>
      ) : state.tab === "Discussions" ? (
        <div>
          <div class="row mb-2">
            <div class="col">
              <small class="text-muted">
                Required labels:
                {discussionsRequiredLabels.map((label) => (
                  <a href={href("Feed", { label })} key={label}>
                    <span class="badge text-bg-primary me-1">{label}</span>
                  </a>
                ))}
              </small>
            </div>
          </div>
          {widget("components.layout.Controls")}
          <div class="row">
            <div class="col">
              {discussionRequiredPosts.map((postId) =>
                widget("components.posts.Post", { id: postId }, postId)
              )}
            </div>
          </div>
        </div>
      ) : state.tab === "Sponsorship" ? (
        <div>
          <div class="row mb-2">
            <div class="col">
              <small class="text-muted">
                Post Type: <b>Sponsorship</b>
              </small>
            </div>
            <div class="col">
              <small class="text-muted">
                Required labels:
                {sponsorshipRequiredLabels.map((label) => (
                  <a href={href("Feed", { label })} key={label}>
                    <span class="badge text-bg-primary me-1">{label}</span>
                  </a>
                ))}
              </small>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-body border-secondary">
                  <h6 class="card-title">
                    Funded ({sponsorshipRequiredPosts.length})
                  </h6>
                  <div class="row">
                    {sponsorshipRequiredPosts.map((postId) => (
                      <div class="col-3">
                        {widget(
                          "components.posts.CompactPost",
                          { id: postId },
                          postId
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : state.tab === "Events" ? (
        <div>
          <Markdown
            class="card-text"
            text={eventsPost.snapshot.description}
          ></Markdown>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </Scroll>
  </>
);
