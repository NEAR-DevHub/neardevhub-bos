let theme = props.theme;
let variables = props.variables;

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
        src="${REPL_DEVHUB}/widget/devhub.entity.addon.blog.editor.provider"
        props={{
          handle: props.handle,
          Layout: (providerProps) => {
            const { data, onChange, onSubmit, onCancel, getData } =
              providerProps;
            return (
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.addon.blog.editor.layout"
                props={{
                  getData,
                  Sidebar: (p) => (
                    <Widget
                      src="${REPL_DEVHUB}/widget/devhub.entity.addon.blog.editor.sidebar"
                      props={{ items: data, ...p }}
                    />
                  ),
                  Content: (p) => (
                    <Widget
                      src="${REPL_DEVHUB}/widget/devhub.entity.addon.blog.editor.content"
                      props={{ onChange, onCancel, onSubmit, ...p }}
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
