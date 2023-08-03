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

const layoutConfig = {
  bannerHeight: "142px",
};

const ProjectLayout = ({ children, metadata, path }) =>
  widget("components.template.app-layout", {
    path,

    banner:
      typeof metadata.id === "string" ? (
        <div
          className="d-flex justify-content-between gap-3 p-4 text-white"
          style={{
            backgroundColor: "#181818",
            height: layoutConfig.bannerHeight,
            maxHeight: layoutConfig.bannerHeight,
          }}
        >
          <div className="d-flex flex-column gap-2">
            <h1 className="m-0">{metadata.name}</h1>
            <p className="m-0">{metadata.description}</p>
          </div>

          <div className="d-flex flex-column gap-3 justify-content-between align-items-end h-100">
            <span
              class="badge bg-primary rounded-4 text-decoration-none"
              style={{ cursor: "default" }}
              title="DevHub tag"
            >
              {metadata.tag}
            </span>

            {widget("components.atom.button", {
              classNames: { adornment: "bi bi-gear-fill" },
              disabled: true,
              label: "Configure project",
            })}
          </div>
        </div>
      ) : (
        <></>
      ),

    children:
      typeof metadata.id === "string" ? (
        <div className="d-flex flex-column gap-4 py-4 w-100 h-100">
          {children}
        </div>
      ) : null,
  });

return ProjectLayout(props);
