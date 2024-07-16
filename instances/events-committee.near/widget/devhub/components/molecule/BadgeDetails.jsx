const nearDevGovBadgesContractId = "neardevgov.near";

let badgeId, ownerAccountId;
if (props.tokenId) {
  let [_badgeId, _ownerAccountId] = props.tokenId.split(":", 2);
  badgeId = _badgeId;
  ownerAccountId = _ownerAccountId;
} else {
  badgeId = props.badgeId;
}

if (!badgeId) {
  return (
    <>
      Please, provide <pre>badgeId</pre> or <pre>tokenId</pre> to the
      DevGovBadgeDetails component
    </>
  );
}

let badgeMetadata =
  props.badgeMetadata ??
  Near.view(nearDevGovBadgesContractId, "get_badge", {
    badge_id: badgeId,
  }).badge_metadata;

if (!badgeMetadata) {
  return <>Loading...</>;
}

return (
  <>
    <div className="bg-white shadow rounded overflow-hidden">
      <div className="px-4 pt-0 pb-5 bg-dark position-relative">
        <div
          className="profile-picture d-inline-block"
          style={{ transform: "translateY(7rem)" }}
        >
          <Widget
            src="${REPL_MOB}/widget/NftImage"
            props={{
              style: { width: "10em", height: "10em" },
              className: "rounded-circle w-100 h-100 img-thumbnail d-block",
              nft: {
                tokenMetadata: badgeMetadata,
                contractId: nearDevGovBadgesContractId,
              },
              alt: badgeMetadata.title,
            }}
          />
        </div>
      </div>
      <div className="bg-light px-4 pb-4">
        <div className="d-md-flex justify-content-between pt-3 mb-2">
          <div style={{ paddingTop: "3rem" }}>
            <div className="me-2 d-sm-flex gap-1 flex-row align-items-center">
              <div className="me-2 position-relative">
                <h4 className="mt-0 mb-0 text-truncate">
                  {badgeMetadata.title}
                </h4>
              </div>
            </div>
            <div className="d-flex flex-row">
              <div className="me-4">
                <span className="text-muted">Awarded to</span>
                <span className="fw-bolder">{badgeMetadata.copies}</span>
                <span className="text-muted">developers</span>
              </div>
            </div>
            <div>
              <Markdown text={badgeMetadata.description} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
