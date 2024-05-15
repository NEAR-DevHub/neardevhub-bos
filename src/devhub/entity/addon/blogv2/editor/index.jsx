let theme = props.theme;
let variables = props.variables;
const parametersData = props.data;

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
          handle: props.handle,
          communityAddonId: props.communityAddonId,
          parametersData,
          Layout: (providerProps) => {
            const { onSubmit, onCancel, getData, onDelete } = providerProps;
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
                        parametersData,
                      }}
                    />
                  ),
                  Content: (p) => (
                    <Widget
                      src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.content"
                      props={{
                        onCancel,
                        onSubmit,
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
