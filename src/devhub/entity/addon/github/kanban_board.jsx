const { DataRequest } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.data-request"
);
DataRequest || (DataRequest = { paginated: () => {} });

const resPerPage = 100;

function extractOwnerAndRepo(url) {
  // Remove any leading or trailing slashes and split the URL by "/"
  const parts = url
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .split("/");

  // Check if the URL matches the GitHub repository format
  if (parts.length === 5 && parts[2] === "github.com") {
    const owner = parts[3];
    const repo = parts[4];
    return { owner, repo };
  } else {
    return null;
  }
}

const GithubKanbanBoard = ({
  columns,
  title,
  description,
  repoURL,
  ticketState,
  dataTypesIncluded,
  metadata,
}) => {
  State.init({
    fetchedIssuesCount: 0,
    fetchedPullsCount: 0,
    ticketsByColumn: {},
    cachedItems: {},
    displayCount: 40,
    issuesLastPage: false,
    pullRequestsLastPage: false,
  });

  const ticketStateFilter = ticketState ?? "all";

  function fetchPullRequests(columnId, labels) {
    const pageNumber =
      state.fetchedPullsCount === 0
        ? 1
        : state.fetchedPullsCount / resPerPage + 1;
    const { repo, owner } = extractOwnerAndRepo(repoURL);
    const res = fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=${ticketStateFilter}&per_page=${resPerPage}&page=${pageNumber}&labels=${labels}`
    );
    if (res !== null) {
      if (!res.body.length || res.body.length < resPerPage) {
        State.update({
          pullRequestsLastPage: true,
        });
      }
      State.update((lastKnownState) => ({
        ...lastKnownState,
        fetchedPullsCount: lastKnownState.fetchedPullsCount + resPerPage,
        ticketsByColumn: {
          ...lastKnownState.ticketsByColumn,
          [columnId]: [
            ...(lastKnownState?.ticketsByColumn?.[columnId] ?? []),
            ...res.body,
          ],
        },
      }));
    }
  }

  function fetchIssues(columnId, labels) {
    const pageNumber =
      state.fetchedIssuesCount === 0
        ? 1
        : state.fetchedIssuesCount / resPerPage + 1;
    const { repo, owner } = extractOwnerAndRepo(repoURL);
    const res = fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=${ticketStateFilter}&per_page=${resPerPage}&page=${pageNumber}&labels=${labels}`
    );
    if (res !== null) {
      if (!res.body.length || res.body.length < resPerPage) {
        State.update({
          issuesLastPage: true,
        });
      }
      State.update((lastKnownState) => ({
        ...lastKnownState,
        fetchedIssuesCount: lastKnownState.fetchedIssuesCount + resPerPage,
        ticketsByColumn: {
          ...lastKnownState.ticketsByColumn,
          [columnId]: [
            ...(lastKnownState?.ticketsByColumn?.[columnId] ?? []),
            ...res.body,
          ],
        },
      }));
    }
  }

  if (repoURL && !Object.keys(state.ticketsByColumn).length) {
    Object.keys(columns).map((item) => {
      const columnId = item;
      const columnData = columns[columnId];
      const labels = (columnData?.labelSearchTerms ?? []).join(",");
      dataTypesIncluded.issue && fetchIssues(columnId, labels);
      dataTypesIncluded.pullRequest && fetchPullRequests(columnId, labels);
    });
  }

  const renderItem = (ticket) => (
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.entity.addon.${metadata.ticket.type}`}
      props={{ metadata: metadata.ticket, payload: ticket }}
      key={ticket.id}
    />
  );

  const cachedRenderItem = (item, index) => {
    const key = JSON.stringify(item);

    if (!(key in state.cachedItems)) {
      state.cachedItems[key] = renderItem(item, index);
      State.update();
    }
    return state.cachedItems[key];
  };

  const makeMoreItems = (columnId, labelSearchTerms) => {
    const addDisplayCount = 20;
    const newDisplayCount = state.displayCount + addDisplayCount;
    State.update({
      displayCount: newDisplayCount,
    });
    const labels = (labelSearchTerms ?? []).join(",");
    if (
      dataTypesIncluded.issue &&
      state.fetchedIssuesCount < 2 * newDisplayCount
    ) {
      fetchIssues(columnId, labels);
    }
    if (
      dataTypesIncluded.pullRequest &&
      state.fetchedPullsCount < 2 * newDisplayCount
    ) {
      fetchPullRequests(columnId, labels);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column align-items-center gap-2 pb-4">
        <h5 className="h5 d-inline-flex gap-2 m-0">
          <span>{title}</span>
        </h5>

        <p className="m-0 py-1 text-secondary text-center">{description}</p>
      </div>

      <div className="d-flex gap-3 w-100" style={{ overflowX: "auto" }}>
        {Object.keys(columns).length === 0 ? (
          <div
            className={[
              "d-flex align-items-center justify-content-center",
              "w-100 text-black-50 opacity-50",
            ].join(" ")}
            style={{ height: 384 }}
          >
            No columns were created so far.
          </div>
        ) : null}
        {Object.values(columns ?? {})?.map((column) => {
          const tickets = state.ticketsByColumn[column.id]
            ? state.ticketsByColumn[column.id].slice(0, state.displayCount)
            : [];
          const renderedItems = tickets.map(cachedRenderItem);

          return (
            <div
              className="col-3"
              style={{ minWidth: "300px" }}
              key={`column-${column.id}-view`}
            >
              <div className="card rounded-4">
                <div
                  style={{ height: "75vh", overflow: "auto" }}
                  className={[
                    "card-body d-flex flex-column gap-3 p-2",
                    "border border-1 rounded-4",
                  ].join(" ")}
                  id={column.id}
                >
                  <span className="d-flex flex-column py-1">
                    <h6 className="card-title h6 m-0">{column.title}</h6>
                    <p class="text-secondary m-0">{column.description}</p>
                  </span>

                  {(state.fetchedIssuesCount > 0 ||
                    state.fetchedPullsCount > 0) && (
                    <InfiniteScroll
                      loadMore={() =>
                        makeMoreItems(column.id, column?.labelSearchTerms)
                      }
                      hasMore={
                        (dataTypesIncluded.issue && !state.issuesLastPage) ||
                        (dataTypesIncluded.pullRequest &&
                          !state.pullRequestsLastPage)
                      }
                      loader={<>Loading...</>}
                      useWindow={false}
                      threshold={80}
                    >
                      <div class="d-flex flex-column gap-2">
                        {renderedItems}
                      </div>
                    </InfiniteScroll>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

return GithubKanbanBoard(props);
