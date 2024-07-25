const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const loadMorePosts = props.loadMorePosts;
const hasMore = props.hasMore || false;
const posts = props.posts || [];

const Post = styled.div`
  border-bottom: 1px solid #eceef0;
  padding: 24px 0 12px;
  @media (max-width: 1024px) {
    padding: 12px 0 0;
  }
`;

const TextLink = styled("Link")`
  font-weight: 600;
`;

const renderItem = (item) => {
  if (item.accounts_liked.length !== 0) {
    item.accounts_liked = JSON.parse(item.accounts_liked);
  }

  if (item.content.includes("repost")) {
    const repostData = JSON.parse(item.content);
    const fullPath = repostData[0].value.item.path.split("/");
    item.repostData = {
      reposted_by: item.account_id,
      reposted_content: JSON.parse(item.content),
      original_post_accountId: fullPath[0],
      original_post_blockHeight: repostData[0].value.item.blockHeight,
    };
  }
  return (
    <Post className="post" key={item.block_height + "_" + item.account_id}>
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.organism.Feed.Posts.Post`}
        props={{
          page: props.page,
          handle: props.handle,
          tab: props.tab,
          accountId: item.account_id,
          blockHeight: item.block_height,
          blockTimestamp: item.block_timestamp,
          content: item.content,
          comments: item.comments,
          likes: item.accounts_liked,
          GRAPHQL_ENDPOINT,
          verifications: item.verifications,
          showFlagAccountFeature: props.showFlagAccountFeature ?? false,
          profile: item.profile,
          isRespost: item.isRespost,
          repostData: item.repostData,
        }}
      />
    </Post>
  );
};

if (posts.length === 0 && !props.isLoading) {
  return (
    <div className="alert alert-info mx-3" role="alert">
      Build your feed by finding
      <TextLink className="alert-link" href="near/widget/PeoplePage">
        people to follow
      </TextLink>
    </div>
  );
}

const renderedItems = posts.map(renderItem);

return (
  <InfiniteScroll
    pageStart={0}
    loadMore={loadMorePosts}
    hasMore={hasMore}
    initialLoad={false}
    loader={
      <div className="loader">
        <span
          className="spinner-grow spinner-grow-sm me-1"
          role="status"
          aria-hidden="true"
        />
        Loading ...
      </div>
    }
  >
    {renderedItems}
  </InfiniteScroll>
);
