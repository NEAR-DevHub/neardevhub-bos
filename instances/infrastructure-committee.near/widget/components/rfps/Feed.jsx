const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);
href || (href = () => {});

const { readableDate } = VM.require(
  `${REPL_DEVHUB}/widget/core.lib.common`
) || { readableDate: () => {} };

const { getGlobalLabels } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };

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

  .bg-blue {
    background-image: linear-gradient(to bottom, #4b7a93, #213236);
    color: white;
  }

  .border-bottom {
    border-bottom: 1px solid grey;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .rfp-card {
    border-left: none !important;
    border-right: none !important;
    border-bottom: none !important;
    &:hover {
      background-color: #f4f4f4;
    }
  }

  .blue-btn {
    background-color: #3c697d !important;
    border: none;
    color: white;

    &:active {
      color: white;
    }
  }

  .bg-grey {
    background: #e2e6ec;
  }

  @media screen and (max-width: 768px) {
    .blue-btn {
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
  .fw-semi-bold {
    font-weight: 500;
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

const rfpLabelOptions = getGlobalLabels();

const FeedItem = ({ rfp, index }) => {
  // We will have to get the rfp from the contract to get the block height.
  const blockHeight = parseInt(rfp.social_db_post_block_height);
  const item = {
    type: "social",
    path: `${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}/post/main`,
    blockHeight: blockHeight,
  };

  return (
    <a
      href={href({
        widgetSrc: `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/app`,
        params: {
          page: "rfp",
          id: rfp.rfp_id,
        },
      })}
      onClick={(e) => e.stopPropagation()}
      style={{ textDecoration: "none" }}
    >
      <div
        className={
          "rfp-card d-flex justify-content-between gap-2 text-muted cursor-pointer p-3 w-100 flex-wrap flex-sm-nowrap " +
          (index !== 0 && " border")
        }
      >
        <div className="d-flex gap-4 w-100">
          <img src={"${REPL_RFP_IMAGE}"} height={35} width={35} />
          <div className="d-flex flex-column gap-2 w-100 text-wrap">
            <div className="d-flex gap-2 align-items-center flex-wrap w-100">
              <div className="h6 mb-0 text-black">{rfp.name}</div>
              <Widget
                src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.MultiSelectCategoryDropdown`}
                props={{
                  selected: rfp.labels,
                  disabled: true,
                  hideDropdown: true,
                  onChange: () => {},
                  availableOptions: rfpLabelOptions,
                }}
              />
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap flex-sm-nowrap text-sm w-100">
              <div>#{rfp.rfp_id} ･ Created</div>
              <Widget
                src={`${REPL_NEAR}/widget/TimeAgo`}
                props={{
                  blockHeight,
                  blockTimestamp: rfp.timestamp,
                }}
              />
            </div>
            <div className="d-flex gap-4 flex-wrap flex-sm-nowrap text-sm w-100 text-muted my-2">
              <div
                className="d-flex flex-column gap-1"
                style={{ maxWidth: "70%" }}
              >
                <div className="fw-semi-bold">Summary</div>

                <div>{rfp.summary}</div>
              </div>
              <div style={{ width: "1px" }} className="bg-grey"></div>
              <div className="d-flex flex-column gap-1">
                <div className="fw-semi-bold">Submission Deadline</div>
                <h6 className="mb-0 text-black">
                  {readableDate(rfp.submission_deadline / 1000000)}
                </h6>
              </div>
            </div>
            <div className="d-flex gap-2 align-items-center text-sm">
              <div>
                <img
                  src="https://ipfs.near.social/ipfs/bafkreif4p376f3qvpb2ewwsmi6fkcm3jalhuuzuxbgvehgl552agqw47ju"
                  height={30}
                  width={30}
                />
                {rfp.linked_proposals.length ?? 0}
                proposals
              </div>
              <div className="d-flex align-items-center">
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.CommentIcon`}
                  props={{
                    item,
                    showOverlay: false,
                    onClick: () => {},
                  }}
                />
                comments
              </div>
            </div>
          </div>
        </div>
        <div className="align-self-center" style={{ minWidth: "fit-content" }}>
          <Widget
            src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.StatusTag`}
            props={{
              timelineStatus: rfp.timeline.status,
            }}
          />
        </div>
      </div>
    </a>
  );
};

const getRfp = (rfp_id) => {
  return Near.asyncView(
    "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
    "get_rfp",
    {
      rfp_id,
    }
  );
};

const FeedPage = () => {
  State.init({
    data: [],
    cachedItems: {},
    stage: "",
    sort: "id_desc",
    label: "",
    input: "",
    loading: false,
    loadingMore: false,
    aggregatedCount: null,
    currentlyDisplaying: 0,
    isFiltered: false,
  });

  function searchCacheApi() {
    return asyncFetch(
      `${REPL_CACHE_URL}/rfps/search/${encodeURI(state.input)}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    ).catch((error) => {
      console.log("Error searching cache api", error);
    });
  }

  function searchRfps() {
    if (state.loading) return;
    State.update({ loading: true });

    searchCacheApi().then((result) => {
      let body = result.body;
      State.update({ aggregatedCount: body.total_records });
      fetchBlockHeights(body.records, 0);
    });
  }

  function fetchCacheApi(variables) {
    let fetchUrl = `${REPL_CACHE_URL}/rfps?order=${variables.order}&limit=${variables.limit}&offset=${variables.offset}`;

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

    State.update({ isFiltered: variables.category || variables.stage });

    return asyncFetch(fetchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }).catch((error) => {
      console.log("Error fetching cache api", error);
    });
  }

  const makeMoreItems = () => {
    if (state.aggregatedCount <= state.currentlyDisplaying) return;
    fetchRfps(state.data.length);
  };

  const fetchRfps = (offset) => {
    if (!offset) {
      offset = 0;
    }
    if (state.loading) return;
    State.update({ loading: true });

    const FETCH_LIMIT = 10;
    const variables = {
      order: state.sort,
      limit: FETCH_LIMIT,
      offset,
      category: state.category ? encodeURIComponent(state.category) : "",
      stage: state.stage ? encodeURIComponent(state.stage) : "",
    };

    fetchCacheApi(variables).then((result) => {
      const body = result.body;
      State.update({ aggregatedCount: body.total_records });
      fetchBlockHeights(body.records, offset);
    });
  };

  const renderItem = (item, index) => (
    <div
      key={item.rfp_id}
      className={
        (index !== state.data.length - 1 && "border-bottom ") + index === 0 &&
        " rounded-top-2 rfp-item-container"
      }
    >
      <FeedItem rfp={item} index={index} />
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
    fetchRfps();
  }, [state.sort, state.label, state.stage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (state.input) {
        searchRfps();
      } else {
        fetchRfps();
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [state.input]);

  const mergeItems = (newItems) => {
    const items = [
      ...new Set([...newItems, ...state.data].map((i) => JSON.stringify(i))),
    ].map((i) => JSON.parse(i));
    // Sorting in the front end
    if (state.sort === "rfp_id" || state.sort === "") {
      items.sort((a, b) => b.rfp_id - a.rfp_id);
    } else if (state.sort === "views") {
      items.sort((a, b) => b.views - a.views);
    }

    return items;
  };

  const fetchBlockHeights = (data, offset) => {
    let promises = data.map((item) => getRfp(item.rfp_id));
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
        src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner`}
      />
    </div>
  );

  const renderedItems = state.data ? state.data.map(cachedRenderItem) : null;

  const isAllowedToWriteRfp = Near.view(
    "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
    "is_allowed_to_write_rfps",
    {
      editor: context.accountId,
    }
  );

  const BannerWrapper = styled.div`
    background-image: linear-gradient(rgb(251 32 32), rgb(187 6 6));
    color: white;
    .text-sm {
      font-size: 13px;
    }
  `;

  return (
    <Container className="w-100 py-4 px-2 d-flex flex-column gap-3">
      <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center">
        <Heading>
          RFPs
          <span className="text-muted text-normal">
            ({state.aggregatedCount ?? state.data.length}){" "}
          </span>
        </Heading>
        <div className="d-flex flex-wrap gap-4 align-items-center">
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-input`}
            props={{
              search: state.input,
              className: "w-xs-100",
              onSearch: (input) => {
                State.update({ input });
                fetchRfps();
              },
              onEnter: () => {
                fetchRfps();
              },
            }}
          />
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-sort`}
            props={{
              onStateChange: (select) => {
                State.update({ sort: select.value });
              },
            }}
          />
          <Widget
            src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.FilterByLabel`}
            props={{
              onStateChange: (select) => {
                State.update({ label: select.value });
              },
              availableOptions: rfpLabelOptions,
            }}
          />
          <div className="d-flex gap-4 align-items-center">
            <Widget
              src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.StageDropdown`}
              props={{
                onStateChange: (select) => {
                  State.update({ stage: select.value });
                },
              }}
            />
          </div>
        </div>
        {isAllowedToWriteRfp && (
          <div className="mt-2 mt-xs-0">
            <Widget
              src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
              props={{
                label: (
                  <div className="d-flex gap-2 align-items-center">
                    <div>
                      <i className="bi bi-plus-circle-fill"></i>
                    </div>
                    Create RFP
                  </div>
                ),
                classNames: { root: "blue-btn" },
                disabled: true,
              }}
            />
          </div>
        )}
      </div>
      <div style={{ minHeight: "50vh" }}>
        {!Array.isArray(state.data) ? (
          loader
        ) : (
          <div className="card no-border rounded-0 mt-4 py-3 full-width-div">
            <div className="container-xl">
              <BannerWrapper className="d-flex gap-3 align-items-center mb-4 p-3 rounded-3">
                <div>
                  <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
                <div>
                  <div className="fw-bold">This page is now archived! </div>
                  <div className="text-sm">
                    To submit proposals, visit the
                    <a
                      href="https://nearn.io/infra-committee/"
                      className="text-decoration-underline d-inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      NEARN Infrastructure Committee
                    </a>
                    page to view the latest opportunities.
                  </div>
                </div>
              </BannerWrapper>

              <div className="mt-4 border rounded-2">
                {state.aggregatedCount === 0 ? (
                  <div className="m-2">
                    {state.isFiltered ? (
                      <div class="alert alert-danger" role="alert">
                        No RFP found for selected filter.
                      </div>
                    ) : (
                      <div class="alert alert-secondary" role="alert">
                        No RFP has been created yet.
                      </div>
                    )}
                  </div>
                ) : state.aggregatedCount > 0 ? (
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={makeMoreItems}
                    hasMore={state.aggregatedCount > state.data.length}
                    loader={loader}
                    useWindow={false}
                    threshold={100}
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
