const { handle } = props;

const { getCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/DevHub.modules.contract-sdk"
);

const communityData = getCommunity({ handle });

if (communityData === null) {
  return <div>Loading...</div>;
}

return (
  <div class="row">
    <div class="col-md-9">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <small class="text-muted">
          <span>Required tags:</span>
          <Widget
            src={"${REPL_DEVHUB}/widget/gigs-board.components.atom.tag"}
            props={{
              linkTo: "Feed",
              ...communityData,
            }}
          />
        </small>
        <Widget
          src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.PostControls"}
          props={{ labels: communityData.tag }}
        />
      </div>
      <Widget
        src={"${REPL_DEVHUB}/widget/DevHub.entity.post.List"}
        props={{
          tag: communityData.tag,
        }}
      />
    </div>
    <div class="col-md-3 container-fluid">
      <Widget
        src={"${REPL_DEVHUB}/widget/DevHub.entity.community.Sidebar"}
        props={{ community: communityData }}
      />
    </div>
  </div>
);
