/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const QUERYAPI_ENDPOINT = `https://near-queryapi.api.pagoda.co/v1/graphql/`;

const queryName =
  props.queryName ?? `bo_near_devhub_v17_posts_with_latest_snapshot`;

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

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(QUERYAPI_ENDPOINT, {
    method: "POST",
    headers: { "x-hasura-role": `bo_near` },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

function search() {
  State.update({ loading: true });
  let where = {};
  if (props.authorQuery && props.authorQuery.author) {
    where = { author_id: { _eq: props.authorQuery.author }, ...where };
  }
  if (state.term) {
    where = { description: { _ilike: `%${state.term}%` }, ...where };
  }
  if (props.tagQuery && props.tagQuery.tag) {
    where = { labels: { _contains: props.tagQuery.tag }, ...where };
  }
  console.log("searching for", where);
  fetchGraphQL(query, "DevhubPostsQuery", {
    limit: 100,
    offset: 0,
    where,
  }).then((result) => {
    if (result.status === 200) {
      console.log("search success");
      if (result.body.data) {
        const data = result.body.data[queryName];
        State.update({
          searchResult: {
            postIds: data.map((p) => p.post_id),
            keywords: state.term ? [state.term] : undefined,
          },
        });
        console.log("found:");
        console.log(data);
      }
    } else {
      console.error("error:", result.body);
    }
    State.update({ loading: false });
  });
}

const updateInput = (term) => {
  State.update({
    term,
  });
};

const buttonStyle = {
  backgroundColor: "#0C7283",
  color: "#f3f3f3",
};

return (
  <>
    <div className="d-flex flex-row gap-4">
      <div class="dropdown">
        {widget("entity.post.AuthorSearch", {
          authorQuery: props.authorQuery,
          onAuthorSearch: props.onAuthorSearch,
        })}
      </div>
      <div>
        {widget("entity.post.TagSearch", {
          tagQuery: props.tagQuery,
          onTagSearch: props.onTagSearch,
        })}
      </div>
      <div className="d-flex flex-row position-relative w-25">
        <input
          type="search"
          className="form-control border border-0 bg-light"
          value={state.term ?? ""}
          onChange={(e) => updateInput(e.target.value)}
          placeholder={props.placeholder ?? `Search by content`}
        />
      </div>
      <button class="btn btn-light" style={buttonStyle} onClick={search}>
        {state.loading ? (
          <span
            className="spinner-grow spinner-grow-sm m-auto"
            role="status"
            aria-hidden="true"
          />
        ) : (
          <i class="bi bi-search m-auto"></i>
        )}{" "}
        Search
      </button>
      {state.searchResult ? (
        <button
          class="btn btn-light"
          onClick={() => State.update({ searchResult: null })}
        >
          Clear Result
        </button>
      ) : (
        ""
      )}
      <div className="d-flex flex-row-reverse flex-grow-1">
        {props.children}
      </div>
    </div>
    {state.searchResult
      ? widget("entity.post.List", {
          searchResult: state.searchResult,
          recency: props.recency,
        })
      : widget("entity.post.List", {
          recency: props.recency,
          transactionHashes: props.transactionHashes,
        })}
  </>
);
