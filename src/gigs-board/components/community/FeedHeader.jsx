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
    telegram: "NearZeroKnowledge",
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
                  id: "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630",
                  description: "Lorem ipsum",
                  labelSearchTerms: ["S-draft"],
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

    telegram: "NEAR_Protocol_Community_Group",
  },

  tooling: {
    overviewId: 416,
    eventsId: 417,

    icon: "https://ipfs.near.social/ipfs/bafkreie2eaj5czmpfe6pe53kojzcspgozebdsonffwvbxtpuipnwahybvi",

    cover:
      "https://ipfs.near.social/ipfs/bafkreiehzr7z2fhoqqmkt3z667wubccbch6sqtsnvd6msodyzpnf72cszy",

    title: "Tooling",
    desc: "Supporting the ongoing innovation of tooling.",
    telegram: "NEAR_Tools_Community_Group",
  },

  "contract-standards": {
    overviewId: 414,
    eventsId: 415,

    icon: "https://ipfs.near.social/ipfs/bafkreiepgdnu7soc6xgbyd4adicbf3eyxiiwqawn6tguaix6aklfpir634",

    cover:
      "https://ipfs.near.social/ipfs/bafkreiaowjqxds24fwcliyriintjd4ucciprii2rdxjmxgi7f5dmzuscey",

    title: "Contract Standards",
    desc: "Coordinating the contribution to the NEAR dapp standards.",
    telegram: "nearnft",
  },
};
/* END_INCLUDE: "shared/mocks" */

const Gradient = styled.div`
   {
    margin-top: -25px;
    margin-bottom: 25px;
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

return (
  <>
    <Gradient className="d-flex flex-column justify-content-center">
      <div class="subtitle-above text-white opacity-75 mb-2">
        A decentralized community of
      </div>
      <h1 class="mb-3 text-white slogan">
        <span class="text-primary-gradient">NEAR </span>Developers
      </h1>
      <div class="subtitle-below text-white opacity-75">
        Share your ideas, match solutions, and access support and funding.
      </div>
    </Gradient>
    <div class="h5 pb-3">Featured Communities</div>
    <div class="row">
      {Object.entries(communities).map(([label, community]) => {
        return (
          <div class="col">
            {widget(
              "components.community.FeaturedCommunity",
              {
                label,
                ...community,
              },
              label
            )}
          </div>
        );
      })}
    </div>
    <div class="h5 pb-3 pt-5">Activity</div>
  </>
);
