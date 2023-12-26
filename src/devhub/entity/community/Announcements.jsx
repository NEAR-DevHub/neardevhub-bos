const { handle } = props;
const { Feed } = VM.require("devs.near/widget/Module.Feed");
const { getCommunity, addCommunityAnnouncement } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

Feed = Feed || (() => <></>);
getCommunity = getCommunity || (() => <></>);
addCommunityAnnouncement = addCommunityAnnouncement || (() => <></>);

const communityData = getCommunity({ handle });

const MainContent = styled.div`
  padding-left: 2rem;
  flex: 3;
  @media screen and (max-width: 960px) {
    padding-left: 0rem;
  }
  .post:hover {
    background-color: inherit !important;
  }
`;

const SidebarContainer = styled.div`
  flex: 1;
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
  font-size: 13px;
  color: rgba(0, 236, 151, 1);
  font-weight: 700;
`;

return (
  <div className="w-100" style={{ maxWidth: "100%" }}>
    <Container className="d-flex gap-3 m-3 pl-2">
      <MainContent className="max-width-100">
        <div className="d-flex flex-column gap-4">
          {context.accountId &&
            (communityData?.admins ?? []).includes(context.accountId) && (
              <div className="card p-3">
                <Widget
                  src={"${REPL_DEVHUB}/widget/devhub.entity.community.Compose"}
                  props={{
                    optimisticUpdateFn: () => console.log("commit"),
                    clearOptimisticUpdateFn: () => console.log("clear"),
                    onSubmit: (v) =>
                      addCommunityAnnouncement({ handle, data: v }),
                  }}
                />
              </div>
            )}
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
                    accountId: [`${handle}.communities.devhub.near`],
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
            <p>{communityData?.description}</p>
            <p className="d-flex gap-2 flex-wrap">
              <Tag>{communityData?.tag} </Tag>
            </p>
          </div>
          <div className="card p-3 d-flex flex-column gap-2">
            <h6>Community Admins</h6>
            {(communityData?.admins ?? []).map((accountId) => (
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
            ))}
          </div>
        </div>
      </SidebarContainer>
    </Container>
  </div>
);
