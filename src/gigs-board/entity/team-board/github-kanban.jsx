/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "core/lib/data-request" */
const DataRequest = {
  /**
   * Requests all the data from non-empty pages of the paginated API.
   *
   * **Notice: currently expected to work only with array responses.**
   *
   * @param {object} parameters
   * 	Request parameters including the number of page to start with,
   * 	and an accumulated response buffer, if it exists.
   *
   * @param {array | null | undefined} parameters.buffer
   * @param {number} parameters.startWith
   *
   * @param {(pageNumber: number) => array} requestByNumber
   *
   * @returns {array} The final accumulated response.
   */
  paginated: (requestByNumber, { buffer, startWith }) => {
    const startPageNumber = startWith ?? 1,
      accumulatedResponse = buffer ?? [];

    const latestResponse = requestByNumber(startPageNumber) ?? [];

    if (latestResponse.length === 0) {
      return accumulatedResponse;
    } else {
      return DataRequest.paginated(requestByNumber, {
        buffer: [...accumulatedResponse, ...latestResponse],
        startWith: startPageNumber + 1,
      });
    }
  },
};
/* END_INCLUDE: "core/lib/data-request" */
/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */

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

const GithubKanbanTeamBoard = ({
  columns,
  dataTypesIncluded,
  description,
  editorTrigger,
  isEditable,
  pageURL,
  repoURL,
  ticketState,
  title,
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
      ? DataRequest.paginated(
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
      ? DataRequest.paginated(
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
    <div className="d-flex flex-column gap-4 py-4">
      <div className="d-flex flex-column align-items-center gap-2">
        <h5 className="h5 d-inline-flex gap-2 m-0">
          <i className="bi bi-kanban-fill" />
          <span>{(title?.length ?? 0) > 0 ? title : "Untitled board"}</span>
        </h5>

        <p className="m-0 py-1 text-secondary text-center">
          {(description?.length ?? 0) > 0
            ? description
            : "No description provided"}
        </p>
      </div>

      <div className="d-flex justify-content-end gap-3">
        {pageURL ? (
          <a
            className="card-link d-inline-flex me-auto"
            href={pageURL}
            rel="noreferrer"
            role="button"
            target="_blank"
            title="Link to this board"
          >
            <span className="hstack gap-2">
              <i className="bi bi-share" />
              <span>Open in new tab</span>
            </span>
          </a>
        ) : null}

        {pageURL ? (
          <button
            className="btn shadow btn-sm btn-outline-secondary d-inline-flex gap-2"
            onClick={() => clipboard.writeText(pageURL)}
          >
            <i className="bi bi-clipboard-fill" />
            <span>Copy link</span>
          </button>
        ) : null}

        {isEditable ? (
          <button
            className="btn shadow btn-sm btn-primary d-inline-flex gap-2"
            onClick={editorTrigger}
          >
            <i className="bi bi-gear-wide-connected" />
            <span>Configure</span>
          </button>
        ) : null}
      </div>

      <div className="d-flex gap-3" style={{ overflowX: "auto" }}>
        {Object.keys(columns).length > 0 ? (
          Object.values(columns).map((column) => (
            <div className="col-3" key={column.id}>
              <div className="card rounded-4">
                <div
                  className={[
                    "card-body d-flex flex-column gap-3",
                    "border border-2 border-secondary rounded-4",
                  ].join(" ")}
                >
                  <h6 className="card-title h6 d-flex align-items-center gap-2 m-0">
                    {column.title}

                    <span className="badge rounded-pill bg-secondary">
                      {(state.ticketsByColumn[column.id] ?? []).length}
                    </span>
                  </h6>

                  <p class="text-secondary m-0">{column.description}</p>

                  <div class="d-flex flex-column gap-3">
                    {(state.ticketsByColumn[column.id] ?? []).map((data) =>
                      widget(
                        "entity.team-board.github-ticket",
                        { data },
                        data.id
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className={[
              "d-flex align-items-center justify-content-center",
              "w-100 text-black-50 opacity-50",
            ].join(" ")}
            style={{ height: 384 }}
          >
            No columns were created so far.
          </div>
        )}
      </div>
    </div>
  );
};

return GithubKanbanTeamBoard(props);
