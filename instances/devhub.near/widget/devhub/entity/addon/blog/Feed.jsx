const { Item, Layout } = props;

Layout = Layout || (() => <></>);

const Container = styled.div``;

const Loader = styled.div`
  text-align: center;
  padding: 20px;
`;

const [postIds, setPostIds] = useState([]);
const [loading, setLoading] = useState(false);
const [cachedItems, setCachedItems] = useState({});
const [hasNext, setHasNext] = useState(true);

const fetchPostIds = (offset) => {
  if (!offset) {
    offset = 0;
  }

  setLoading(false);
};

useEffect(() => {
  fetchPostIds();
}, [props.author, props.term, props.tag, props.recency]);

const handleLoadMore = () => {
  if (!hasNext) return;
  fetchPostIds(postIds.length);
};

const renderLoader = () => <Loader>Loading...</Loader>;

const renderItem = (postId) => (
  <div key={postId}>
    {(props.renderItem && props.renderItem(postId)) || <div>Post {postId}</div>}
  </div>
);

const cachedRenderItem = (postId) => {
  if (!(postId in cachedItems)) {
    cachedItems[postId] = renderItem(postId);
    setCachedItems({ ...cachedItems });
  }
  return cachedItems[postId];
};

return (
  <Container>
    {loading && renderLoader()}
    {postIds.length > 0 ? (
      <InfiniteScroll
        pageStart={0}
        dataLength={postIds.length}
        loadMore={handleLoadMore}
        hasMore={hasNext}
        loader={renderLoader()}
      >
        <Layout>
          {/* Layout */}
          {postIds.map(cachedRenderItem)}
        </Layout>
      </InfiniteScroll>
    ) : (
      <p class="text-secondary">No posts</p>
    )}
  </Container>
);
