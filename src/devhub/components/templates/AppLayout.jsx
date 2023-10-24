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

function QuestionButton() {
  return (
    <div className="btn-group" role="group">
      <button
        type="button"
        className="btn btn-outline-light border-opacity-75 rounded-circle"
        style={{
          width: "30px",
          height: "30px",
          padding: "6px 0px",
          borderWidth: "2px",
          lineHeight: "0px",
        }}
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-question-lg"></i>
      </button>

      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <a
            target="_blank"
            className="dropdown-item"
            href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=bug&template=bug_report.md&title="
          >
            Report a bug
          </a>
        </li>

        <li>
          <a
            target="_blank"
            className="dropdown-item"
            href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=enhancement&template=feature-request.md&title="
          >
            Suggest an improvement
          </a>
        </li>
      </ul>
    </div>
  );
}

const AppHeader = ({ page }) => {
  return (
    <StyledHeader>
      <Link to={`/${REPL_DEVHUB}/widget/app`}>
        <Logo
          src="https://ipfs.near.social/ipfs/bafkreibjsn3gswlcc5mvgkfv7ady2lzkd2htm55l472suarbd34qryh2uy"
          alt="DevHub"
        />
      </Link>

      <HeaderActions>
        {page !== "communities" && (
          <Link to={`/${REPL_DEVHUB}/widget/app?page=communities`}>
            Communities
          </Link>
        )}

        <a
          href="https://www.neardevgov.org/blog/near-developer-dao"
          target="_blank"
        >
          Developer DAO
        </a>
        <QuestionButton />
      </HeaderActions>
    </StyledHeader>
  );
};
// const AppHeader = ({ page }) => (
//   <Widget
//     src="${REPL_DEVHUB}/widget/devhub.components.organism.Navbar"
//     props={{
//       page: page,
//       ...props,
//     }}
//   />
// );

function AppLayout({ page, children }) {
  return (
    <Container>
      <AppHeader page={page} />
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
}

return { AppLayout };
