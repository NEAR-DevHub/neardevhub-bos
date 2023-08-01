d; /* INCLUDE: "common.jsx" */
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

const ProjectLayout = ({ id, children, description, name, path, tag }) => (
  <>
    {widget("components.layout.app-header")}

    <div className="d-flex flex-column gap-4 w-100 h-100">
      {/* TODO: Add breadcrumbs rendered from path prop */}

      <div
        className="d-flex justify-content-between gap-3 p-4 text-white"
        style={{ backgroundColor: "#181818" }}
      >
        <div className="d-flex flex-column gap-2">
          <h1 className="m-0">{name}</h1>
          <p className="m-0">{description}</p>
        </div>

        <div className="d-flex flex-column gap-3 justify-content-end">
          {widget("components.atom.button", {
            classNames: { adornment: "bi bi-gear-fill" },
            disabled: true,
            label: "Configure project",
          })}
        </div>
      </div>

      {typeof id === "string" ? (
        <div className="px-4">{children}</div>
      ) : (
        <div class="alert alert-danger" role="alert">
          Error: project id not found in URL parameters
        </div>
      )}
    </div>
  </>
);

return ProjectLayout(props);
