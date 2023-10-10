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
/* END_INCLUDE: "common.jsx" */

const ConfigurationSection = ({
  heading,
  headerSlotRight,
  isEditActive,
  hasPermissionToConfgure,
  configurator,
}) => {
  State.init({
    isEditActive: isEditActive ?? false,
  });

  const toggleEditActive = (forcedState) =>
    State.update({
      isEditActive: forcedState ?? !state.isEditActive,
    });

  return widget("components.molecule.tile", {
    heading,
    headerSlotRight:
      headerSlotRight ??
      (hasPermissionToConfgure &&
        widget("components.molecule.button", {
          classNames: { root: "btn-sm btn-secondary" },
          icon: {
            kind: "bootstrap-icon",
            variant: state.isEditActive ? "bi-x-circle" : "bi-pen-fill",
          },
          label: state.isEditActive ? "Cancel" : "Edit",
          onClick: () => toggleEditActive(),
        })),
    children: hasPermissionToConfgure ? ( // TODO: I feel there is a better way to do this...
      <div className="flex-grow-1 d-flex flex-column">
        {configurator && configurator({ isEditActive: state.isEditActive })}
      </div>
    ) : null,
  });
};

return ConfigurationSection(props);
