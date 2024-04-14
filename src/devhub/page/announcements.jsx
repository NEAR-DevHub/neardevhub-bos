const MainContent = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  flex: 3;
  @media screen and (max-width: 960px) {
    padding-left: 0rem;
    padding-right: 0rem;
  }
  .post:hover {
    background-color: inherit !important;
  }
`;

const Heading = styled.div`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const SubHeading = styled.div`
  font-size: 15px;
  font-weight: 600;
`;

const Container = styled.div`
  flex-wrap: no-wrap;
  max-width: 100%;

  background: #fff;

  .max-width-100 {
    max-width: 100%;
  }
  @media screen and (max-width: 960px) {
    flex-wrap: wrap;
  }

  .card {
    border-radius: 1rem !important;
  }

  .display-none {
    display: none;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 5px;
  background-color: rgb(244, 244, 244);
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 0 3px;
`;

const Tab = styled.div`
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: rgb(153, 153, 153);
  padding: 5px 10px;
  border-radius: 5px;
`;

const Line = styled.div`
  width: 100%;
  border-bottom: 1px solid rgb(223, 223, 223);
`;

const tabs = ["All", "Announcements", "Discussions"];
const [selectedTab, setSelectedTab] = useState("All");
const [sort, setSort] = useState("desc");

const followGraph = Social.keys(
  `community.devhub.near/graph/follow/*`,
  "final"
);
const accountsFollowing =
  props.accountsFollowing ??
  (followGraph
    ? Object.keys(followGraph["community.devhub.near"].graph.follow || {})
    : null);

const filteredAccountIds =
  accountsFollowing &&
  accountsFollowing.filter((account) => {
    if (selectedTab === "All") return true;
    if (selectedTab === "Announcements") {
      return !account.includes("discussions");
    }
    if (selectedTab === "Discussions") {
      return account.includes("discussions");
    }
  });

return (
  <div className="w-100" style={{ maxWidth: "100%" }}>
    <Heading>Activity Feed</Heading>
    <Line />
    <Container className="d-flex gap-3 px-2 py-4">
      <MainContent className="max-width-100">
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-wrap justify-content-between">
            <TabContainer>
              {tabs.map((tab) => (
                <Tab
                  className={selectedTab === tab ? "text-black bg-white" : ""}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </Tab>
              ))}
            </TabContainer>
            <div className={"d-flex align-items-center gap-2"}>
              <select
                name="sort"
                id="sort"
                class="form-select border-0"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
              >
                <option selected value="desc">
                  Latest
                </option>
                <option value="recentcommentdesc">Last Commented</option>
              </select>
            </div>
          </div>

          <div
            className={"card p-4 "}
            style={{ overflow: "auto", height: "60vh" }}
          >
            <Widget
              key="feed"
              src="${REPL_DEVHUB}/widget/devhub.components.feed.SubscribedFeed"
              props={{
                sort: sort,
                accounts: filteredAccountIds,
                threshold: 250,
              }}
            />
          </div>
        </div>
      </MainContent>
    </Container>
  </div>
);
