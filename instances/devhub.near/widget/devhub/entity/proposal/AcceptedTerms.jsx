const { getLinkUsingCurrentGateway } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.url"
) || { getLinkUsingCurrentGateway: () => {} };

State.init({
  proposalBlockHeight: null,
});

const proposalId = props.proposalId;

const QUERYAPI_ENDPOINT = `https://near-queryapi.api.pagoda.co/v1/graphql`;
const fetchGraphQL = (operationsDoc, operationName, variables) => {
  return asyncFetch(QUERYAPI_ENDPOINT, {
    method: "POST",
    headers: { "x-hasura-role": `polyprogrammist_near` },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
};

const queryName =
  "polyprogrammist_near_devhub_prod_v1_proposals_with_latest_snapshot";
const query = `query GetLatestSnapshot($offset: Int = 0, $limit: Int = 10, $where: ${queryName}_bool_exp = {}) {
    ${queryName}(
      offset: $offset
      limit: $limit
      order_by: {proposal_id: desc}
      where: $where
    ) {
      block_height
    }
  }`;

const variables = {
  limit: 10,
  offset,
  where: { proposal_id: { _eq: proposalId } },
};

fetchGraphQL(query, "GetLatestSnapshot", variables).then(async (result) => {
  if (result.status === 200) {
    if (result.body.data) {
      const data = result.body.data?.[queryName];
      console.log(data);
      State.update({ proposalBlockHeight: data[0].block_height });
    }
  }
});

let acceptedTermsVersion = "${REPL_TERMS_AND_CONDITION_BLOCKHEIGHT}";

if (state.proposalBlockHeight !== null) {
  const data = fetch(
    `https://mainnet.neardata.xyz/v0/block/${state.proposalBlockHeight}`
  );
  if (Array.isArray(data?.body?.shards)) {
    data.body.shards.map((shard) => {
      const data = shard.chunk.transactions.filter(
        (txn) =>
          txn.transaction.receiver_id === "devhub.near" &&
          txn.transaction.actions[0].FunctionCall.method_name === "add_proposal"
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
      `${REPL_DEVHUB}/widget/devhub.entity.proposal.TermsAndCondition@${acceptedTermsVersion}`
    )}
    className="text-decoration-underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    DevHub’s Terms and Conditions
  </a>
);
