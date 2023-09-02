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
      src={`${
        props.env !== "local"
          ? `${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.`
          : ""
      }${widgetName}`}
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

  return [
    "/#/",

    ...(props.env !== "local"
      ? [`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.`]
      : []),

    `${widgetName}${linkPropsQuery ? "?" : ""}${linkPropsQuery}`,
  ].join("");
}
/* END_INCLUDE: "common.jsx" */

const Header = styled.div`
  height: 62px;
  background: #181818;
  margin-top: -25px;
  padding: 16px 20px;

  img {
    height: 30px;
  }
`;

const AppHeader = ({ path }) => (
  <Header className="d-flex justify-content-between align-items-center">
    <div className="d-flex gap-2">
      <a href={href("Feed")}>
        <img src="https://ipfs.near.social/ipfs/bafkreibjsn3gswlcc5mvgkfv7ady2lzkd2htm55l472suarbd34qryh2uy"></img>
      </a>

      {widget("components.molecule.breadcrumbs", {
        classNames: { link: "fs-5" },
        path,
      })}
    </div>

    <div className="d-flex align-items-center gap-3">
      {!(path ?? []).some(({ pageId }) => pageId === "communities") ? (
        <a href={href("communities")} class="text-white me-2">
          Communities
        </a>
      ) : null}

      <a
        className="text-white"
        href="https://www.neardevgov.org/blog/near-developer-dao"
        target="_blank"
      >
        Developer DAO
      </a>

      <div className="btn-group" role="group">
        <button
          type="button"
          className="btn btn-outline-light border-opacity-75 rounded-circle"
          style={{
            width: "30px",
            height: "30px",
            padding: "6px 0px",
            borderWidth: "2px",
            lineHeight: "0px",
          }}
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-question-lg"></i>
        </button>

        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <a
              target="_blank"
              className="dropdown-item"
              href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=bug&template=bug_report.md&title="
            >
              Report a bug
            </a>
          </li>

          <li>
            <a
              target="_blank"
              className="dropdown-item"
              href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=enhancement&template=feature-request.md&title="
            >
              Suggest an improvement
            </a>
          </li>
        </ul>
      </div>
    </div>
  </Header>
);

return AppHeader(props);
