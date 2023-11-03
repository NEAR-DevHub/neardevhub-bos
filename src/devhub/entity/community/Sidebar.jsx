const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

const { community } = props;

const CommunitySummary = () => {
  return (
    <>
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"}
        props={{
          text: community.bio_markdown,
        }}
      />
      <small class="text-muted mb-3">
        <Link
          to={href({
            widgetSrc: "${REPL_DEVHUB}/widget/app",
            params: { page: "feed", tag: community.tag },
          })}
        >
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
            props={{ tag: community.tag }}
          />
        </Link>
      </small>
    </>
  );
};

return community === null ? (
  <div>Loading...</div>
) : (
  <div class="d-flex flex-column align-items-end">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.community.Tile"}
      props={{
        fullWidth: true,
        minHeight: 0,
        noBorder: true,
        children: <CommunitySummary />,
        style: { marginTop: "0.5rem" },
      }}
    />

    <Widget
      // TODO: LEGACY.
      src={"${REPL_DEVHUB}/widget/devhub.entity.community.Tile"}
      props={{
        heading: "Admins",

        children: (community?.admins ?? []).map((accountId) => (
          <div key={accountId} className="d-flex" style={{ fontWeight: 500 }}>
            <Widget
              // TODO: LEGACY.
              src={
                "${REPL_DEVHUB_LEGACY}/widget/gigs-board.components.molecule.profile-card"
              }
              props={{ accountId }}
            />
          </div>
        )),

        fullWidth: true,
        minHeight: 0,
        noBorder: true,
      }}
    />
  </div>
);
