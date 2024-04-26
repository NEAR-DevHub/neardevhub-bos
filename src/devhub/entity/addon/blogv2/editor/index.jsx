let theme = props.theme;
let variables = props.variables;
const editData = props.data;

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

// What would be the first steps?
// Create this container and an empty provider
// Provider has some items, onChange, onSubmit console logs
// Create a layout that takes in Editor

return (
  <Root>
    {/* Get any layout */}
    <Container>
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.provider"
        props={{
          handle: props.handle,
          communityAddonId: props.communityAddonId,
          Layout: (providerProps) => {
            const { data, onChange, onSubmit, onCancel, getData, onDelete } =
              providerProps;
            return (
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.layout"
                props={{
                  getData,
                  editData: editData,
                  // TODO rename to blogoverview
                  Sidebar: (p) => (
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
                      }}
                    />
                  ),
                  // TODO rename blog input fields or blog form idk
                  Content: (p) => (
                    <Widget
                      src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.content"
                      props={{
                        onChange,
                        onCancel,
                        onSubmit,
                        onDelete,
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
