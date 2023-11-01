const { Page } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Page") ||
  (() => <></>);

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ButtonRow = styled.div`
  display: flex;
`;

function normalizeString(str) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

const [selectedItem, setSelectedItem] = useState("");

const handleItemClick = (item) => {
  console.log("item", item);
  setSelectedItem(item);
};

const Container = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const StyledItem = styled.div`
  display: flex;
  border-radius: 8px;
  background-color: var(--base100);
  padding: 10px;
  width: 100%;
  margin: 5px 0;
  cursor: pointer;
  border: 2px solid #6c5f5b;

  &:hover {
    background-color: var(--paper);
  }
`;

const ImageWrapper = styled.div`
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Name = styled.div`
  flex: 1;
  align-self: center;
`;

const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Card") ||
  (() => <></>);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const { includeLabels, excludeLabels, layout } = props;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 769px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

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

includeLabels = ["devhub-test"];

const buildWhereClause = () => {
  let where = {};
  if (props.author) {
    where = { author_id: { _eq: props.author }, ...where };
  }
  if (props.term) {
    where = { description: { _ilike: `%${props.term}%` }, ...where };
  }
  if (props.includeLabels && Array.isArray(props.includeLabels)) {
    where = { labels: { _containsAny: props.includeLabels }, ...where };
  }
  if (props.excludeLabels && Array.isArray(props.excludeLabels)) {
    where = { labels: { _nin: props.excludeLabels }, ...where };
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

function Sidebar({ items, handleItemClick }) {
  return (
    <Container>
      {items.map((item, index) => (
        <StyledItem key={index} onClick={() => handleItemClick(item.post_id)}>
          <Name>{item.post_id}</Name>
        </StyledItem>
      ))}
    </Container>
  );
}

return (
  <InnerContainer>
    <div
      className="template"
      style={{ display: "flex", width: "100%", height: "100%" }}
    >
      <div
        className="left-panel"
        style={{
          flex: 1,
          maxWidth: "100px",
          width: "100%",
          margin: "20px 20px 80px 20px",
        }}
      >
        <Sidebar
          items={
            posts.body.data.bo_near_devhub_v17_posts_with_latest_snapshot || []
          }
          handleItemClick={handleItemClick}
        />
      </div>
      <div
        className="right-panel"
        style={{ flex: 1, width: 0, overflow: "scroll" }}
      >
        <Widget // We need this so the individual posts can make the necessary call for more data
          src="${REPL_DEVHUB}/widget/devhub.entity.post.Postv2"
          props={{
            postKey: selectedItem,
            template: (p) => <Page {...(p || {})} />,
          }} // I wonder if this could take list of types, their templates, normalizer functions, etc... and have this all as a module
        />
      </div>
    </div>
  </InnerContainer>
);
