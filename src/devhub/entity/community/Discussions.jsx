const { handle } = props;
const { getCommunity, setCommunitySocialDB } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

getCommunity = getCommunity || (() => <></>);
setCommunitySocialDB = setCommunitySocialDB || (() => <></>);

const communityData = getCommunity({ handle });
const [postsExists, setPostExists] = useState(false);

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

const Heading = styled.div`
  font-size: 19px;
  font-weight: 600;
`;

const SubHeading = styled.div`
  font-size: 15px;
  font-weight: 600;
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

const [sort, setSort] = useState("timedesc");

function repostOnDiscussions(blockHeight) {
  Near.call([
    {
      contractName: "${REPL_DEVHUB_CONTRACT}",
      methodName: "create_discussion",
      args: {
        handle,
        blockHeight,
      },
      gas: Big(10).pow(14),
      deposit: Big(10).pow(22),
    },
  ]);
}

/**
 * I'm posting this message in the discussions of community devhub-test.
 * Which posts this to my profile @thomasguntenaar.near and reposts it
 * to discusssions.devhub-test.community.devhub.near by getting the latest
 * blockheight from my profile and reposting that message.
 */

function setSocialDbAndRepost(v) {
  // Post to users social db
  Social.set(v, {
    onCommit: (data) => {
      console.log("onCommit data", data);
      Near.asyncView("${REPL_SOCIAL_CONTRACT}", "get", {
        keys: [`${context.accountId}/**`],
        options: {
          with_block_height: true,
        },
      })
        .then((response) => {
          let blockHeight = response[context.accountId]["post"][":block"];
          repostOnDiscussions(blockHeight);
        })
        .catch(console.log);
    },
  });
}
console.log(`discussions.${handle}.community.${REPL_DEVHUB_CONTRACT}`);

return (
  <div className="w-100" style={{ maxWidth: "100%" }}>
    <Container className="d-flex gap-3 m-3 pl-2">
      <MainContent className="max-width-100">
        <div className="d-flex flex-column gap-4">
          {context.accountId && (
            <div className="card p-4">
              {/* TODO: compose is only used for post not repost */}
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.community.Compose"}
                props={{
                  onSubmit: (v) => setSocialDbAndRepost(v),
                  communityAccountId: `discussions.${handle}.community.${REPL_DEVHUB_CONTRACT}`,
                }}
              />
            </div>
          )}
          <div className="d-flex flex-wrap justify-content-between">
            <Heading>Discussions</Heading>
            <div
              className={
                postsExists
                  ? "d-flex align-items-center gap-2"
                  : " display-none"
              }
            >
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
          {!postsExists && (
            <div>
              <h6>No discussions exists.</h6>
            </div>
          )}
          <div className={postsExists && "card p-4"}>
            {/* TODO: this feed is from https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/ProfileTabs */}
            <Widget
              key="feed"
              src="mob.near/widget/MainPage.N.Feed"
              props={{
                accounts: [
                  `discussions.${handle}.community.${REPL_DEVHUB_CONTRACT}`,
                ],
              }}
            />
            {/* This is our custom feed which uses the one from near builders which should also show reposts! */}
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.organism.Feed"
              props={{
                showFlagAccountFeature: true,
                action: "repost",
                filteredAccountIds: [
                  `discussions.${handle}.community.${REPL_DEVHUB_CONTRACT}`,
                ],
                sort: sort,
                setPostExists: setPostExists,
                showFlagAccountFeature: true,
              }}
            />
          </div>
        </div>
      </MainContent>
      <SidebarContainer>
        <div className="d-flex flex-column gap-3">
          <div className="card p-4">
            <div className="mb-2">{communityData?.description}</div>
            <div className="d-flex gap-2 flex-wrap">
              <Tag>{communityData?.tag} </Tag>
            </div>
          </div>
          <div className="card p-4 d-flex flex-column gap-2">
            <SubHeading>Community Admins</SubHeading>
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
