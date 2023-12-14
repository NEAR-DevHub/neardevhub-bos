const { handle } = props;
const { Feed } = VM.require("devs.near/widget/Module.Feed");
const { getCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);
Feed = Feed || (() => <></>);
getCommunity = getCommunity || (() => <></>);

const communityData = getCommunity({ handle });

const MainContent = styled.div`
  padding-left: 2rem;
  @media screen and (max-width: 960px) {
    padding-left: 0rem;
  }
`;

const SidebarContainer = styled.div`
  min-width: 25%;
`;

const Container = styled.div`
  flex-wrap: no-wrap;
  max-width: 100%;

  .max-width-100 {
    max-width: 100%;
  }
  @media screen and (max-width: 960px) {
    flex-wrap: wrap;
  }
`;

const Tags = styled.div`
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
  font-size: 13px;
  color: rgba(0, 236, 151, 1);
  font-weight: 700;
`;

return (
  <div className="w-100" style={{ maxWidth: "100%" }}>
    <Container className="d-flex gap-2 m-3 pl-2">
      <MainContent className="max-width-100">
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-wrap justify-content-between">
            <h5>Announcements</h5>
            <div className="d-flex align-items-center gap-2">
              <select
                name="sort"
                id="sort"
                class="form-select"
                onChange={(e) => setSort(e.target.value)}
              >
                <option selected value="">
                  Latest
                </option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>
          <div className="card p-3">
            <Feed
              index={[
                {
                  action: "post",
                  key: "main",
                  options: {
                    limit: 10,
                    order: "desc",
                    accountId: communityData.accountId,
                  },
                  cacheOptions: {
                    ignoreCache: true,
                  },
                },
                {
                  action: "repost",
                  key: "main",
                  options: {
                    limit: 10,
                    order: "desc",
                    accountId: communityData.accountId,
                  },
                  cacheOptions: {
                    ignoreCache: true,
                  },
                },
              ]}
              Item={(p) => (
                <Widget
                  loading={
                    <div className="w-100" style={{ height: "200px" }} />
                  }
                  src="mob.near/widget/MainPage.N.Post"
                  props={{
                    accountId: p.accountId,
                    blockHeight: p.blockHeight,
                  }}
                />
              )}
            />
          </div>
        </div>
      </MainContent>
      <SidebarContainer>
        <div className="d-flex flex-column gap-3">
          <div className="card p-3">
            <p>
              On a mission to support DevHub initiatives and grow the NEAR
              developer ecosystem
            </p>
            <p className="d-flex gap-2 flex-wrap">
              <Tags>devhub-marketing</Tags>
              <Tags>tag-2</Tags>
            </p>
          </div>
          <div>
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.community.Tile"}
              props={{
                heading: <h5>Community Admins</h5>,
                children: (communityData?.admins ?? []).map((accountId) => (
                  <div
                    key={accountId}
                    className="d-flex"
                    style={{ fontWeight: 500 }}
                  >
                    <Widget
                      src="${REPL_DEVHUB}/widget/devhub.components.molecule.ProfileCard"
                      props={{ accountId }}
                    />
                  </div>
                )),
                minHeight: 0,
                noBorder: true,
              }}
            />
          </div>
        </div>
      </SidebarContainer>
    </Container>
  </div>
);
