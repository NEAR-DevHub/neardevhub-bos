const {
  nearDevGovGigsWidgetsAccountId,
  nearDevGovGigsContractAccountId,
  handle,
} = props;

const { getCommunity } = VM.require(
  `${nearDevGovGigsWidgetsAccountId}/widget/DevHub.modules.contract-sdk`
);

const communityData = getCommunity(nearDevGovGigsContractAccountId, { handle });

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
            src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.components.atom.tag`}
            props={{
              linkTo: "Feed",
              ...communityData,
            }}
          />
        </small>
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.PostControls`}
          props={{ labels: communityData.tag  }}
        />
      </div>
      <Widget
        src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.post.List`}
        props={{
          nearDevGovGigsContractAccountId,
          nearDevGovGigsWidgetsAccountId,
          tag: communityData.tag,
        }}
      />
    </div>
    <div class="col-md-3 container-fluid">
      <Widget
        src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.entity.community.sidebar`}
        props={{
          nearDevGovGigsContractAccountId,
          nearDevGovGigsWidgetsAccountId,
          handle: communityData.handle,
        }}
      />
    </div>
  </div>
);
