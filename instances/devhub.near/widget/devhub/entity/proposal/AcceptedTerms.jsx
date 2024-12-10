const { getLinkUsingCurrentGateway } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.url"
) || { getLinkUsingCurrentGateway: () => {} };

State.init({
  proposalBlockHeight: null,
});

const instance = props.instance ?? "";

const { cacheUrl, portalName } = VM.require(`${instance}/widget/config.data`);

const fetchAndSetProposalSnapshot = () => {
  if (!props.proposalId) {
    return;
  }
  asyncFetch(`${cacheUrl}/proposal/${props.proposalId}/snapshots`, {
    method: "GET",
    headers: { accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Failed to fetch snapshots: ${response.status}`);
      }
      return response.body;
    })
    .then((snapshots) => {
      if (!Array.isArray(snapshots) || snapshots.length === 0) {
        console.log("No snapshots found");
        return;
      }

      // Get the most recent snapshot
      const latestSnapshot = (snapshots || []).reduce((latest, current) =>
        current.block_height > latest.block_height ? current : latest
      );

      State.update({ proposalBlockHeight: latestSnapshot.block_height });
    })
    .catch((error) => {
      console.error("Failed to fetch proposal snapshot:", error);
    });
};

// Fetch snapshot data on component mount
fetchAndSetProposalSnapshot();

let acceptedTermsVersion = Near.block().header.height;

if (state.proposalBlockHeight !== null) {
  const data = fetch(
    `https://mainnet.neardata.xyz/v0/block/${state.proposalBlockHeight}`
  );
  if (Array.isArray(data?.body?.shards)) {
    data.body.shards.map((shard) => {
      const data = (shard?.chunk?.transactions ?? []).filter(
        (txn) =>
          txn?.transaction?.receiver_id === "devhub.near" &&
          txn?.transaction?.actions?.[0]?.FunctionCall?.method_name ===
            "add_proposal"
      );
      if (data?.length) {
        const args = JSON.parse(
          Buffer.from(
            data[0].transaction.actions[0].FunctionCall.args,
            "base64"
          ).toString("utf8")
        );
        acceptedTermsVersion = args.accepted_terms_and_conditions_version;
      }
    });
  }
}

return (
  <a
    href={getLinkUsingCurrentGateway(
      `${REPL_DEVHUB}/widget/devhub.entity.proposal.TermsAndConditions@${acceptedTermsVersion}`
    )}
    className="text-decoration-underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    {portalName}'s Terms and Conditions
  </a>
);
