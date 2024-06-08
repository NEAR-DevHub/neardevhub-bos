const { href } = VM.require("devhub.near/widget/core.lib.url");
if (!href) {
  return <p>Loading modules...</p>;
}
const { community } = props;
const CommunitySummary = () => {
  return (
    <>
      <Widget
        src={"devhub.near/widget/devhub.components.molecule.MarkdownViewer"}
        props={{
          text: community.bio_markdown,
        }}
      />
      <small class="text-muted mb-3">
        <Link
          to={href({
            widgetSrc: "devhub.near/widget/app",
            params: { page: "feed", tag: community.tag },
          })}
        >
          <Widget
            src={"devhub.near/widget/devhub.components.atom.Tag"}
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
      src={"devhub.near/widget/devhub.entity.community.Tile"}
      props={{
        fullWidth: true,
        minHeight: 0,
        noBorder: true,
        children: <CommunitySummary />,
        style: { marginTop: "0.5rem" },
      }}
    />
    <Widget
      src={"devhub.near/widget/devhub.entity.community.Tile"}
      props={{
        heading: "Admins",
        children: (community?.admins ?? []).map((accountId) => (
          <div key={accountId} className="d-flex" style={{ fontWeight: 500 }}>
            <Widget
              src="devhub.near/widget/devhub.components.molecule.ProfileCard"
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
