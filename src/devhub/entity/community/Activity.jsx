const { handle } = props;

const { getCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!getCommunity || !href) {
  return <p>Loading modules...</p>;
}
const communityData = getCommunity({ handle });

if (communityData === null) {
  return <div>Loading...</div>;
}

return (
  <div class="row w-100">
    <div class="col-md-9">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <small class="text-muted">
          <span>Required tags:</span>
          <Widget
          // TODO: LEGACY.
            src={"${REPL_DEVHUB}/widget/gigs-board.components.atom.tag"}
            props={{
              linkTo: "Feed",
              ...communityData,
            }}
          />
        </small>
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"}
          props={{
            title: "Post",
            href: href({
              // TODO: LEGACY.
              widgetSrc: "${REPL_DEVHUB}/widget/gigs-board.pages.Create",
              params: {
                labels: [communityData.tag],
                nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
                nearDevGovGigsContractAccountId: "${REPL_DEVHUB_CONTRACT}",
              },
            }),
          }}
        />
      </div>
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.post.List"}
        props={{
          tag: communityData.tag,
        }}
      />
    </div>
    <div class="col-md-3 container-fluid">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.community.Sidebar"}
        props={{ community: communityData }}
      />
    </div>
  </div>
);
