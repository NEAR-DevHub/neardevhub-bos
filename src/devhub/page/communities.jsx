const { getAllCommunitiesMetadata, createCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAllCommunitiesMetadata || !createCommunity) {
  return <p>Loading modules...</p>;
}

const onCommunitySubmit = (inputs) =>
  createCommunity({
    inputs: {
      ...inputs,

      bio_markdown: [
        "This is a sample text about your community.",
        "You can change it on the community configuration page.",
      ].join("\n"),

      logo_url:
        "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu",

      banner_url:
        "https://ipfs.near.social/ipfs/bafkreic4xgorjt6ha5z4s5e3hscjqrowe5ahd7hlfc5p4hb6kdfp6prgy4",
    },
  });

const [showSpawner, setShowSpawner] = useState(false);

const communitiesMetadata = getAllCommunitiesMetadata();

if (!communitiesMetadata) {
  return <p>Loading...</p>;
}
return (
  <div className="w-100">
    <div
      className="d-flex justify-content-between p-4"
      style={{ backgroundColor: "#181818" }}
    >
      <div className="d-flex flex-column gap-3">
        <h1 className="m-0 fs-4">
          <Link
            to={"/${REPL_DEVHUB}/widget/app?page=communities"}
            className="text-white"
          >
            Communities
          </Link>
        </h1>

        <p className="m-0 text-muted fs-6">
          Discover NEAR developer communities
        </p>
      </div>
      {context.accountId && (
        <div className="d-flex flex-column justify-content-center">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
            props={{
              icon: { type: "bootstrap_icon", variant: "bi-people-fill" },
              onClick: () => setShowSpawner(!showSpawner),
              className: "btn btn-primary",
              label: "Create Community",
            }}
          />
        </div>
      )}
    </div>
    <div className="d-flex flex-wrap align-content-start gap-4 p-4 w-100 h-100">
      {showSpawner && (
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.entity.community.Spawner"
          props={{
            data: null,
            onSubmit: onCommunitySubmit,
            onCancel: () => setShowSpawner(false),
          }}
        />
      )}
      {(communitiesMetadata ?? []).reverse().map((communityMetadata) => (
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.entity.community.Card"
          props={{
            format: "small",
            isBannerEnabled: false,
            metadata: communityMetadata,
          }}
        />
      ))}
    </div>
  </div>
);
