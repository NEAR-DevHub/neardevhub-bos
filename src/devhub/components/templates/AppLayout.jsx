
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;

  background: #ebebeb;

  margin-top: calc(-1 * var(--body-top-padding));
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;


const AppHeader = ({ page }) => (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.components.organism.Navbar"
    props={{
      page: page,
      ...props,
    }}
  />
);

function AppLayout({ page, children }) {
  return (
    <Container>
      <AppHeader page={page} />
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
}

return { AppLayout };
