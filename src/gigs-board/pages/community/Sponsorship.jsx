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

/* INCLUDE: "shared/mocks" */
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

    integrations: {
      github: {
        kanban: {
          boards: {
            "18855b9c9f2-216091d-6484800b-42593f54-6102b48a": {
              id: "18855b9c9f2-216091d-6484800b-42593f54-6102b48a",

              columns: {
                "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630": {
                  description: "Lorem ipsum",
                  labelTerms: ["S-draft"],
                  title: "Draft",
                },
              },

              dataTypesIncluded: { Issue: false, PullRequest: true },
              description: "Latest NEAR Enhancement Proposals by status",
              repoURL: "https://github.com/near/NEPs",
              title: "NEAR Protocol NEPs",
            },
          },
        },
      },
    },
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
/* END_INCLUDE: "shared/mocks" */

if (!props.label) {
  return (
    <div class="alert alert-danger" role="alert">
      Error: label is required
    </div>
  );
}

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
  ids.delete(communities[props.label].overviewId);
  ids.delete(communities[props.label].eventsId);
  return [...ids].reverse();
};

const sponsorshipRequiredLabels = ["funding", props.label];
const sponsorshipRequiredPosts = postIdsWithLabels(sponsorshipRequiredLabels);

const Sponsorship = (
  <div>
    <div class="row mb-2 justify-content-center">
      <div class="col-md-auto">
        <small class="text-muted">
          Post Type: <b>Sponsorship</b>
        </small>
      </div>
      <div class="col-md-auto">
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
              Sponsored Projects ({sponsorshipRequiredPosts.length})
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
);

return widget("components.community.Layout", {
  label: props.label,
  tab: "Sponsorship",
  children: Sponsorship,
});
