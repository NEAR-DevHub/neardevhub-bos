const { getGlobalLabels } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };

const announcement = (
  <div className="bg-blue text-sm mt-2 p-3 rounded-3">
    <p className="d-flex gap-3 align-items-center mb-0">
      <div>
        <i className="bi bi-info-circle"></i>
      </div>
      <div>
        <span className="fw-bold">
          Welcome to the Infrastructure Committee Proposal Feed!
        </span>
        This dedicated space makes it easy to submit and track funding proposals
        from the Infrastructure Committee, the primary organization overseeing
        improvements pertaining to wallets, indexers, RPC services, explorers,
        oracles, bridges, NEAR Protocol features, and related ecosystem
        upgrades. You are welcome to respond to any RFPs that are accepting
        submissions or submit an independent proposal.
      </div>
    </p>
  </div>
);

return (
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Feed"}
    props={{
      instance: "infrastructure-committee.near",
      announcement: announcement,
      availableCategoryOptions: getGlobalLabels(),
    }}
  />
);
