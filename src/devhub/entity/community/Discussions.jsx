const NEW_DISCUSSION_POSTED_CONTENT_STORAGE_KEY =
  "new_discussion_posted_content";
const { handle } = props;
const { getCommunity, setCommunitySocialDB } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

getCommunity = getCommunity || (() => <></>);
setCommunitySocialDB = setCommunitySocialDB || (() => <></>);

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
        block_height: blockHeight,
      },
      gas: Big(10).pow(14),
    },
  ]);
}

async function checkHashes() {
  if (props.transactionHashes) {
    asyncFetch("${REPL_RPC_URL}", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "tx",
        params: [props.transactionHashes, context.accountId],
      }),
    }).then((transaction) => {
      if (transaction !== null) {
        const transaction_method_name =
          transaction?.body?.result?.transaction?.actions[0].FunctionCall
            .method_name;

        if (transaction_method_name === "set") {
          getBlockHeightAndRepost();
        }

        // show the latest created post to user
        if (transaction_method_name === "create_discussion") {
          console.log("Discussions created in the last call, show it to user.");
        }
      }
    });
  }
}

function getBlockHeightAndRepost() {
  const newDiscussionPostedContent = Storage.get(
    NEW_DISCUSSION_POSTED_CONTENT_STORAGE_KEY
  );
  console.log("new discussion content", newDiscussionPostedContent);

  Near.asyncView("${REPL_SOCIAL_CONTRACT}", "get", {
    keys: [`${context.accountId}/post/**`],
    options: {
      with_block_height: true,
    },
  })
    .then((response) => {
      const post_main = response[context.accountId].post.main;
      const content = post_main[""];
      if (content === newDiscussionPostedContent) {
        const blockHeight = post_main[":block"];
        console.log("content matches", blockHeight, post_main);
        repostOnDiscussions(blockHeight);
      } else {
        console.log("content does not match (yet)", post_main);
        setTimeout(() => getBlockHeightAndRepost(), 500);
      }
    })
    .catch((error) => {
      console.log(
        "DevHub Error [Discussions]: getBlockHeightAndRepost failed",
        error
      );
    });
}

checkHashes();

return (
  <div className="w-100" style={{ maxWidth: "100%" }}>
    <Container className="d-flex gap-3 m-3 pl-2">
      <MainContent className="max-width-100">
        <div className="d-flex flex-column gap-4">
          {context.accountId && (
            <div className="card p-4">
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.community.Compose"}
                props={{
                  onSubmit: (v) => {
                    Storage.set(
                      NEW_DISCUSSION_POSTED_CONTENT_STORAGE_KEY,
                      v.post.main
                    );
                    Social.set(v, {
                      force: true,
                      onCommit: () => {
                        getBlockHeightAndRepost();
                      },
                    });
                  },
                  profileAccountId: context.accountId,
                }}
              />
            </div>
          )}
          <div className="d-flex flex-wrap justify-content-between">
            <Heading>Discussions</Heading>
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
            {/* TODO: the current feed is from https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/ProfileTabs 
                We will replace this with our custom feed as soon as it can support reposts */}
            <Widget
              key="feed"
              src="mob.near/widget/MainPage.N.Feed"
              props={{
                accounts: [
                  `discussions.${handle}.community.${REPL_DEVHUB_CONTRACT}`,
                ],
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
