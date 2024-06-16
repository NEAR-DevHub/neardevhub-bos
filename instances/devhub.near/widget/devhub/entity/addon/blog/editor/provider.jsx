const { getPost } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
) || { getPost: () => {} };

const { Layout, handle } = props;

const QUERYAPI_ENDPOINT = `https://near-queryapi.api.pagoda.co/v1/graphql/`;

const fetchGraphQL = (operationsDoc, operationName, variables) => {
  return fetch(QUERYAPI_ENDPOINT, {
    method: "POST",
    headers: { "x-hasura-role": `bo_near` },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
};

const queryName =
  props.queryName ?? `bo_near_devhub_v38_posts_with_latest_snapshot`;

const query = `query DevhubPostsQuery($limit: Int = 100, $offset: Int = 0, $where: ${queryName}_bool_exp = {}) {
    ${queryName}(
      limit: $limit
      offset: $offset
      order_by: {block_height: desc}
      where: $where
    ) {
      post_id
    }
  }
`;

const includeLabels = ["blog", handle];

const buildWhereClause = () => {
  let where = {};
  if (props.author) {
    where = { author_id: { _eq: props.author }, ...where };
  }
  if (props.term) {
    where = { description: { _ilike: `%${props.term}%` }, ...where };
  }
  if (includeLabels && Array.isArray(includeLabels)) {
    const labelConditions = includeLabels.map((label) => ({
      labels: { _contains: label },
    }));

    where = { _and: [...labelConditions, where] };
  }
  if (props.excludeLabels && Array.isArray(props.excludeLabels)) {
    const labelConditions = props.excludeLabels.map((label) => ({
      labels: { _nin: label },
    }));

    where = { _and: [...labelConditions, where] };
  }
  if (!props.recency) {
    where = { parent_id: { _is_null: true }, ...where };
  }
  return where;
};

const variables = { limit: DISPLAY_COUNT, offset, where: buildWhereClause() };

const posts = fetch(QUERYAPI_ENDPOINT, {
  method: "POST",
  headers: { "x-hasura-role": `bo_near` },
  body: JSON.stringify({
    query: query,
    variables: variables,
    operationName: "DevhubPostsQuery",
  }),
});

const handleOnChange = (v) => {
  console.log("onChange", v);
};

const handleGetData = (v) => {
  const postId = parseInt(v);
  return Near.asyncView("${REPL_DEVHUB_LEGACY}", "get_post", {
    post_id: postId,
  }).then((post) => {
    const description = JSON.parse(post.snapshot.description || "null") || {};
    return {
      id: postId,
      ...description,
    };
  });
};

const handleOnSubmit = (v, isEdit) => {
  if (isEdit) {
    Near.call({
      contractName: "${REPL_DEVHUB_LEGACY}",
      methodName: "edit_post",
      args: {
        id: parseInt(v.id),
        labels: ["blog", handle],
        body: {
          post_type: "Comment",
          description: JSON.stringify(v),
          comment_version: "V2",
        },
      },
      gas: Big(10).pow(14),
    });
  } else {
    Near.call({
      contractName: "${REPL_DEVHUB_LEGACY}",
      methodName: "add_post",
      args: {
        labels: ["blog", handle],
        body: {
          post_type: "Comment",
          description: JSON.stringify(v),
          comment_version: "V2",
        },
      },
      gas: Big(10).pow(14),
    });
  }
};

const handleOnCancel = (v) => {
  console.log("onCancel", v);
};

return (
  <Layout
    data={posts.body.data.bo_near_devhub_v38_posts_with_latest_snapshot || []}
    getData={handleGetData}
    onChange={handleOnChange}
    onSubmit={handleOnSubmit}
    onCancel={handleOnCancel}
  />
);
