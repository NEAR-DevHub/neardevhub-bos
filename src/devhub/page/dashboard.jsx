const { tab, accountType, ...passProps } = props;

const tabKeys = {
  TRUSTEES: "trustees",
  MODERATORS: "moderators",
};
const treasuryDaoID = "${REPL_TREASURY_CONTRACT}";
const councilInfo = Near.view(treasuryDaoID, "get_policy");
const [selectedTab, setSelectedTab] = useState(accountType ?? tabKeys.TRUSTEES);
const [isTrustee, setIsTrustee] = useState(false);
const [isModerator, setIsModerator] = useState(false);

if (councilInfo === null) {
  return <></>;
}

if (context.accountId) {
  councilInfo.roles.map((item) => {
    // trustees or moderators
    if (item.name === tabKeys.TRUSTEES) {
      setIsTrustee(item.kind.Group.includes(context.accountId));
    }
    if (item.name === tabKeys.MODERATORS) {
      setIsModerator(item.kind.Group.includes(context.accountId));
    }
  });
}

const Container = styled.div`
  width: 100%;
  padding-block: 1rem;
  padding-inline: 3rem;

  .bold {
    font-weight: 600;
  }
`;

const Tabs = styled.div`
  border-top: 0.5px solid #b3b3b3;
  .bg-grey {
    background-color: #ececec;
  }
  .cursor {
    cursor: pointer;
  }

  .flex-item {
    flex: 1;
    padding-block: 1rem;
    padding-inline: 0.5rem;
    font-weight: 600;
    font-size: 18;
  }
`;

const showLoginWindow =
  (selectedTab === tabKeys.TRUSTEES && !isTrustee) ||
  (selectedTab === tabKeys.MODERATORS && !isModerator);

return (
  <Container className="pl-5">
    <div className="h2 bold">DevDAO Dashboard</div>
    <div className="mt-3">
      {showLoginWindow ? (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.entity.trustee.login"}
          props={{ ...passProps, setIsTrustee }}
        />
      ) : (
        <div className="mt-2">
          <Tabs>
            <div className="d-flex w-100 cursor">
              <div
                className={
                  "flex-item " +
                  (selectedTab === tabKeys.TRUSTEES ? "" : "bg-grey")
                }
                onClick={() => setSelectedTab(tabKeys.TRUSTEES)}
              >
                Trustees
              </div>
              <div
                className={
                  "flex-item " +
                  (selectedTab === tabKeys.MODERATORS ? "" : "bg-grey")
                }
                onClick={() => setSelectedTab(tabKeys.MODERATORS)}
              >
                Moderators
              </div>
            </div>
            {selectedTab === tabKeys.TRUSTEES ? (
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.trustee.Dashboard"}
                props={{ ...passProps, setIsTrustee, tab }}
              />
            ) : (
              <div>Moderators Dashboard</div>
            )}
          </Tabs>
        </div>
      )}
    </div>
  </Container>
);
