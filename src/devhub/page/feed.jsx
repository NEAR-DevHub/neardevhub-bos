const { author, recency, tag } = props;

const { getFeaturedCommunities } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!getFeaturedCommunities || !href) {
  return <p>Loading modules...</p>;
}

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

const featuredCommunities = getFeaturedCommunities() || [];

function Banner() {
  return (
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
        <div className="d-flex gap-4 justify-content-between">
          {featuredCommunities.map((community) => (
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.community.card"}
              props={{ metadata: community, format: "medium" }}
            />
          ))}
        </div>
      </div>

      <div className="h5 pb-4">Activity</div>
    </div>
  );
}

return (
  <div className="w-100">
    <Banner />
    <Widget
      // TODO: LEGACY.
      src={"${REPL_DEVHUB}/widget/gigs-board.feature.post-search.panel"}
      props={{
        children: (
          <Widget
            // TODO: LEGACY.
            src={"${REPL_DEVHUB}/widget/gigs-board.components.layout.Controls"}
            props={{
              title: "Post",
              href: href({
                // TODO: LEGACY.
                widgetSrc: "${REPL_DEVHUB}/widget/gigs-board.pages.Create",
                params: {
                  labels: [searchTag],
                  nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
                  nearDevGovGigsContractAccountId: "${REPL_DEVHUB_CONTRACT}",
                },
              }),
            }}
          />
        ),
        recency,
        transactionHashes: props.transactionHashes,
        nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
        nearDevGovGigsContractAccountId: "${REPL_DEVHUB_CONTRACT}",
      }}
    />
  </div>
);
