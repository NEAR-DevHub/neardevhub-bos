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

return (
  <div class="card border-secondary mb-2">
    <div class="nav navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item ">
            <a class="nav-link active" href={href("Feed")}>
              <i class="bi-house-fill"> </i>
              Home
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href={href("Feed", { recency: "all" })}>
              <i class="bi-fire"> </i>
              Recent
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link active"
              href={href("Feed", { label: "recurrent" })}
            >
              <i class="bi-repeat"> </i>
              Recurrent
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href={href("Boards")}>
              <i class="bi-kanban"> </i>
              Boards
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link active"
              href={href("Teams")}
              title="View teams and permissions"
            >
              <i class="bi-people-fill"> </i>
              Teams
            </a>
          </li>

          {props.children ? (
            <li class="nav-item active ms-2">{props.children}</li>
          ) : null}
        </ul>
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-outline-secondary rounded-circle"
            style={{
              width: "30px",
              height: "30px",
              padding: "6px 0px",
              borderWidth: "0.5px",
              lineHeight: "0px",
            }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-question-lg"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a
                target="_blank"
                class="dropdown-item"
                href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=bug&template=bug_report.md&title="
              >
                Report a bug
              </a>
            </li>
            <li>
              <a
                target="_blank"
                class="dropdown-item"
                href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=enhancement&template=feature-request.md&title="
              >
                Suggest an improvement
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
