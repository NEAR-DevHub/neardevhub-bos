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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const GithubRepoBoard = ({
  boardId,
  contentTypes,
  columns,
  linkedPage,
  name,
  repoURL,
}) => {
  State.init({
    ticketByColumn: columns.reduce(
      (registry, { title }) => ({ ...registry, [title]: [] }),
      {}
    ),
  });

  if (repoURL) {
    if (contentTypes.PullRequest) {
      const pullRequests = (
        fetch(
          `https://api.github.com/repos/${repoURL
            .split("/")
            .slice(-2)
            .join("/")}/pulls`
        ).body ?? []
      ).map((pullRequest) => ({ ...pullRequest, type: "PullRequest" }));

      State.update({
        ticketByColumn: columns.reduce(
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

          ticketByColumn
        ),
      });
    }

    console.log(state.ticketByColumn);

    if (contentTypes.Issue) {
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
    <div>
      <div class="row mb-2">
        {boardId ? (
          <div class="col">
            <small class="text-muted">
              <a
                class="card-link"
                href={href(linkedPage, { boardId })}
                rel="noreferrer"
                role="button"
                target="_blank"
                title="Link to this board"
              >
                <span class="hstack gap-3">
                  <i class="bi bi-share" />
                  <span>Link to this board</span>
                </span>
              </a>
            </small>
          </div>
        ) : null}
      </div>

      <div class="row">
        {columns.map((column) => (
          <div class="col-3" key={column.title}>
            <div class="card">
              <div class="card-body border-secondary">
                <h6 class="card-title d-flex align-items-center gap-2">
                  {column.title}

									<span class="badge rounded-pill bg-secondary">
										{state.ticketByColumn[column.title].length}
									</span>
                </h6>

                {(state.ticketByColumn[column.title] ?? []).map((data) =>
                  widget("entities.GithubRepo.TicketCard", { data }, data.id)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

return GithubRepoBoard(props);
