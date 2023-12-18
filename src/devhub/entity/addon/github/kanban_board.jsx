const { widget } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
const { DataRequest } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.data-request"
);

widget || (widget = () => {});
DataRequest || (DataRequest = {});

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

const GithubKanbanBoard = ({
  columns,
  title,
  description,
  repoURL,
  ticketState,
  dataTypesIncluded,
  metadata,
}) => {
  const ticketStateFilter =
    ticketState === "open" || ticketState === "closed" || ticketState === "all"
      ? ticketState
      : "all";

  State.init({
    ticketsByColumn: {},
  });

  if (repoURL) {
    const pullRequests = dataTypesIncluded.PullRequest
      ? DataRequest?.paginated(
          (pageNumber) =>
            fetch(
              `https://api.github.com/repos/${repoURL
                .split("/")
                .slice(-2)
                .concat(["pulls"])
                .join(
                  "/"
                )}?state=${ticketStateFilter}&per_page=100&page=${pageNumber}`
            )?.body,

          { startWith: 1 }
        ).map(withType("PullRequest"))
      : [];

    const issues = dataTypesIncluded.Issue
      ? DataRequest?.paginated(
          (pageNumber) =>
            fetch(
              `https://api.github.com/repos/${repoURL
                .split("/")
                .slice(-2)
                .concat(["issues"])
                .join(
                  "/"
                )}?state=${ticketStateFilter}&per_page=100&page=${pageNumber}`
            )?.body,

          { startWith: 1 }
        ).map(withType("Issue"))
      : [];

    State.update((lastKnownState) => ({
      ...lastKnownState,
      ticketsByColumn: dataToColumns([...issues, ...pullRequests], columns),
    }));
  }

  return (
    <div>
      <div className="d-flex flex-column align-items-center gap-2 py-4">
        <h5 className="h5 d-inline-flex gap-2 m-0">
          {widget("components.atom.Icon", {
            type: "bootstrap_icon",
            variant: "bi-kanban-fill",
          })}

          <span>{(title?.length ?? 0) > 0 ? title : "Untitled view"}</span>
        </h5>

        <p className="m-0 py-1 text-secondary text-center">
          {(description?.length ?? 0) > 0
            ? description
            : "No description provided"}
        </p>
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
        {Object.values(columns).map((column) => {
          const tickets = state.ticketsByColumn[column.id] ?? [];

          return (
            <div className="col-4" key={`column-${column.id}-view`}>
              <div className="card rounded-4">
                <div
                  className={[
                    "card-body d-flex flex-column gap-3 p-2",
                    "border border-2 border-secondary rounded-4",
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
                    {tickets.map((ticket) =>
                      widget(
                        `entity.addon.${metadata.ticket.type}`,
                        { metadata: metadata.ticket, payload: ticket },
                        ticket.id
                      )
                    )}
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
