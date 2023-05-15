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
    .map(([key, value]) => (value === null ? null : `${key}=${value}`))
    .filter((nullable) => nullable !== null)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const FormCheckLabel = styled.label`
  white-space: nowrap;
`;
/* END_INCLUDE: "common.jsx" */

const GithubRepoBoard = ({
  boardId,
  dataTypes,
  columns,
  linkedPage,
  name,
  repoURL,
}) => {
  State.init({
    pullRequestByColumn: columns.reduce(
      (registry, { title }) => ({ ...registry, [title]: [] }),
      {}
    ),

    issueByColumn: columns.reduce(
      (registry, { title }) => ({ ...registry, [title]: [] }),
      {}
    ),
  });

  if (repoURL) {
    if (dataTypes.PullRequest) {
      const pullRequests = (
        fetch(
          `https://api.github.com/repos/${repoURL
            .split("/")
            .slice(-2)
            .join("/")}/pulls`
        ).body ?? []
      ).map((pullRequest) => ({ ...pullRequest, type: "PullRequest" }));

      State.update({
        pullRequestByColumn: columns.reduce(
          (registry, column) => ({
            ...registry,

            [column.title]: [
              ...(registry[column.title] ?? []),

              ...pullRequests.filter((pullRequest) =>
                pullRequest.labels.some((label) =>
                  column?.labelFilters.some((searchTerm) =>
                    label.name.includes(searchTerm)
                  )
                )
              ),
            ],
          }),

          {}
        ),
      });
    }

    console.log(state.pullRequestByColumn);

    if (dataTypes.Issue) {
      const issues = (
        fetch(
          `https://api.github.com/repos/${repoURL
            .split("/")
            .slice(-2)
            .join("/")}/issues`
        ).body ?? []
      ).map((issue) => ({ ...issue, type: "Issue" }));
    }
  }

  return (
    <div className="d-flex gap-3">
      {boardId ? (
        <div className="row">
          <div className="col">
            <small className="text-muted">
              <a
                className="card-link"
                href={href(linkedPage, { boardId })}
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
            </small>
          </div>
        </div>
      ) : null}

      <div className="row">
        {columns.map((column) => (
          <div className="col-3" key={column.title}>
            <CompactContainer className="card">
              <CompactContainer className="card-body d-flex flex-column gap-3 border-secondary">
                <h6 className="card-title d-flex align-items-center gap-2">
                  {column.title}

                  <span className="badge rounded-pill bg-secondary">
                    {state.pullRequestByColumn[column.title].length}
                  </span>
                </h6>

                {(state.pullRequestByColumn[column.title] ?? []).map((data) =>
                  widget("entities.GithubRepo.TicketCard", { data }, data.id)
                )}
              </CompactContainer>
            </CompactContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

return GithubRepoBoard(props);
