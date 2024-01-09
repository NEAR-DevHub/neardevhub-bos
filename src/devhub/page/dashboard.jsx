const { tab, ...passProps } = props;

const tabKeys = {
  TRUSTEES: "trustees",
  MODERATORS: "moderators",
};

const [isTrustee, setIsTrustee] = useState(tab ? true : false);
const [selectedTab, setSelectedTab] = useState(tabKeys.TRUSTEES);

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

return (
  <Container className="pl-5">
    <div className="h2 bold">DevDAO Dashboard</div>
    <div className="mt-3">
      {!isTrustee ? (
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
                src={"${REPL_DEVHUB}/widget/devhub.entity.trustee.dashboard"}
                props={{ ...passProps, setIsTrustee, tab }}
              />
            ) : (
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.trustee.dashboard"}
                props={{ ...passProps, setIsTrustee, tab }}
              />
            )}
          </Tabs>
        </div>
      )}
    </div>
  </Container>
);
