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
/* INCLUDE: "core/lib/form" */
/**
 *! TODO: Extract into separate library module
 *! once `useForm` is converted into a form factory widget
 */
const traversalUpdate = ({
  input,
  target: treeOrBranch,
  path: [currentBranchKey, ...remainingBranch],
  params,
  via: nodeUpdate,
}) => ({
  ...treeOrBranch,

  [currentBranchKey]:
    remainingBranch.length > 0
      ? traversalUpdate({
          input,

          target:
            typeof treeOrBranch[currentBranchKey] === "object"
              ? treeOrBranch[currentBranchKey]
              : {
                  ...((treeOrBranch[currentBranchKey] ?? null) !== null
                    ? { __archivedLeaf__: treeOrBranch[currentBranchKey] }
                    : {}),
                },

          path: remainingBranch,
          via: nodeUpdate,
        })
      : nodeUpdate({
          input,
          lastKnownState: treeOrBranch[currentBranchKey],
          params,
        }),
});

const fieldDefaultUpdate = ({
  input,
  lastKnownState,
  params: { arrayDelimiter },
}) => {
  switch (typeof input) {
    case "boolean":
      return input;

    case "object":
      return Array.isArray(input) && typeof lastKnownState === "string"
        ? input.join(arrayDelimiter ?? ",")
        : input;

    case "string":
      return Array.isArray(lastKnownState)
        ? input.split(arrayDelimiter ?? ",").map((string) => string.trim())
        : input;

    default: {
      if ((input ?? null) === null) {
        switch (typeof lastKnownState) {
          case "boolean":
            return !lastKnownState;

          default:
            return lastKnownState;
        }
      } else return input;
    }
  }
};

const useForm = ({ stateKey: formStateKey }) => ({
  formState: state[formStateKey],

  formUpdate:
    ({ path: fieldPath, via: fieldCustomUpdate, ...params }) =>
    (fieldInput) =>
      State.update((lastKnownState) =>
        traversalUpdate({
          input: fieldInput?.target?.value ?? fieldInput,
          target: lastKnownState,
          path: [formStateKey, ...fieldPath],
          params,

          via:
            typeof fieldCustomUpdate === "function"
              ? fieldCustomUpdate
              : fieldDefaultUpdate,
        })
      ),
});
/* END_INCLUDE: "core/lib/form" */
/* INCLUDE: "core/lib/record" */
const pick = (object, subsetKeys) =>
  Object.fromEntries(
    Object.entries(object ?? {}).filter(([key, _]) => subsetKeys.includes(key))
  );
/* END_INCLUDE: "core/lib/record" */

const fieldParamsByType = {
  array: {
    name: "components.molecule.text-input",
    inputProps: { type: "text" },
  },

  boolean: {
    name: "components.atom.switch",
  },

  string: {
    name: "components.molecule.text-input",
    inputProps: { type: "text" },
  },
};

const fieldsRenderDefault = ({ schema, formState, formUpdate, isEditable }) => (
  <>
    {Object.entries(schema).map(
      ([
        fieldKey,
        { format, inputProps, label, order, style, ...fieldProps },
      ]) => {
        const contentDisplayClassName = [
          (formState[fieldKey]?.length ?? 0) > 0 ? "" : "text-muted",
          "m-0",
        ].join(" ");

        const fieldType = Array.isArray(formState[fieldKey])
          ? "array"
          : typeof (formState[fieldKey] ?? "");

        return (
          <>
            {!isEditable && (
              <div
                className="d-flex gap-3"
                key={`${formState.handle}-${fieldKey}`}
                style={{ order }}
              >
                <label className="fw-bold w-25">{label}</label>

                {format !== "markdown" ? (
                  <p className={[contentDisplayClassName, "w-75"].join(" ")}>
                    {(fieldType === "array"
                      ? formState[fieldKey]
                          .filter((string) => string.length > 0)
                          .join(", ")
                      : formState[fieldKey]
                    )?.toString?.() || "none"}
                  </p>
                ) : (
                  <p className={[contentDisplayClassName, "w-75"].join(" ")}>
                    {(formState[fieldKey]?.length ?? 0) > 0 ? (
                      <Markdown text={formState[fieldKey]} />
                    ) : (
                      "none"
                    )}
                  </p>
                )}
              </div>
            )}

            {isEditable &&
              widget(fieldParamsByType[fieldType].name, {
                ...fieldProps,
                className: "w-100",
                format,
                key: `${formState.handle}-${fieldKey}`,
                label,
                onChange: formUpdate({ path: [fieldKey] }),
                style: { ...style, order },

                value:
                  fieldType === "array"
                    ? formState[fieldKey].join(", ")
                    : formState[fieldKey],

                inputProps: {
                  ...(inputProps ?? {}),

                  ...(fieldParamsByType[typeof formState[fieldKey]]
                    .inputProps ?? {}),
                },
              })}
          </>
        );
      }
    )}
  </>
);

