let theme = props.theme;
let variables = props.variables;

const {
  communityAddonId,
  data,
  handle,
  onSubmit: onSubmitBlogSettings,
} = props;

if (!variables) {
  variables = ``;
}

if (!theme) {
  theme = ``;
}

const Root = styled.div`
  ${variables}
  ${theme}

  a {
    text-decoration: none;
    color: var(--base900);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

return (
  <Root>
    <Container>
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.provider"
        props={{
          handle,
          communityAddonId,
          Layout: (providerProps) => {
            const {
              onSubmit: onSubmitBlogData,
              getData,
              onDelete,
            } = providerProps;
            return (
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.layout"
                props={{
                  getData,
                  parametersData,
                  // On the blog page, when the user clicks on the edit button, the
                  // blog id is passed to the Configurator > layout > blogOverview
                  selectedBlog: props.selectedBlog,
                  BlogOverview: (p) => (
                    <Widget
                      src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.BlogOverview"
                      props={{
                        ...p,
                        ...providerProps,
                      }}
                    />
                  ),
                  BlogPostSettings: (p) => (
                    <Widget
                      src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.BlogPostSettings"
                      props={{
                        ...p,
                        ...providerProps,
                        data,
                        onSubmit: onSubmitBlogSettings,
                      }}
                    />
                  ),
                  Content: (p) => (
                    <Widget
                      src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.content"
                      props={{
                        onSubmit: onSubmitBlogData,
                        onDelete,
                        handle: props.handle,
                        allBlogs: providerProps.data,
                        communityAddonId: props.communityAddonId,
                        ...p,
                      }}
                    />
                  ),
                }}
              />
            );
          },
        }}
      />
    </Container>
  </Root>
);
