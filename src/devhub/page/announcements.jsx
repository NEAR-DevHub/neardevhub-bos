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

const SidebarContainer = styled.div`
  flex: 1;
`;

const Heading = styled.div`
  font-size: 28px;
  font-weight: 700;
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

const Tag = styled.div`
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  padding-inline: 0.8rem;
  padding-block: 0.3rem;
  display: flex;
  gap: 0.5rem;
  border-width: 1px;
  border-style: solid;
  font-size: 14px;
  color: rgba(0, 236, 151, 1);
  font-weight: 800;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 5px;
  background-color: rgb(244, 244, 244);
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 3px;
`;

const Tab = styled.div`
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: rgb(153, 153, 153);
  padding: 3px 10px;
  border-radius: 5px;
`;

const Line = styled.div`
  width: 100%;
  border-bottom: 1px solid rgb(223, 223, 223);
`;

const tabs = ["All", "Announcements", "Discussions"];
const [selectedTab, setSelectedTab] = useState("All");
const [sort, setSort] = useState("timedesc");

const followGraph = context.accountId
  ? Social.keys(`community.devhub.near/graph/follow/*`, "final")
  : null;
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

console.log({ followGraph, accountsFollowing });

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
                class="form-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
              >
                <option selected value="timedesc">
                  Latest
                </option>
                <option value="recentcommentdesc">Last Commented</option>
              </select>
            </div>
          </div>

          <div className={"card p-4"}>
            <Widget
              key="feed"
              src="${REPL_DEVHUB}/widget/devhub.components.feed.SubscribedFeed"
              props={{
                accounts: filteredAccountIds,
                sort: sort,
              }}
            />
          </div>
        </div>
      </MainContent>
    </Container>
  </div>
);
