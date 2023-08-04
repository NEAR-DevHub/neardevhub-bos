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

const ProjectConfigurator = ({ metadata, permissions }) => {
  State.init({
    isConfiguratorActive: false,
  });

  const configuratorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isConfiguratorActive: forcedState ?? !lastKnownState.isConfiguratorActive,
    }));

  return (
    <div className="d-flex justify-content-between gap-3 w-100">
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

        {true ||
        /**
         * TODO!: REMOVE `true ||` BEFORE RELEASE
         */ permissions.can_configure ? (
          <div className="d-flex gap-3">
            {widget("components.atom.button", {
              classNames: { root: "btn-danger" },
              label: "Cancel",
              style: { display: !state.isConfiguratorActive ? "none" : null },
            })}

            {widget("components.atom.button", {
              classNames: { adornment: "bi bi-gear-fill" },
              label: "Configure project",
              onClick: () => configuratorToggle(true),
              style: { display: state.isConfiguratorActive ? "none" : null },
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

return ProjectConfigurator(props);
