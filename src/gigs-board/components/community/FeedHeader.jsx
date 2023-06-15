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
        boards: {
          "18855b9c9f2-216091d-6484800b-42593f54-6102b48a": {
            id: "18855b9c9f2-216091d-6484800b-42593f54-6102b48a",

            columns: {
              "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630": {
                id: "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630",

                description:
                  "NEPs that need a moderator review or author revision.",

                labelSearchTerms: ["WG-protocol", "S-draft"],
                title: "📄 Draft",
              },

              "18877dc932c-c309c28--4b95e909--220e9bbb--51ff54c9": {
                description:
                  "NEPS that need a review by Subject Matter Experts.",

                labelSearchTerms: ["WG-protocol", "S-review"],
                title: "👀 Review",
                id: "18877dc932c-c309c28--4b95e909--220e9bbb--51ff54c9",
              },

              "18877dd71e5-47d177b8-5505178-640a5937--17968e87": {
                description:
                  "NEPS in the final review stage that need the work group voting indications.",

                labelSearchTerms: ["WG-protocol", "S-voting"],
                title: "✔ Voting",
                id: "18877dd71e5-47d177b8-5505178-640a5937--17968e87",
              },

              "18877e14753--5b0ca250-1edea464-523fd579--5ebde527": {
                description:
                  "NEPS that were reviewed and approved by a work group.",

                labelSearchTerms: ["WG-protocol", "S-approved"],
                title: "✅ Approved NEPs",
                id: "18877e14753--5b0ca250-1edea464-523fd579--5ebde527",
              },

              "18877e2f94c-4cc0ff57--1fb016c6--39ce0459-23922e81": {
                description:
                  "NEPS that were reviewed and approved by a work group or NEP moderators.",

                labelSearchTerms: ["WG-protocol", "A-NEP-GrammarFix"],
                title: "🔧 Approved Fixes",
                id: "18877e2f94c-4cc0ff57--1fb016c6--39ce0459-23922e81",
              },

              "18877e40c46--76d23f4d-578f24a8--2cfcd190--74aa77be": {
                description:
                  "NEPs that were retracted by the author or had no activity for over two months.",

                labelSearchTerms: ["WG-protocol", "S-retracted"],
                title: "❌ RETRACTED",
                id: "18877e40c46--76d23f4d-578f24a8--2cfcd190--74aa77be",
              },
            },

            dataTypesIncluded: { Issue: false, PullRequest: true },
            description: "Latest NEAR Enhancement Proposals by status",
            repoURL: "https://github.com/near/NEPs",
            ticketState: "all",
            title: "NEAR Protocol NEPs",
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

    integrations: {
      github: {
        boards: {
          "18855b9c9f2-216091d-6484800b-42593f54-6102b48a": {
            id: "18855b9c9f2-216091d-6484800b-42593f54-6102b48a",

            columns: {
              "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630": {
                id: "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630",

                description:
                  "NEPs that need a moderator review or author revision.",

                labelSearchTerms: ["WG-tools", "S-draft"],
                title: "📄 Draft",
              },

              "18877dc932c-c309c28--4b95e909--220e9bbb--51ff54c9": {
                description:
                  "NEPS that need a review by Subject Matter Experts.",

                labelSearchTerms: ["WG-tools", "S-review"],
                title: "👀 Review",
                id: "18877dc932c-c309c28--4b95e909--220e9bbb--51ff54c9",
              },

              "18877dd71e5-47d177b8-5505178-640a5937--17968e87": {
                description:
                  "NEPS in the final review stage that need the work group voting indications.",

                labelSearchTerms: ["WG-tools", "S-voting"],
                title: "✔ Voting",
                id: "18877dd71e5-47d177b8-5505178-640a5937--17968e87",
              },

              "18877e14753--5b0ca250-1edea464-523fd579--5ebde527": {
                description:
                  "NEPS that were reviewed and approved by a work group.",

                labelSearchTerms: ["WG-tools", "S-approved"],
                title: "✅ Approved NEPs",
                id: "18877e14753--5b0ca250-1edea464-523fd579--5ebde527",
              },

              "18877e2f94c-4cc0ff57--1fb016c6--39ce0459-23922e81": {
                description:
                  "NEPS that were reviewed and approved by a work group or NEP moderators.",

                labelSearchTerms: ["WG-tools", "A-NEP-GrammarFix"],
                title: "🔧 Approved Fixes",
                id: "18877e2f94c-4cc0ff57--1fb016c6--39ce0459-23922e81",
              },

              "18877e40c46--76d23f4d-578f24a8--2cfcd190--74aa77be": {
                description:
                  "NEPs that were retracted by the author or had no activity for over two months.",

                labelSearchTerms: ["WG-tools", "S-retracted"],
                title: "❌ RETRACTED",
                id: "18877e40c46--76d23f4d-578f24a8--2cfcd190--74aa77be",
              },
            },

            dataTypesIncluded: { Issue: false, PullRequest: true },
            description: "Latest NEAR Enhancement Proposals by status",
            repoURL: "https://github.com/near/NEPs",
            ticketState: "all",
            title: "NEAR Tooling NEPs",
          },
        },
      },
    },

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

    integrations: {
      github: {
        boards: {
          "18855b9c9f2-216091d-6484800b-42593f54-6102b48a": {
            id: "18855b9c9f2-216091d-6484800b-42593f54-6102b48a",

            columns: {
              "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630": {
                id: "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630",

                description:
                  "NEPs that need a moderator review or author revision.",

                labelSearchTerms: ["WG-contract-standards", "S-draft"],
                title: "📄 Draft",
              },

              "18877dc932c-c309c28--4b95e909--220e9bbb--51ff54c9": {
                description:
                  "NEPS that need a review by Subject Matter Experts.",

                labelSearchTerms: ["WG-contract-standards", "S-review"],
                title: "👀 Review",
                id: "18877dc932c-c309c28--4b95e909--220e9bbb--51ff54c9",
              },

              "18877dd71e5-47d177b8-5505178-640a5937--17968e87": {
                description:
                  "NEPS in the final review stage that need the work group voting indications.",

                labelSearchTerms: ["WG-contract-standards", "S-voting"],
                title: "✔ Voting",
                id: "18877dd71e5-47d177b8-5505178-640a5937--17968e87",
              },

              "18877e14753--5b0ca250-1edea464-523fd579--5ebde527": {
                description:
                  "NEPS that were reviewed and approved by a work group.",

                labelSearchTerms: ["WG-contract-standards", "S-approved"],
                title: "✅ Approved NEPs",
                id: "18877e14753--5b0ca250-1edea464-523fd579--5ebde527",
              },

              "18877e2f94c-4cc0ff57--1fb016c6--39ce0459-23922e81": {
                description:
                  "NEPS that were reviewed and approved by a work group or NEP moderators.",

                labelSearchTerms: ["WG-contract-standards", "A-NEP-GrammarFix"],
                title: "🔧 Approved Fixes",
                id: "18877e2f94c-4cc0ff57--1fb016c6--39ce0459-23922e81",
              },

              "18877e40c46--76d23f4d-578f24a8--2cfcd190--74aa77be": {
                description:
                  "NEPs that were retracted by the author or had no activity for over two months.",

                labelSearchTerms: ["WG-contract-standards", "S-retracted"],
                title: "❌ RETRACTED",
                id: "18877e40c46--76d23f4d-578f24a8--2cfcd190--74aa77be",
              },
            },

            dataTypesIncluded: { Issue: false, PullRequest: true },
            description: "Latest NEAR Enhancement Proposals by status",
            repoURL: "https://github.com/near/NEPs",
            ticketState: "all",
            title: "NEAR Contract Standards NEPs",
          },
        },
      },
    },

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
