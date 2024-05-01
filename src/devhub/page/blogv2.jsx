const { id, community } = props;

const { Page } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Page") ||
  (() => <></>);

const [showEditScreenData, setShowEditScreen] = useState(null);

if (id && !showEditScreenData) {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Blog"
      props={{
        blogId: id,
        handle: community,
        template: (p) => (
          <Page
            {...(p || {})}
            onEdit={() => {
              setShowEditScreen({ ...p, data: { ...p.data, id: id } });
            }}
            accountId={context.accountId}
          />
        ),
      }}
    />
  );
}

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  padding: 1rem 3rem;
  align-items: center;
  flex-shrink: 0;
  background-color: #f4f4f4;

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.h1`
  color: #555555;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 28.8px */
  letter-spacing: -0.24px;
  margin: 0;
`;

const BlogContainer = styled.div`
  padding: 1rem 3rem;

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  padding-top: 40px;
  .cancel-icon {
    position: absolute;
    top: 0px;
    left: 30px;
    font-size: 25px;
    cursor: pointer;
    display: flex;
  }

  .back-button {
    font-size: 16px;
    line-height: 25px;
    margin-left: 10px;
  }
`;

// I like that this reduces duplicate code with the Viewer, but I don't like
// that "Latest Blog Posts" carries over... // TOOD: create a common blog
// feed... I think the addon.blog.Feed naming is confusing, as this should be a
// generic feed component.

if (showEditScreenData) {
  return (
    <EditorContainer>
      <div className="cancel-icon" onClick={() => setShowEditScreen(null)}>
        <i class="bi bi-arrow-return-left"></i>{" "}
        <p className="back-button">Back</p>
      </div>
      {/* Wrap the configurator in blog to pass the communityAddonId */}
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Blog"
        props={{
          blogId: id,
          handle: community,
          template: (p) => {
            return (
              <Widget
                src={`${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Configurator`}
                props={{
                  ...showEditScreenData,
                  handle: community,
                  communityAddonId: p.data.communityAddonId,
                }}
              />
            );
          },
        }}
      />
    </EditorContainer>
  );
}
return (
  <div className="w-100">
    <Widget src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`} />
    <HeaderContainer>
      <Header>Blog</Header>
    </HeaderContainer>
    <BlogContainer>
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Viewer"}
        props={{
          handle: community,
          hideTitle: true,
        }}
      />
    </BlogContainer>
  </div>
);