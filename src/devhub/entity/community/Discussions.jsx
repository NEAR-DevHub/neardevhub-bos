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

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}
let lastPostSocialApi = Social.index("post", "main", {
  limit: 1,
  order: "desc",
});

if (lastPostSocialApi == null) {
  return "Loading...";
}

// console.log("context", context.accountId);
// let test = Social.get(`${context.accountId}/post/main`, {
//   options: { with_block_height: true },
// });
// console.log("test", test);

function repostOnDiscussions(blockHeight) {
  Near.call([
    {
      contractName: "${REPL_DEVHUB_CONTRACT}",
      methodName: "create_discussion",
      args: {
        handle,
        data: {
          [`discussions.${handle}.community.${REPL_DEVHUB_CONTRACT}`]: {
            index: {
              repost: JSON.stringify([
                {
                  key: "main",
                  value: {
                    type: "repost",
                    item: {
                      type: "social",
                      path: context.accountId + "/post/main",
                      blockHeight,
                    },
                  },
                },
              ]),
            },
          },
        },
      },
      gas: Big(10).pow(14),
    },
  ]);
}

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
                    // Post to users social db
                    const result = Social.set(
                      `${context.accountId}/post/main`,
                      v,
                      {
                        onCommit: (data) => {
                          // TODO remove
                          console.log("onCommit");
                          console.log("data", data);
                          // TODO get the block height in another way
                          const lastPostQuery = `
                            query IndexerQuery {
                              dataplatform_near_social_feed_posts( limit: 1, order_by: { block_height: desc }) {
                                  block_height
                              }
                            }
                            `;

                          fetchGraphQL(lastPostQuery, "IndexerQuery", {})
                            .then((feedIndexerResponse) => {
                              // TODO remove
                              console.log(
                                "feedIndexerResponse",
                                feedIndexerResponse
                              );
                              if (
                                feedIndexerResponse &&
                                feedIndexerResponse.body.data
                                  .dataplatform_near_social_feed_posts.length >
                                  0
                              ) {
                                const nearSocialBlockHeight =
                                  lastPostSocialApi[0].blockHeight;
                                const feedIndexerBlockHeight =
                                  feedIndexerResponse.body.data
                                    .dataplatform_near_social_feed_posts[0]
                                    .block_height;
                                // TODO necessary?
                                const lag =
                                  nearSocialBlockHeight -
                                  feedIndexerBlockHeight;
                                let shouldFallback =
                                  lag > 2 || !feedIndexerBlockHeight;
                                if (shouldFallback === true) {
                                  console.log(
                                    "Falling back to Social index feed. Block difference is: ",
                                    nearSocialBlockHeight -
                                      feedIndexerBlockHeight
                                  );
                                }

                                repostOnDiscussions(nearSocialBlockHeight);
                              } else {
                                console.log(
                                  "Falling back to Social index feed. No QueryApi data received."
                                );
                              }
                            })
                            .catch((error) => {
                              console.log(
                                "Error while fetching QueryApi feed (falling back to index feed): ",
                                error
                              );
                            });
                        },
                      }
                    );
                    console.log("result", result);
                  },
                }}
              />
            </div>
          )}
          <div className="d-flex flex-wrap justify-content-between">
            <Heading>Announcements</Heading>
            <div className="d-flex align-items-center gap-2">
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

          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.organism.Feed"
            props={{
              showFlagAccountFeature: true,
              action: "repost",
              filteredAccountIds: [
                `discussions.${handle}.community.${REPL_DEVHUB_CONTRACT}`,
                // "thomasguntenaar.near", // TODO: get index/repost
              ],
              sort: sort,
            }}
          />
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
