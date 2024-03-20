const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

const Container = styled.div`
  @media screen and (max-width: 768px) {
    font-size: 13px;
  }

  .text-sm {
    font-size: 13px;
  }

  .bg-grey {
    background-color: #f4f4f4;
  }

  .border-bottom {
    border-bottom: 1px solid grey;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .proposal-card {
    &:hover {
      background-color: #f4f4f4;
    }
  }

  .green-btn {
    background-color: #04a46e !important;
    border: none;
    color: white;

    &:active {
      color: white;
    }
  }

  @media screen and (max-width: 768px) {
    .green-btn {
      padding: 0.5rem 0.8rem !important;
      min-height: 32px;
    }
  }
`;

const Heading = styled.div`
  font-size: 24px;
  font-weight: 700;
  width: 100%;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const FeedItem = ({ proposal }) => {
  const accountId = proposal.author_id;
  const profile = Social.get(`${accountId}/profile/**`, "final");
  // We will have to get the proposal from the contract to get the block height.
  const blockHeight = parseInt(proposal.social_db_post_block_height);
  const item = {
    type: "social",
    path: `${REPL_DEVHUB_CONTRACT}/post/main`,
    blockHeight: blockHeight,
  };

  return (
    <a
      href={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: {
          page: "proposal",
          id: proposal.proposal_id,
        },
      })}
      onClick={(e) => e.stopPropagation()}
      style={{ textDecoration: "none" }}
    >
      <div className="proposal-card d-flex justify-content-between gap-2 text-muted cursor-pointer p-3">
        <div className="d-flex gap-4">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
            props={{
              accountId,
            }}
          />
          <div className="d-flex flex-column gap-2">
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <div className="h6 mb-0 text-black">{proposal.name}</div>
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.CategoryTag"}
                props={{
                  category: proposal.category,
                }}
              />
            </div>
            <div className="d-flex gap-2 align-items-center text-sm">
              <div>By {profile.name ?? accountId} ･ </div>
              <Widget
                src="${REPL_NEAR}/widget/TimeAgo"
                props={{
                  blockHeight,
                  blockTimestamp: proposal.timestamp,
                }}
              />
            </div>
            <div className="d-flex gap-2 align-items-center">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.proposal.LikeButton"
                props={{
                  item,
                  proposalId: proposal.id,
                  notifyAccountId: accountId,
                }}
              />

              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.CommentIcon"}
                props={{
                  item,
                  showOverlay: false,
                  onClick: () => {},
                }}
              />
            </div>
          </div>
        </div>
        <div className="align-self-center">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.StatusTag"}
            props={{
              timelineStatus: proposal.timeline.status,
            }}
          />
        </div>
      </div>
    </a>
  );
};

const getProposal = (proposal_id) => {
  return Near.asyncView("${REPL_DEVHUB_CONTRACT}", "get_proposal", {
    proposal_id,
  });
};

const FeedPage = () => {
  const QUERYAPI_ENDPOINT = `https://near-queryapi.api.pagoda.co/v1/graphql`;

  State.init({
    data: [],
    author: "",
    stage: "",
    sort: "",
    category: "",
    input: "",
    loading: false,
    aggregatedCount: 0,
  });

  const queryName =
    "thomasguntenaar_near_devhub_proposals_november_proposals_with_latest_snapshot";
  const query = `query GetLatestSnapshot($offset: Int = 0, $limit: Int = 10, $where: ${queryName}_bool_exp = {}) {
    ${queryName}(
      offset: $offset
      limit: $limit
      order_by: {proposal_id: asc}
      where: $where
    ) {
      author_id
      block_height
      name
      category
      summary
      editor_id
      name
      proposal_id
      ts
      timeline
    }
    ${queryName}_aggregate(
      offset: $offset
      limit: $limit
      order_by: {proposal_id: asc}
      where: $where
    )  {
      aggregate {
        count
      }
    }
  }`;
  function fetchGraphQL(operationsDoc, operationName, variables) {
    return asyncFetch(QUERYAPI_ENDPOINT, {
      method: "POST",
      headers: { "x-hasura-role": `thomasguntenaar_near` },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });
  }

  const buildWhereClause = () => {
    let where = {};
    if (state.author) {
      where = { author_id: { _eq: state.author }, ...where };
    }

    if (state.category) {
      where = { category: { _eq: state.category }, ...where };
    }

    if (state.stage) {
      // timeline is stored as jsonb
      where = {
        timeline: { _cast: { String: { _ilike: `%${state.stage}%` } } },
        ...where,
      };
    }

    if (state.input) {
      where = { description: { _ilike: `%${state.input}%` }, ...where };
    }

    return where;
  };

  const buildOrderByClause = () => {
    /**
     * Most recent -> Based on the biggest proposal_id
     * Most viewed -> views added in indexer version 'papa'
     * Most commented -> edit indexer
     * Unanswered -> 0 comments
     */
  };

  const fetchProposals = (offset) => {
    if (!offset) {
      offset = 0;
    }
    if (state.loading) return;
    State.update({ data });
    const DISPLAY_LIMIT = 10;
    const variables = {
      limit: DISPLAY_LIMIT,
      offset,
      where: buildWhereClause(),
    };
    fetchGraphQL(query, "GetLatestSnapshot", variables).then(async (result) => {
      if (result.status === 200) {
        if (result.body.data) {
          const data =
            result.body.data
              .thomasguntenaar_near_devhub_proposals_november_proposals_with_latest_snapshot;
          const totalResult =
            result.body.data
              .thomasguntenaar_near_devhub_proposals_november_proposals_with_latest_snapshot_aggregate;
          State.update({ aggregatedCount: totalResult.aggregate.count });
          // Parse timeline
          fetchBlockHeights(data);
        }
      }
    });
  };

  useEffect(() => {
    fetchProposals();
  }, [state.author, state.sort, state.category, state.stage]);

  const fetchBlockHeights = (data) => {
    let promises = data.map((item) => getProposal(item.proposal_id));
    Promise.all(promises).then((blockHeights) => {
      data = data.map((item, index) => ({
        ...item,
        timeline: JSON.parse(item.timeline),
        social_db_post_block_height:
          blockHeights[index].social_db_post_block_height,
      }));
      State.update({ data });
    });
  };

  return (
    <Container className="w-100 py-4 px-2 d-flex flex-column gap-3">
      <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center">
        <Heading>
          DevDAO Proposals
          <span className="text-muted">
            ({aggregatedCount ?? state.data.length})
          </span>
        </Heading>
        <div className="d-flex flex-wrap gap-4 align-items-center">
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-input"
            }
            props={{
              search: state.input,
              className: "w-xs-100",
              onSearch: (input) => {
                State.update({ input });
                fetchProposals();
              },
              onEnter: () => {
                fetchProposals();
              },
            }}
          />
          {/* TODO: */}
          {/* <Widget
            src={"${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-sort"}
            props={{
              onStateChange: (select) => {
                State.update({ sort: select.value });
              },
            }}
          /> */}
          <div className="d-flex gap-4 align-items-center">
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-category"
              }
              props={{
                onStateChange: (select) => {
                  State.update({ category: select.value });
                },
              }}
            />
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-stage"
              }
              props={{
                onStateChange: (select) => {
                  State.update({ stage: select.value });
                },
              }}
            />
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-author"
              }
              props={{
                onAuthorChange: (select) => {
                  State.update({ author: select.value });
                },
              }}
            />
          </div>
        </div>
        <div className="mt-2 mt-xs-0">
          <Link
            to={href({
              widgetSrc: "${REPL_DEVHUB}/widget/app",
              params: { page: "create-proposal" },
            })}
          >
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
              props={{
                label: (
                  <div className="d-flex gap-2 align-items-center">
                    <div>
                      <i class="bi bi-plus-circle-fill"></i>
                    </div>
                    New Proposal
                  </div>
                ),
                classNames: { root: "green-btn" },
              }}
            />
          </Link>
        </div>
      </div>
      <div style={{ minHeight: "50vh" }}>
        {!Array.isArray(state.data) ? (
          <div className="d-flex justify-content-center align-items-center w-100">
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner"}
            />
          </div>
        ) : (
          <div className="card rounded-0 p-1 mt-4">
            <div className="p-2 p-sm-4">
              <div className="text-muted bg-grey text-sm mt-2 p-3 rounded-3">
                <p className="d-flex gap-4 align-items-center mb-0">
                  <div>
                    <i class="bi bi-info-circle"></i>
                  </div>
                  DevDAO is the primary organization behind DevHub, and we offer
                  sponsorships to contributors and projects that align with our
                  goal of fostering a self-sufficient community of developers
                  for a thriving NEAR ecosystem. Check out our Funding
                  Guidelines for more details.
                </p>
              </div>
              <div className="mt-4 border rounded-2">
                {state.data.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        (index !== state.data.length - 1 && "border-bottom ") +
                        (index === 0 && " rounded-top-2")
                      }
                    >
                      <FeedItem proposal={item} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

return FeedPage(props);
