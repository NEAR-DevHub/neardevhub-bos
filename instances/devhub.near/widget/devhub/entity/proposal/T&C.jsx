const { getLinkUsingCurrentGateway } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.url"
) || { getLinkUsingCurrentGateway: () => {} };

State.init({
  proposalBlockHeight: null,
  acceptedTermsVersion: "${REPL_TERMS_AND_CONDITION_BLOCKHEIGHT}",
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

// NEED TO UPDATE TO GET ARGS DATA
if (state.proposalBlockHeight !== null) {
  const data = fetch("https://1rpc.io/near", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "query",
      params: {
        request_type: "call_function",
        block_id: proposalBlockHeight,
        method_name: "add_proposal",
      },
    }),
  });
}

return (
  <a
    href={getLinkUsingCurrentGateway(
      `${REPL_DEVHUB}/widget/devhub.entity.proposal.TermsAndCondition@${state.acceptedTermsVersion}`
    )}
    className="text-decoration-underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    DevHub’s Terms and Conditions
  </a>
);
