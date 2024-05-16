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
              onCancel,
              getData,
              onDelete,
            } = providerProps;
            return (
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.layout"
                props={{
                  getData,
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
                        onCancel,
                        onSubmit: onSubmitBlogData,
                        onDelete,
                        handle: props.handle,
                        allBlogs: providerProps.data,
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
