const { Feed } = VM.require("${REPL_DEVS}/widget/Feed");
Feed = Feed || (() => <></>);
const setPostExists = props.setPostExists ?? (() => {});
const showFlagAccountFeature = props.showFlagAccountFeature ?? false;

const filteredAccountIds = props.filteredAccountIds ?? [];

const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT ?? "https://near-queryapi.api.pagoda.co";

let lastPostSocialApi = Social.index("post", "main", {
  limit: 1,
  order: props.sort ? props.sort : "desc",
});

if (lastPostSocialApi == null) {
  return "Loading...";
}

State.init({
  // If QueryAPI Feed is lagging behind Social API, fallback to old widget.
  shouldFallback: false,
});

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

const lastPostQuery = `
query IndexerQuery {
  dataplatform_near_social_feed_posts( limit: 1, order_by: { block_height: desc }) {
      block_height
  }
}
`;

fetchGraphQL(lastPostQuery, "IndexerQuery", {})
  .then((feedIndexerResponse) => {
    if (
      feedIndexerResponse &&
      feedIndexerResponse.body.data.dataplatform_near_social_feed_posts.length >
        0
    ) {
      const nearSocialBlockHeight = lastPostSocialApi[0].blockHeight;
      const feedIndexerBlockHeight =
        feedIndexerResponse.body.data.dataplatform_near_social_feed_posts[0]
          .block_height;

      const lag = nearSocialBlockHeight - feedIndexerBlockHeight;
      let shouldFallback = lag > 2 || !feedIndexerBlockHeight;
      if (shouldFallback === true) {
        console.log(
          "Falling back to Social index feed. Block difference is: ",
          nearSocialBlockHeight - feedIndexerBlockHeight
        );
        State.update({ shouldFallback });
      }
    } else {
      console.log(
        "Falling back to Social index feed. No QueryApi data received."
      );
      State.update({ shouldFallback: true });
    }
  })
  .catch((error) => {
    console.log(
      "Error while fetching QueryApi feed (falling back to index feed): ",
      error
    );
    State.update({ shouldFallback: true });
  });

return (
  <div>
    {state.shouldFallback ? (
      <Feed
        index={[
          {
            action: props.action ? props.action : "post",
            key: "main",
            options: {
              limit: 10,
              subscribe: props.onNewUnseenPosts ? true : false,
              order: props.sort ? props.sort : "desc",
              accountId: filteredAccountIds,
            },
            cacheOptions: {
              ignoreCache: true,
            },
          },
        ]}
        Item={(item) => {
          setPostExists(true);

          return (
            <Widget
              src="${REPL_NEAR}/widget/v1.Posts.Post"
              loading={<div className="w-100" style={{ height: "200px" }} />}
              props={{
                accountId: item.accountId,
                blockHeight: item.blockHeight,
                filteredAccountIds: filteredAccountIds,
              }}
            />
          );
        }}
      />
    ) : (
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.organism.Feed.NearQueryApi`}
        props={{
          GRAPHQL_ENDPOINT,
          filteredAccountIds: filteredAccountIds,
          showFlagAccountFeature: showFlagAccountFeature,
          onNewUnseenPosts: props.onNewUnseenPosts,
          sort: props.sort,
        }}
      />
    )}
  </div>
);
