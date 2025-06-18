const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || {
  href: () => {},
};

const instance = props.instance ?? "";

const {
  contract,
  rfpFeedIndexerQueryName,
  proposalFeedAnnouncement,
  availableCategoryOptions,
  proposalFeedIndexerQueryName,
  cacheUrl,
  isDevhub,
  isInfra,
  isEvents,
} = VM.require(`${instance}/widget/config.data`);

const loader = (
  <div className="d-flex justify-content-center align-items-center w-100">
    <Widget src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner"} />
  </div>
);

if (!contract) {
  return loader;
}

function isNumber(v) {
  return typeof v === "number";
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

  @media screen and (max-width: 768px) {
    .theme-btn {
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

  .text-center {
    text-align: center;
  }

  .btn-grey-outline {
    background-color: #fafafa;
    border: 1px solid #e6e8eb;
    color: #11181c;

    &:hover {
      background-color: #e6e8eb;
    }

    &:active {
      border: 2px solid #e6e8eb;
    }
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
    path: `${contract}/post/main`,
    blockHeight: blockHeight,
  };

  const isLinked = isNumber(proposal.linked_rfp);
  const rfpData = proposal.rfpData;

  return (
    <a
      href={href({
        widgetSrc: `${instance}/widget/app`,
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
              {(isInfra || isEvents) && (
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.MultiSelectLabelsDropdown`}
                  props={{
                    selected: proposal.labels,
                    disabled: true,
                    hideDropdown: true,
                    onChange: () => {},
                    availableOptions: availableCategoryOptions,
                  }}
                />
              )}
              {isDevhub && (
                <Widget
                  src={
                    "${REPL_DEVHUB}/widget/devhub.entity.proposal.CategoryTag"
                  }
                  props={{
                    category: proposal.category,
                  }}
                />
              )}
            </div>
            {isLinked && rfpData && (
              <div
                className="text-sm text-muted d-flex gap-1 align-items-center"
                data-testid={
                  `proposalId_${proposal.proposal_id}` + `_rfpId_${rfpData.id}`
                }
              >
                <i class="bi bi-link-45deg"></i>
                In response to RFP :
                <a
                  className="text-decoration-underline flex-1"
                  href={href({
                    widgetSrc: `${instance}/widget/app`,
                    params: {
                      page: "rfp",
                      id: rfpData.rfp_id,
                    },
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {rfpData.name}
                </a>
              </div>
            )}
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
                  instance,
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
  return Near.asyncView(contract, "get_proposal", {
    proposal_id,
  });
};

const getRfp = (rfp_id) => {
  return Near.asyncView(contract, "get_rfp", {
    rfp_id,
  });
};

const FeedPage = () => {
  State.init({
    data: [],
    author: "",
    stage: "",
    sort: "id_desc",
    category: "",
    input: "",
    loading: false,
    searchLoader: false,
    makeMoreLoader: false,
    aggregatedCount: null,
    currentlyDisplaying: 0,
  });

  const makeMoreItems = () => {
    State.update({ makeMoreLoader: true });
    fetchProposals(state.data.length);
  };

  const statusOrder = {
    APPROVED: -1,
    REVIEW: 0,
    CANCELLED: 1,
    REJECTED: 1,
  };

  function searchCacheApi(searchTerm) {
    let searchInput = encodeURI(searchTerm);
    let searchUrl = `${cacheUrl}/proposals/search/${searchInput}`;

    return asyncFetch(searchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }).catch((error) => {
      console.log("Error searching cache api", error);
    });
  }

  function searchProposals(input) {
    if (state.loading) return;
    State.update({ loading: true });

    searchCacheApi(input).then((result) => {
      const body = result.body;
      const promises = body.records.map((proposal) => {
        if (isNumber(proposal.linked_rfp)) {
          return getRfp(proposal.linked_rfp).then((rfp) => {
            return { ...proposal, rfpData: rfp };
          });
        } else {
          return Promise.resolve(proposal);
        }
      });
      Promise.all(promises).then((proposalsWithRfpData) => {
        State.update({ aggregatedCount: body.total_records });
        fetchBlockHeights(proposalsWithRfpData, 0);
      });
    });
  }

  function fetchCacheApi(variables) {
    let fetchUrl = `${cacheUrl}/proposals?order=${variables.order}&limit=${variables.limit}&offset=${variables.offset}`;

    if (variables.author_id) {
      fetchUrl += `&filters.author_id=${variables.author_id}`;
    }
    if (variables.stage) {
      fetchUrl += `&filters.stage=${variables.stage}`;
    }
    if (variables.category) {
      if (isInfra || isEvents) {
        fetchUrl += `&filters.labels=${variables.category}`;
      } else {
        fetchUrl += `&filters.category=${variables.category}`;
      }
    }
    return asyncFetch(fetchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }).catch((error) => {
      console.log("Error fetching cache api", error);
    });
  }

  function fetchProposals(offset) {
    if (!offset) {
      offset = 0;
    }
    if (state.loading) return;
    State.update({ loading: true });
    const FETCH_LIMIT = 20;
    const variables = {
      order: state.sort,
      limit: FETCH_LIMIT,
      offset,
      category: state.category ? encodeURIComponent(state.category) : "",
      author_id: state.author ? encodeURIComponent(state.author) : "",
      stage: state.stage ? encodeURIComponent(state.stage) : "",
    };
    fetchCacheApi(variables).then((result) => {
      const body = result.body;
      const promises = body.records.map((proposal) => {
        if (isNumber(proposal.linked_rfp)) {
          return getRfp(proposal.linked_rfp).then((rfp) => {
            return { ...proposal, rfpData: rfp };
          });
        } else {
          return Promise.resolve(proposal);
        }
      });
      Promise.all(promises).then((proposalsWithRfpData) => {
        State.update({ aggregatedCount: body.total_records });
        fetchBlockHeights(proposalsWithRfpData, offset);
      });
    });
  }

  useEffect(() => {
    State.update({ searchLoader: true });
    fetchProposals();
  }, [state.author, state.sort, state.category, state.stage]);

  const mergeItems = (newItems) => {
    const items = [
      ...new Set([...newItems, ...state.data].map((i) => JSON.stringify(i))),
    ].map((i) => JSON.parse(i));
    // Sorting in the front end
    if (state.sort === "id_desc" || state.sort === "") {
      items.sort((a, b) => b.proposal_id - a.proposal_id);
    }

    // Show the accepted once before showing rejected proposals
    items.sort((a, b) => {
      return statusOrder[a.timeline.status] - statusOrder[b.timeline.status];
    });

    return items;
  };

  const fetchBlockHeights = (data, offset) => {
    data = data.map((item, index) => ({
      ...item,
      timeline: JSON.parse(item.timeline),
    }));
    if (offset) {
      let newData = mergeItems(data);
      State.update({
        data: newData,
        currentlyDisplaying: newData.length,
        loading: false,
        searchLoader: false,
        makeMoreLoader: false,
      });
    } else {
      let sorted = [...data].sort((a, b) => {
        return statusOrder[a.timeline.status] - statusOrder[b.timeline.status];
      });
      State.update({
        data: sorted,
        currentlyDisplaying: data.length,
        loading: false,
        searchLoader: false,
        makeMoreLoader: false,
      });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (state.input) {
        searchProposals(state.input);
      } else {
        fetchProposals();
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [state.input]);

  return (
    <Container className="w-100 py-4 px-2 d-flex flex-column gap-3">
      <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center">
        <Heading>
          Proposals
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
            {!isInfra && (
              <Widget
                src={
                  "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-category"
                }
                props={{
                  categoryOptions: availableCategoryOptions,
                  onStateChange: (select) => {
                    State.update({ category: select.value });
                  },
                }}
              />
            )}
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
                contract,
                onAuthorChange: (select) => {
                  State.update({ author: select.value });
                },
              }}
            />
          </div>
        </div>
        <div className="mt-2 mt-xs-0">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
            props={{
              label: (
                <div className="d-flex gap-2 align-items-center">
                  <div>
                    <i class="bi bi-plus-circle-fill"></i>
                  </div>
                  Submit Proposal
                </div>
              ),
              classNames: { root: "theme-btn" },
              disabled: true,
            }}
          />
        </div>
      </div>
      <div style={{ minHeight: "50vh" }}>
        {!Array.isArray(state.data) ? (
          loader
        ) : (
          <div className="card no-border rounded-0 mt-4 py-3 full-width-div">
            <div className="container-xl">
              {proposalFeedAnnouncement}
              <div className="mt-4 border rounded-2">
                {state.aggregatedCount === 0 ? (
                  <div class="alert alert-danger m-2" role="alert">
                    No proposals found for selected filter.{" "}
                  </div>
                ) : state.searchLoader ? (
                  loader
                ) : state.aggregatedCount > 0 ? (
                  state.data.map((item, index) => {
                    return (
                      <div
                        key={item.proposal_id}
                        className={
                          (index !== state.data.length - 1 &&
                            "border-bottom ") +
                            index ===
                            0 && " rounded-top-2"
                        }
                      >
                        <FeedItem proposal={item} index={index} />
                      </div>
                    );
                  })
                ) : (
                  loader
                )}
              </div>
              {state.aggregatedCount > 0 &&
                state.aggregatedCount > state.data.length && (
                  <div className="my-3 container-xl">
                    {state.makeMoreLoader ? (
                      loader
                    ) : (
                      <div>
                        {!state.loading && (
                          <div className="w-100">
                            <Widget
                              src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                              props={{
                                classNames: {
                                  root: "btn-grey-outline w-100 ",
                                  label: "text-center w-100",
                                },
                                label: "Load More",
                                onClick: () => makeMoreItems(),
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

return FeedPage(props);