const Form = ({
  actionsAdditional,
  cancelLabel,
  classNames,
  data,
  fieldsRender: fieldsRenderCustom,
  heading,
  isEditorActive,
  isMutable,
  noEditorFrame,
  onCancel,
  onSubmit,
  schema,
  submitLabel,
  ...restProps
}) => {
  const fieldsRender =
    typeof fieldsRenderCustom === "function"
      ? fieldsRenderCustom
      : fieldsRenderDefault;

  const fieldValues =
    typeof schema === "object" ? pick(data, Object.keys(schema)) : data;

  State.init({
    initialState: fieldValues,
    data: fieldValues,
    isEditorActive: isEditorActive ?? false,
  });

  const onEditorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isEditorActive: forcedState ?? !lastKnownState.isEditorActive,
    }));

  const { formState, formUpdate } = useForm({ stateKey: "data" });

  const noChanges =
    JSON.stringify(formState) === JSON.stringify(state.initialState ?? {});

  const onCancelClick = () => {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      data: lastKnownState.initialState,
      isEditorActive: false,
    }));

    if (typeof onSubmit === "function") onSubmit(lastKnownState.initialState);
    if (typeof onCancel === "function") onCancel();
  };

  const onSubmitClick = () => {
    onEditorToggle(false);
    if (typeof onSubmit === "function") onSubmit(formState);
  };

  return widget("components.molecule.tile", {
    className: classNames.root,
    heading,
    noFrame: noEditorFrame,

    headerSlotRight:
      isMutable && !state.isEditorActive
        ? widget("components.atom.button", {
            classNames: {
              root: "btn-sm btn-primary",
              adornment: "bi bi-pen-fill",
            },

            label: "Edit",
            onClick: () => onEditorToggle(true),
          })
        : null,

    children: (
      <div className="flex-grow-1 d-flex flex-column gap-3">
        <div
          className={`d-flex flex-column gap-${state.isEditorActive ? 1 : 4}`}
        >
          {fieldsRender({
            formState,
            formUpdate,
            isEditable: isMutable && state.isEditorActive,
            onFormSubmit: onSubmit,
            schema,
          })}
        </div>

        {!noEditorFrame && isMutable && state.isEditorActive ? (
          <div className="d-flex align-items-center justify-content-end gap-3 mt-auto">
            {actionsAdditional ? (
              <div className="me-auto">{actionsAdditional}</div>
            ) : null}

            {widget("components.atom.button", {
              classNames: { root: "btn-outline-danger shadow-none border-0" },
              disabled: noChanges,
              label: cancelLabel ?? "Cancel",
              onClick: onCancelClick,
            })}

            {widget("components.atom.button", {
              classNames: {
                root: "btn-success",
                adornment: `bi ${classNames.submitAdornment}`,
              },

              disabled: noChanges,
              label: submitLabel ?? "Submit",
              onClick: onSubmitClick,
            })}
          </div>
        ) : null}
      </div>
    ),

    ...restProps,
  });
};

return Form(props);
