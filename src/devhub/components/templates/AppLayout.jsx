const Theme = styled.div`
  position: fixed;
  inset: 73px 0px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding-top: calc(-1 * var(--body-top-padding));
  background: #f4f4f4;
`;

const Container = styled.div`
  width: 100%;
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

const Footer = (props) => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.organism.NewsLetter"
      props={{
        ...props,
      }}
    />
  );
};

function AppLayout({ page, children }) {
  return (
    <Theme>
      <Container className="container-xl">
        <AppHeader page={page} />
        <ContentContainer>{children}</ContentContainer>
        <Footer page={page} />
      </Container>
    </Theme>
  );
}

return { AppLayout };
