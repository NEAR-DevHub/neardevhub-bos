const StyledHeader = styled.div`
  height: 62px;
  background: #181818;
  margin-top: -25px; // There is a gap on both near.social and near.org
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  height: 30px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;
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
  console.log("page", page);
  return (
    <Container>
      <AppHeader page={page} />
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
}

return { AppLayout };
