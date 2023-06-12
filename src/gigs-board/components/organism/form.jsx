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
/* INCLUDE: "shared/lib/form" */
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
/* END_INCLUDE: "shared/lib/form" */
/* INCLUDE: "shared/lib/record" */
const pick = (object, subsetKeys) =>
  Object.fromEntries(
    Object.entries(object ?? {}).filter(([key, _]) => subsetKeys.includes(key))
  );
/* END_INCLUDE: "shared/lib/record" */

const fieldsRenderDefault = ({ schema, formState, formUpdate, isEditable }) => (
  <>
    {Object.entries(schema).map(([fieldKey, fieldProps]) => (
      <>
        {!isEditable && (
          <div
            className="d-flex gap-3"
            key={`${formState.handle}-${fieldKey}`}
            style={{ order: fieldProps.order }}
          >
            <label className="fw-bold w-25">{fieldProps.label}</label>

            <p
              className={
                (formState[fieldKey] ?? null) === null ? "text-muted" : ""
              }
            >
              {formState[fieldKey] ?? "none"}
            </p>
          </div>
        )}

        {isEditable &&
          widget("components.molecule.text-input", {
            ...fieldProps,
            className: "w-100",
            key: `${formState.handle}-${fieldKey}`,
            onChange: formUpdate({ path: [fieldKey] }),
            style: { order: fieldProps.order },
            value: formState[fieldKey],
          })}
      </>
    ))}
  </>
);

const Form = ({
  actionsAdditional,
  cancelLabel,
  classNames,
  data,
  fieldsRender: fieldsRenderCustom,
  heading,
  isMutable,
  onCancel,
  onSubmit,
  schema,
  submitLabel,
}) => {
  const fieldsRender =
    typeof fieldsRenderCustom === "function"
      ? fieldsRenderCustom
      : fieldsRenderDefault;

  const fieldValues = pick(data, Object.keys(schema));

  State.init({
    initialState: fieldValues,
    data: fieldValues ?? {},
    isEditorActive: false,
  });

  console.log(state.initialState);

  const onEditorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isEditorActive: forcedState ?? !lastKnownState.isEditorActive,
    }));

  const { formState, formUpdate } = useForm({ stateKey: "data" }),
    noSubmit =
      JSON.stringify(formState) === JSON.stringify(state.initialState ?? {});

  const onCancelClick = () => {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      data: lastKnownState.initialState,
      isEditorActive: false,
    }));

    return typeof onCancel === "function" ? onCancel() : null;
  };

  const onSubmitClick = () => {
    onEditorToggle(false);
    return typeof onSubmit === "function" ? onSubmit(formState) : null;
  };

  return widget("components.molecule.tile", {
    className: classNames.root,
    heading,

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
      <div className="flex-grow-1 d-flex flex-column gap-1">
        {fieldsRender({
          formState,
          formUpdate,
          isEditable: isMutable && state.isEditorActive,
          schema,
        })}

        {isMutable && state.isEditorActive ? (
          <div className="d-flex align-items-center justify-content-end gap-3 pt-3 mt-auto">
            {actionsAdditional ? (
              <div className="me-auto">{actionsAdditional}</div>
            ) : null}

            {widget("components.atom.button", {
              classNames: { root: "btn-outline-danger shadow-none border-0" },
              label: cancelLabel ?? "Cancel",
              onClick: onCancelClick,
            })}

            {widget("components.atom.button", {
              classNames: {
                root: "btn-success",
                adornment: `bi ${classNames.submitAdornment}`,
              },

              disabled: noSubmit,
              label: submitLabel ?? "Submit",
              onClick: onSubmitClick,
            })}
          </div>
        ) : null}
      </div>
    ),
  });
};

return Form(props);
