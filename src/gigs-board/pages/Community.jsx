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

/* INCLUDE: "communities.jsx" */
const communities = {
  "zero-knowledge": {
    overviewId: 397,
    eventsId: 401,
    icon: "https://ipfs.near.social/ipfs/bafkreigthuagbsrl2xbpk5h4bneoteiv4pqa5itokrqrm4wckgasa6d4nm",
    cover:
      "https://ipfs.near.social/ipfs/bafkreifuflol4fgihxcgpxkl56lygpgdisdfbizrjpt4jhir7mvx3ddh4a",
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
    icon: "https://ipfs.near.social/ipfs/bafkreifayatdzw2xdh3niiapxubkqgmsctkdfgfg6qmsc4mcceqahezus4",
    cover:
      "https://ipfs.near.social/ipfs/bafkreiemxjll2evs54vr6tr75akup55swl65g7hqqxgransvxrgajgcj64",
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

const Scroll = styled.div`
   {
    z-index: -1;
    margin-top: calc(-24px + 100px + 25px + 200px);
  }
`;

if (!props.label) {
  return <div>Loading ...</div>;
}

const community = communities[props.label];

const overviewPost = Near.view(nearDevGovGigsContractAccountId, "get_post", {
  post_id: community.overviewId,
});
if (!overviewPost) {
  return <div>Loading ...</div>;
}

const eventsPost = Near.view(nearDevGovGigsContractAccountId, "get_post", {
  post_id: community.eventsId,
});
if (!eventsPost) {
  return <div>Loading ...</div>;
}

const discussionsRequiredLabels = [props.label];
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

return (
  <>
    {widget("components.layout.Banner")}
    {widget("components.community.CommunityHeader", {
      title: community.title,
      icon: community.icon,
      desc: community.desc,
      label: props.label,
    })}
    <Scroll>
      {!props.tab || props.tab === "Overview" ? (
        <div>
          <Markdown
            class="card-text"
            text={overviewPost.snapshot.description}
          ></Markdown>
        </div>
      ) : props.tab === "Discussions" ? (
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
      ) : props.tab === "Sponsorship" ? (
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
      ) : props.tab === "Events" ? (
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
