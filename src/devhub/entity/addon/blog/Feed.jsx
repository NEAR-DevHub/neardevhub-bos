const { Item } = props;

Layout = Layout || (() => <></>);

const Container = styled.div``;

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Loader = styled.div`
  text-align: center;
  padding: 20px;
`;

const Notification = styled.p`
  text-align: center;
  color: #3252a6;
`;

const Heading = styled.h3`
  color: #151515;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 48px */
  margin-bottom: 2rem;

  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
`;

const QUERYAPI_ENDPOINT = `https://near-queryapi.api.pagoda.co/v1/graphql/`;
const DISPLAY_COUNT = 10;

const fetchGraphQL = (operationsDoc, operationName, variables) => {
  return asyncFetch(QUERYAPI_ENDPOINT, {
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

const [postIds, setPostIds] = useState([]);
const [loading, setLoading] = useState(false);
const [cachedItems, setCachedItems] = useState({});
const [hasNext, setHasNext] = useState(true);

const buildWhereClause = () => {
  let where = {};
  if (props.author) {
    where = { author_id: { _eq: props.author }, ...where };
  }
  if (props.term) {
    where = { description: { _ilike: `%${props.term}%` }, ...where };
  }
  if (props.includeLabels && Array.isArray(props.includeLabels)) {
    const labelConditions = props.includeLabels.map((label) => ({
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

const fetchPostIds = (offset) => {
  if (!offset) {
    offset = 0;
  }
  if (loading) return;
  setLoading(true);
  const variables = { limit: DISPLAY_COUNT, offset, where: buildWhereClause() };
  fetchGraphQL(query, "DevhubPostsQuery", variables).then((result) => {
    if (result.status === 200) {
      if (result.body.data) {
        const data = result.body.data[queryName];
        const newPostIds = data.map((p) => p.post_id);
        setPostIds(offset === 0 ? newPostIds : [...postIds, ...newPostIds]);
        setHasNext(data.length >= variables.limit);
      } else {
        console.error("GraphQL Error:", result.errors);
      }
      setLoading(false);
    }
  });
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
        <Heading>Latest Blog Posts</Heading>
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
