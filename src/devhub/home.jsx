const AppContainer = styled.div`
  width: 100%;
`;

const HomeSections = ["hero", "explore", "connect", "contribute", "support"];

const App = () => {
  return (
    <AppContainer>
      <Widget
        src="${REPL_DEVHUB}/widget/devhub-components.layout.navbar"
        props={{ ...props }}
      />
      {HomeSections.map((it) => (
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub-components.${it}`}
          props={{ ...props }}
        />
      ))}
    </AppContainer>
  );
};

return <App />;
