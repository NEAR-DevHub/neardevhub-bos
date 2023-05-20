/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

/**
 * Reads a board config from DevHub contract storage.
 * Currently a mock.
 *
 * Boards are indexed by their ids.
 */
const boardConfigByBoardId = ({ boardId }) => {
  return {
    probablyUUIDv4: {
      id: "probablyUUIDv4",
      columns: [
        { title: "Draft", labelFilters: ["S-draft"] },
        { title: "Review", labelFilters: ["S-review"] },
        { title: "HALP!", labelFilters: ["help"] },
      ],
      dataTypes: { Issue: true, PullRequest: true },
      description: "Latest NEAR Enhancement Proposals by status",
      repoURL: "https://github.com/near/NEPs",
      title: "NEAR Protocol NEPs",
    },
  }[boardId];
};

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

const formHandler =
  ({ formStateKey }) =>
  ({ fieldName, updateHandler }) =>
  (input) =>
    State.update((lastState) => ({
      ...lastState,

      [formStateKey]: {
        ...lastState[formStateKey],

        [fieldName]:
          typeof updateHandler === "function"
            ? updateHandler({
                input: input?.target?.value ?? input ?? null,
                lastState,
              })
            : input?.target?.value ?? input ?? null,
      },
    }));

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;
/* END_INCLUDE: "common.jsx" */

const GithubRepoBoard = ({
  columns,
  dataTypes,
  description,
  pageURL,
  repoURL,
  title,
}) => {
  State.init({
    pullRequestByColumn: {},
    issueByColumn: {},
    ticketByColumn: {},
  });

  const dataToColumns = (data) =>
    columns.reduce(
      (registry, column) => ({
        ...registry,

        [column.title]: [
          ...(registry[column.title] ?? []),

          ...data.filter((pullRequest) =>
            pullRequest.labels.some((label) =>
              column?.labelFilters.some((searchTerm) =>
                label.name.includes(searchTerm)
              )
            )
          ),
        ],
      }),

      {}
    );

  if (repoURL) {
    const pullRequests = dataTypes.PullRequest
      ? (
          fetch(
            `https://api.github.com/repos/${repoURL
              .split("/")
              .slice(-2)
              .join("/")}/pulls`
          ).body ?? []
        ).map((pullRequest) => ({ ...pullRequest, type: "PullRequest" }))
      : [];

    const issues = dataTypes.Issue
      ? (
          fetch(
            `https://api.github.com/repos/${repoURL
              .split("/")
              .slice(-2)
              .join("/")}/issues`
          ).body ?? []
        ).map((issue) => ({ ...issue, type: "Issue" }))
      : [];

    State.update({
      ticketByColumn: dataToColumns([...issues, ...pullRequests]),
    });
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between">
        <i class="placeholder" />

        <h5 className="h5 d-inline-flex gap-2 m-0">
          <i className="bi bi-kanban-fill" />
          <span>{title} board</span>
        </h5>

        {pageURL ? (
          <a
            className="card-link d-inline-flex"
            href={pageURL}
            rel="noreferrer"
            role="button"
            target="_blank"
            title="Link to this board"
          >
            <span className="hstack gap-3">
              <i className="bi bi-share" />
              <span>Link to this board</span>
            </span>
          </a>
        ) : (
          <i class="placeholder" />
        )}
      </div>

      <div class="py-1 text-secondary text-center">{description}</div>

      <div className="d-flex gap-3 overflow-x-auto">
        {columns.length > 0 ? (
          columns.map((column) => (
            <div className="col-3" key={column.title}>
              <CompactContainer className="card">
                <CompactContainer className="card-body d-flex flex-column gap-3 border-secondary">
                  <h6 className="card-title d-flex align-items-center gap-2">
                    {column.title}

                    <span className="badge rounded-pill bg-secondary">
                      {(state.ticketByColumn[column.title] ?? []).length}
                    </span>
                  </h6>

                  {(state.ticketByColumn[column.title] ?? []).map((data) =>
                    widget(
                      "entity.github-repo.ticket",
                      { data, format: "card" },
                      data.id
                    )
                  )}
                </CompactContainer>
              </CompactContainer>
            </div>
          ))
        ) : (
          <div
            className="d-flex align-items-center justify-content-center w-100 text-black-50 opacity-50"
            style={{ height: 384 }}
          >
            No columns were created so far.
          </div>
        )}
      </div>
    </div>
  );
};

return GithubRepoBoard(props);
