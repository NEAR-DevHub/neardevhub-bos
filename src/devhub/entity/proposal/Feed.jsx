const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

const Container = styled.div`
  .full-width-div {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }

  .card.no-border {
    border-left: none !important;
    border-right: none !important;
    margin-bottom: -3.5rem;
  }

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
    border-left: none !important;
    border-right: none !important;
    border-bottom: none !important;
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

  a.no-space {
    display: inline-block;
  }

  .text-wrap {
    overflow: hidden;
    white-space: normal;
  }
`;

const Heading = styled.div`
  font-size: 24px;
  font-weight: 700;
  width: 100%;

  .text-normal {
    font-weight: normal !important;
  }

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const FeedItem = ({ proposal, index }) => {
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
      <div
        className={
          "proposal-card d-flex justify-content-between gap-2 text-muted cursor-pointer p-3 w-100 flex-wrap flex-sm-nowrap " +
          (index !== 0 && " border")
        }
      >
        <div className="d-flex gap-4 w-100">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
            props={{
              accountId,
            }}
          />
          <div className="d-flex flex-column gap-2 w-100 text-wrap">
            <div className="d-flex gap-2 align-items-center flex-wrap w-100">
              <div className="h6 mb-0 text-black">{proposal.name}</div>
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.CategoryTag"}
                props={{
                  category: proposal.category,
                }}
              />
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap flex-sm-nowrap text-sm w-100">
              <div>#{proposal.proposal_id} ･ </div>
              <div className="text-truncate">
                By {profile.name ?? accountId} ･{" "}
              </div>
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
        <div className="align-self-center" style={{ minWidth: "fit-content" }}>
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
    cachedItems: {},
    author: "",
    stage: "",
    sort: "",
    category: "",
    input: "",
    loading: false,
    loadingMore: false,
    aggregatedCount: null,
    currentlyDisplaying: 0,
  });

  const queryName =
    "polyprogrammist_near_devhub_prod_v1_proposals_with_latest_snapshot";
  const query = `query GetLatestSnapshot($offset: Int = 0, $limit: Int = 10, $where: ${queryName}_bool_exp = {}) {
    ${queryName}(
      offset: $offset
      limit: $limit
      order_by: {proposal_id: desc}
      where: $where
    ) {
      author_id
      block_height
      name
      category
      summary
      editor_id
      proposal_id
      ts
      timeline
      views
    }
    ${queryName}_aggregate(
      order_by: {proposal_id: desc}
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
      headers: { "x-hasura-role": `polyprogrammist_near` },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });
  }

  function separateNumberAndText(str) {
    const numberRegex = /\d+/;

    if (numberRegex.test(str)) {
      const number = str.match(numberRegex)[0];
      const text = str.replace(numberRegex, "").trim();
      return { number: parseInt(number), text };
    } else {
      return { number: null, text: str.trim() };
    }
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
        timeline: { _cast: { String: { _regex: `${state.stage}` } } },
        ...where,
      };
    }
    if (state.input) {
      const { number, text } = separateNumberAndText(state.input);
      if (number) {
        where = { proposal_id: { _eq: number }, ...where };
      }

      if (text) {
        where = {
          _or: [
            { name: { _iregex: `${text}` } },
            { summary: { _iregex: `${text}` } },
            { description: { _iregex: `${text}` } },
          ],
          ...where,
        };
      }
    }

    return where;
  };

  const buildOrderByClause = () => {
    /**
     * TODO
     * Most commented -> edit contract and indexer
     * Unanswered -> 0 comments
     */
  };

  const makeMoreItems = () => {
    if (state.aggregatedCount <= state.currentlyDisplaying) return;
    fetchProposals(state.data.length);
  };

  const fetchProposals = (offset) => {
    if (!offset) {
      offset = 0;
    }
    if (state.loading) return;
    const FETCH_LIMIT = 20;
    const variables = {
      limit: FETCH_LIMIT,
      offset,
      where: buildWhereClause(),
    };
    fetchGraphQL(query, "GetLatestSnapshot", variables).then(async (result) => {
      if (result.status === 200) {
        if (result.body.data) {
          const data =
            result.body.data
              .polyprogrammist_near_devhub_prod_v1_proposals_with_latest_snapshot;
          const totalResult =
            result.body.data
              .polyprogrammist_near_devhub_prod_v1_proposals_with_latest_snapshot_aggregate;
          State.update({ aggregatedCount: totalResult.aggregate.count });
          // Parse timeline
          fetchBlockHeights(data, offset);
        }
      }
    });
  };

  const renderItem = (item, index) => (
    <div
      key={item.proposal_id}
      className={
        (index !== state.data.length - 1 && "border-bottom ") + index === 0 &&
        " rounded-top-2"
      }
    >
      <FeedItem proposal={item} index={index} />
    </div>
  );
  const cachedRenderItem = (item, index) => {
    if (props.term) {
      return renderItem(item, {
        searchKeywords: [props.term],
      });
    }

    const key = JSON.stringify(item);

    if (!(key in state.cachedItems)) {
      state.cachedItems[key] = renderItem(item, index);
      State.update();
    }
    return state.cachedItems[key];
  };

  useEffect(() => {
    fetchProposals();
  }, [state.author, state.sort, state.category, state.stage]);

  const mergeItems = (newItems) => {
    const items = [
      ...new Set([...newItems, ...state.data].map((i) => JSON.stringify(i))),
    ].map((i) => JSON.parse(i));
    // Sorting in the front end
    if (state.sort === "proposal_id" || state.sort === "") {
      items.sort((a, b) => b.proposal_id - a.proposal_id);
    } else if (state.sort === "views") {
      items.sort((a, b) => b.views - a.views);
    }

    return items;
  };

  const fetchBlockHeights = (data, offset) => {
    let promises = data.map((item) => getProposal(item.proposal_id));
    Promise.all(promises).then((blockHeights) => {
      data = data.map((item, index) => ({
        ...item,
        timeline: JSON.parse(item.timeline),
        social_db_post_block_height:
          blockHeights[index].social_db_post_block_height,
      }));
      if (offset) {
        let newData = mergeItems(data);
        State.update({
          data: newData,
          currentlyDisplaying: newData.length,
          loading: false,
        });
      } else {
        State.update({
          data,
          currentlyDisplaying: data.length,
          loading: false,
        });
      }
    });
  };

  const loader = (
    <div className="d-flex justify-content-center align-items-center w-100">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner"}
      />
    </div>
  );

  const renderedItems = state.data ? state.data.map(cachedRenderItem) : null;

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProposals();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [state.input]);

  return (
    <Container className="w-100 py-4 px-2 d-flex flex-column gap-3">
      <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center">
        <Heading>
          DevDAO Proposals
          <span className="text-muted text-normal">
            ({state.aggregatedCount ?? state.data.length}){" "}
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
              },
              onEnter: () => {
                fetchProposals();
              },
            }}
          />
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-sort"}
            props={{
              onStateChange: (select) => {
                State.update({ sort: select.value });
              },
            }}
          />
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
          loader
        ) : (
          <div className="card no-border rounded-0 mt-4 py-3 full-width-div">
            <div className="container-xl">
              <div className="text-muted bg-grey text-sm mt-2 p-3 rounded-3">
                <p className="d-flex gap-3 align-items-center mb-0">
                  <div>
                    <i class="bi bi-info-circle"></i>
                  </div>
                  <div>
                    <span className="fw-bold">
                      Welcome to
                      <a
                        href="?page=community&handle=developer-dao&tab=overview"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        DevDAO’s New Proposal Feed!
                      </a>
                    </span>
                    This dedicated space replaces the
                    <a
                      href="?page=feed"
                      className="text-decoration-underline no-space"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      old activity feed
                    </a>
                    , making it easier to submit and track funding requests from
                    DevDAO, the primary organization behind DevHub. To submit a
                    formal proposal, click New Proposal. See our{" "}
                    <a
                      href="?page=community&handle=developer-dao&tab=funding"
                      className="text-decoration-underline no-space"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      guidelines
                    </a>
                    for details. For discussions and brainstorming, please
                    utilize the relevant{" "}
                    <a
                      href="?page=communities"
                      className="text-decoration-underline no-space"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      communities
                    </a>
                    .
                  </div>
                </p>
              </div>
              <div className="mt-4 border rounded-2">
                {state.aggregatedCount === 0 ? (
                  <div class="alert alert-danger m-2" role="alert">
                    No proposals found for selected filter.{" "}
                  </div>
                ) : state.aggregatedCount > 0 ? (
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={makeMoreItems}
                    hasMore={state.aggregatedCount > state.data.length}
                    loader={loader}
                    useWindow={false}
                    threshold={50}
                  >
                    {renderedItems}
                  </InfiniteScroll>
                ) : (
                  loader
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

return FeedPage(props);
