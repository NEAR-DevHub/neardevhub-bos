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

/* INCLUDE: "shared/lib/gui" */
const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }
`;

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;
/* END_INCLUDE: "shared/lib/gui" */

const dataToColumns = (data, columns) =>
  Object.values(columns).reduce(
    (registry, column) => ({
      ...registry,

      [column.id]: [
        ...(registry[column.id] ?? []),

        ...data.filter((ticket) =>
          ticket.labels.some((label) =>
            column?.labelTerms.some(
              (searchTerm) =>
                searchTerm.length > 0 && label.name.includes(searchTerm)
            )
          )
        ),
      ],
    }),

    {}
  );

const withType = (type) => (data) => ({ ...data, type });

const GithubRepoBoard = ({
  columns,
  dataTypes,
  description,
  pageURL,
  repoURL,
  title,
}) => {
  State.init({
    ticketsByColumn: {},
  });

  if (repoURL) {
    const pullRequests = dataTypes.PullRequest.enabled
      ? (
          fetch(
            `https://api.github.com/repos/${repoURL
              .split("/")
              .slice(-2)
              .join("/")}/pulls`
          ).body ?? []
        ).map(withType("PullRequest"))
      : [];

    const issues = dataTypes.Issue.enabled
      ? (
          fetch(
            `https://api.github.com/repos/${repoURL
              .split("/")
              .slice(-2)
              .join("/")}/issues`
          ).body ?? []
        ).map(withType("Issue"))
      : [];

    State.update({
      ticketsByColumn: dataToColumns([...issues, ...pullRequests], columns),
    });
  }

  return (
    <div className="d-flex flex-column gap-4 py-4">
      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-between">
          <i className="placeholder" />

          <h5 className="h5 d-inline-flex gap-2 m-0">
            <i className="bi bi-kanban-fill" />
            <span>{title}</span>
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
            <i className="placeholder" />
          )}
        </div>

        <div className="py-1 text-secondary text-center">{description}</div>
      </div>

      <div className="d-flex gap-3" style={{ overflowX: "auto" }}>
        {Object.keys(columns).length > 0 ? (
          Object.values(columns).map((column) => (
            <div className="col-3" key={column.id}>
              <div className="card">
                <div
                  className={[
                    "card-body d-flex flex-column gap-3",
                    "border border-2 border-secondary rounded-2",
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
                        "entity.github-repo.ticket",
                        { data, format: "card" },
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

return GithubRepoBoard(props);
