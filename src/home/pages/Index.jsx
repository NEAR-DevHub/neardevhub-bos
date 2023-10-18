const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

const App = () => {
  return (
    <AppContainer>
      <Widget src="devhub.testnet/widget/home.components.Navbar" />
      <Widget src="devhub.testnet/widget/home.components.Hero" />
    </AppContainer>
  );
};

return <App />;
