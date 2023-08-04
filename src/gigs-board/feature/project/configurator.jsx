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
/* INCLUDE: "core/lib/gui/form" */
const defaultFieldUpdate = ({
  input,
  lastKnownValue,
  params: { arrayDelimiter },
}) => {
  switch (typeof input) {
    case "boolean":
      return input;

    case "object":
      return Array.isArray(input) && typeof lastKnownValue === "string"
        ? input.join(arrayDelimiter ?? ",")
        : input;

    case "string":
      return Array.isArray(lastKnownValue)
        ? input.split(arrayDelimiter ?? ",").map((string) => string.trim())
        : input;

    default: {
      if ((input ?? null) === null) {
        switch (typeof lastKnownValue) {
          case "boolean":
            return !lastKnownValue;

          default:
            return lastKnownValue;
        }
      } else return input;
    }
  }
};

const useForm = ({ initialValues, stateKey: formStateKey, uninitialized }) => {
  const initialFormState = {
    hasUnsubmittedChanges: false,
    values: initialValues ?? {},
  };

  const formState = state[formStateKey] ?? null,
    isSynced = Struct.isEqual(formState?.values ?? {}, initialFormState.values);

  const formReset = () =>
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [formStateKey]: initialFormState,
      hasUnsubmittedChanges: false,
    }));

  const formUpdate = ({ path, via: customFieldUpdate, ...params }) => (
    fieldInput
  ) => {
    const updatedValues = Struct.deepFieldUpdate(
      formState?.values ?? {},

      {
        input: fieldInput?.target?.value ?? fieldInput,
        params,
        path,

        via:
          typeof customFieldUpdate === "function"
            ? customFieldUpdate
            : defaultFieldUpdate,
      }
    );

    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,

      [formStateKey]: {
        hasUnsubmittedChanges: !Struct.isEqual(
          updatedValues,
          initialFormState.values
        ),

        values: updatedValues,
      },
    }));
  };

  if (
    !uninitialized &&
    (formState === null ||
      (Object.keys(formState?.values ?? {}).length > 0 &&
        !formState.hasUnsubmittedChanges &&
        !isSynced))
  ) {
    formReset();
  }

  return {
    ...(formState ?? initialFormState),
    isSynced,
    reset: formReset,
    update: formUpdate,
  };
};
/* END_INCLUDE: "core/lib/gui/form" */

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
              classNames: {
                root: [
                  "btn-danger",
                  !state.isConfiguratorActive ? "d-none" : "",
                ].join(" "),
              },
              label: "Cancel",
              onClick: () => configuratorToggle(false),
            })}

            {widget("components.atom.button", {
              classNames: {
                root: [
                  "btn-primary",
                  state.isConfiguratorActive ? "d-none" : "",
                ].join(" "),
                adornment: "bi bi-gear-fill",
              },
              label: "Configure project",
              onClick: () => configuratorToggle(true),
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

return ProjectConfigurator(props);
