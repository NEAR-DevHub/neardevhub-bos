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

State.init({
  tag: props.tag,
});

function search({ author, tag }) {
  State.update({ loading: true });
  let where = {};
  let authorId = author || state.author;
  let label = tag || state.tag;
  if (authorId) {
    where = { author_id: { _eq: authorId }, ...where };
  }
  if (state.term) {
    where = { description: { _ilike: `%${state.term}%` }, ...where };
  }
  if (label) {
    where = { labels: { _contains: label }, ...where };
  }
  if (!authorId && !state.term && !label) {
    State.update({ loading: false, searchResult: null });
    return;
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
    <div className="d-flex justify-content-between align-items-baseline gap-4">
      <div class="dropdown">
        {widget("entity.post.AuthorSearch", {
          author: state.author,
          onAuthorSearch: (author) => {
            State.update({ author });
            search({ author });
          },
        })}
      </div>
      <div>
        {widget("entity.post.TagSearch", {
          tag: state.tag,
          onTagSearch: (tag) => {
            State.update({ tag });
            search({ tag });
          },
        })}
      </div>
      <div className="d-flex flex-row position-relative w-25">
        <div className="position-absolute d-flex ps-3 flex-column h-100 justify-center">
          <i class="bi bi-search m-auto"></i>
        </div>

        <input
          type="search"
          className="ps-5 form-control border border-0 bg-light"
          value={state.term ?? ""}
          onChange={(e) => updateInput(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && search()}
          placeholder={props.placeholder ?? `Search by content`}
        />
      </div>
      {state.searchResult && !props.noReset ? (
        <button
          class="btn btn-light"
          onClick={() =>
            State.update({
              searchResult: null,
              author: null,
              tag: null,
              term: null,
            })
          }
        >
          Clear Search
        </button>
      ) : (
        ""
      )}
      <div className="d-flex flex-row-reverse">{props.children}</div>
    </div>
    {state.searchResult
      ? widget("entity.post.List", {
          loading: state.loading,
          searchResult: state.searchResult,
          recency: props.recency,
        })
      : widget("entity.post.List", {
          loading: state.loading,
          recency: props.recency,
          transactionHashes: props.transactionHashes,
        })}
  </>
);
