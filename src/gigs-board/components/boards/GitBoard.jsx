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

const {
  boardId = null,
  columns,
  excludedLabels = [],
  name,
  repoURL = null,
  requiredLabels = [],
} = props;

if (repoURL) {
  const { body: pullRequests } = fetch(
    `https://api.github.com/repos/${repoURL
      .split("/")
      .slice(-2, -1)
      .join("/")}/pulls`
  );

  console.log(pullRequests);
}

return (
  <div>
    <div class="row mb-2">
      {props.boardId ? (
        <div class="col">
          <small class="text-muted">
            <a
              class="card-link"
              href={href("Boards", { selectedBoardId: props.boardId })}
              role="button"
              target="_blank"
              title="Link to this board"
            >
              <div class="hstack gap-3">
                <div class="bi bi-share"></div>
                <div>Link to this board</div>
              </div>
            </a>
          </small>
        </div>
      ) : null}

      {requiredLabels.length > 0 ? (
        <div class="col">
          <small class="text-muted">
            Required labels:
            {requiredLabels.map((label) => (
              <a href={href("Feed", { label })} key={label}>
                <span class="badge text-bg-primary me-1">{label}</span>
              </a>
            ))}
          </small>
        </div>
      ) : null}
      {excludedLabels.length > 0 ? (
        <div class="col">
          <small class="text-muted">
            Excluded labels:
            {excludedLabels.map((label) => (
              <a href={href("Feed", { label })} key={label}>
                <span class="badge text-bg-primary me-1">{label}</span>
              </a>
            ))}
          </small>
        </div>
      ) : null}
    </div>
    <div class="row">
      {postsPerLabel.map((column) => (
        <div class="col-3" key={column.label}>
          <div class="card">
            <div class="card-body border-secondary">
              <h6 class="card-title">
                {column.title}({column.posts.length})
              </h6>
              {column.posts.map((postId) =>
                widget("components.posts.CompactPost", { id: postId }, postId)
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
