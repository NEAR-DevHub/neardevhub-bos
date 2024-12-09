const data = fetch(`https://httpbin.org/headers`);
const gatewayURL = data?.body?.headers?.Origin ?? "";

// we need fixed positioning for near social and not for org
const ParentContainer = gatewayURL.includes("near.org")
  ? styled.div`
      width: 100%;
      min-height: 90vh;
      background: #f4f4f4;
      padding-bottom: 1rem;
    `
  : styled.div`
      position: fixed;
      inset: 73px 0px 0px;
      width: 100%;
      overflow-y: scroll;
      min-height: 90vh;
      background: #f4f4f4;
    `;

const Theme = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: calc(-1 * var(--body-top-padding));
  background: #f4f4f4;
  .container-xl {
    padding-inline: 0px !important;
  }
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
    src={`${REPL_TREASURY_TEMPLAR}/widget/components.organism.Navbar`}
    props={{
      page: page,
      ...props,
    }}
  />
);

const AppLayout = ({ page, children }) => {
  return (
    <ParentContainer>
      <Theme>
        <Container className="container-xl p-3">
          <AppHeader page={page} />
          <ContentContainer className="content-container">
            {children}
          </ContentContainer>
        </Container>
      </Theme>
    </ParentContainer>
  );
};

return { AppLayout };
