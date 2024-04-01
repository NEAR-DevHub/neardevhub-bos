const { DataRequest } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.data-request"
);
DataRequest || (DataRequest = { paginated: () => {} });

const dataToColumns = (data, columns) =>
  Object.values(columns).reduce(
    (registry, column) => ({
      ...registry,
      [column.id]:
        column.labelSearchTerms.length > 0
          ? [
              ...(registry[column.id] ?? []),
              ...data.filter((ticket) =>
                column.labelSearchTerms.every((searchTerm) =>
                  searchTerm.length > 0
                    ? ticket.labels.some((label) =>
                        label.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                    : false
                )
              ),
            ]
          : [],
    }),

    {}
  );

const withType = (type) => (data) => ({ ...data, type });

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
  const ticketStateFilter = ticketState ?? "all";

  State.init({
    ticketsByColumn: {},
  });

  if (repoURL) {
    const { repo, owner } = extractOwnerAndRepo(repoURL);
    Object.keys(columns).map((item) => {
      const columnId = item;
      const columnData = columns[columnId];
      const labels = (columnData?.labelSearchTerms ?? []).join(",");
      const pullRequests = dataTypesIncluded.pullRequest
        ? DataRequest?.paginated(
            (pageNumber) =>
              useCache(
                () =>
                  asyncFetch(
                    `https://api.github.com/repos/${owner}/${repo}/pulls?state=${ticketStateFilter}&per_page=100&page=${pageNumber}&labels=${labels}`
                  ).then((res) => res?.body),
                repoURL +
                  ticketStateFilter +
                  labels +
                  dataTypesIncluded +
                  pageNumber,
                { subscribe: false }
              ),
            { startWith: 1 }
          )
        : [];

      const issues = dataTypesIncluded.issue
        ? DataRequest?.paginated(
            (pageNumber) =>
              useCache(
                () =>
                  asyncFetch(
                    `https://api.github.com/repos/${owner}/${repo}/issues?state=${ticketStateFilter}&per_page=100&page=${pageNumber}&labels=${labels}`
                  ).then((res) => res?.body),
                repoURL +
                  ticketStateFilter +
                  labels +
                  dataTypesIncluded +
                  pageNumber,
                { subscribe: false }
              ),
            { startWith: 1 }
          ) ?? []
        : [];

      State.update((lastKnownState) => ({
        ...lastKnownState,
        ticketsByColumn: {
          ...lastKnownState.ticketsByColumn,
          [columnId]: [...issues, ...pullRequests],
        },
      }));
    });
  }

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
          const tickets = state.ticketsByColumn[column.id] ?? [];

          return (
            <div
              className="col-3"
              style={{ minWidth: "300px" }}
              key={`column-${column.id}-view`}
            >
              <div className="card rounded-4">
                <div
                  style={{ height: "75vh", overflow: "scroll" }}
                  className={[
                    "card-body d-flex flex-column gap-3 p-2",
                    "border border-1 rounded-4",
                  ].join(" ")}
                >
                  <span className="d-flex flex-column py-1">
                    <h6 className="card-title h6 d-flex align-items-center gap-2 m-0">
                      {column.title}

                      <span className="badge rounded-pill bg-secondary">
                        {tickets.length}
                      </span>
                    </h6>

                    <p class="text-secondary m-0">{column.description}</p>
                  </span>

                  <div class="d-flex flex-column gap-2">
                    {tickets.map((ticket) => (
                      <Widget
                        src={`${REPL_DEVHUB}/widget/devhub.entity.addon.${metadata.ticket.type}`}
                        props={{ metadata: metadata.ticket, payload: ticket }}
                        key={ticket.id}
                      />
                    ))}
                  </div>
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
