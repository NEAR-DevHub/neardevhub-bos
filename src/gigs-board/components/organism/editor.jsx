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
/* INCLUDE: "core/lib/hashmap" */
const HashMap = {
  isDefined: (input) =>
    input !== null && typeof input === "object" && !Array.isArray(input),

  isEqual: (input1, input2) =>
    HashMap.isDefined(input1) && HashMap.isDefined(input2)
      ? JSON.stringify(HashMap.toOrdered(input1)) ===
        JSON.stringify(HashMap.toOrdered(input2))
      : false,

  toOrdered: (input) =>
    Object.keys(input)
      .sort()
      .reduce((output, key) => ({ ...output, [key]: input[key] }), {}),

  pick: (object, subsetKeys) =>
    Object.fromEntries(
      Object.entries(object ?? {}).filter(([key, _]) =>
        subsetKeys.includes(key)
      )
    ),
};
/* END_INCLUDE: "core/lib/hashmap" */
/* INCLUDE: "core/lib/gui/form" */
const withUpdatedField = (
  node,
  { input, params, path: [nextNodeKey, ...remainingPath], via: updater }
) => ({
  ...node,

  [nextNodeKey]:
    remainingPath.length > 0
      ? withUpdatedField(
          typeof node[nextNodeKey] === "object"
            ? node[nextNodeKey]
            : {
                ...((node[nextNodeKey] ?? null) !== null
                  ? { __archivedLeaf__: node[nextNodeKey] }
                  : {}),
              },

          { input, path: remainingPath, via: updater }
        )
      : updater({
          input,
          lastKnownValue: node[nextNodeKey],
          params,
        }),
});

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
    isSynced = HashMap.isEqual(
      formState?.values ?? {},
      initialFormState.values
    );

  const formReset = () =>
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [formStateKey]: initialFormState,
      hasUnsubmittedChanges: false,
    }));

  const formUpdate =
    ({ path, via: customFieldUpdate, ...params }) =>
    (fieldInput) => {
      const updatedFormValues = withUpdatedField(
        lastKnownComponentState[formStateKey].values,

        {
          input: fieldInput?.target?.value ?? fieldInput,
          path,

          via:
            typeof customFieldUpdate === "function"
              ? customFieldUpdate
              : defaultFieldUpdate,

          params,
        }
      );

      State.update((lastKnownComponentState) => ({
        ...lastKnownComponentState,

        [formStateKey]: {
          hasUnsubmittedChanges: !HashMap.isEqual(
            updatedFormValues,
            initialFormState.values
          ),

          values: updatedFormValues,
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

const defaultFieldsRender = ({ schema, form, isEditable }) => (
  <>
    {Object.entries(schema).map(
      (
        [fieldKey, { format, inputProps, label, order, style, ...fieldProps }],
        idx
      ) => {
        const contentDisplayClassName = [
          (form.values[fieldKey]?.length ?? 0) > 0 ? "" : "text-muted",
          "m-0",
        ].join(" ");

        const fieldType = Array.isArray(form.values[fieldKey])
          ? "array"
          : typeof (form.values[fieldKey] ?? "");

        return (
          <>
            {!isEditable ? (
              <div
                className="d-flex gap-3"
                key={`${idx}-${fieldKey}`}
                style={{ order }}
              >
                <label className="fw-bold w-25">{label}</label>

                {format !== "markdown" ? (
                  <p className={[contentDisplayClassName, "w-75"].join(" ")}>
                    {(fieldType === "array"
                      ? form.values[fieldKey]
                          .filter((string) => string.length > 0)
                          .join(", ")
                      : form.values[fieldKey]
                    )?.toString?.() || "none"}
                  </p>
                ) : (
                  <p className={[contentDisplayClassName, "w-75"].join(" ")}>
                    {(form.values[fieldKey]?.length ?? 0) > 0 ? (
                      <Markdown text={form.values[fieldKey]} />
                    ) : (
                      "none"
                    )}
                  </p>
                )}
              </div>
            ) : (
              widget(fieldParamsByType[fieldType].name, {
                ...fieldProps,
                className: "w-100",
                format,
                key: `${idx}-${fieldKey}--editable`,
                label,
                onChange: form.update({ path: [fieldKey] }),
                style: { ...style, order },

                value:
                  fieldType === "array"
                    ? form.values[fieldKey].join(", ")
                    : form.values[fieldKey],

                inputProps: {
                  ...(inputProps ?? {}),

                  ...(fieldParamsByType[typeof form.values[fieldKey]]
                    .inputProps ?? {}),
                },
              })
            )}
          </>
        );
      }
    )}
  </>
);

const Editor = ({
  actionsAdditional,
  cancelLabel,
  classNames,
  data,
  fieldsRender: customFieldsRender,
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
    typeof customFieldsRender === "function"
      ? customFieldsRender
      : defaultFieldsRender;

  const initialValues =
    schema !== null && typeof schema === "object"
      ? HashMap.pick(data ?? {}, Object.keys(schema))
      : {};

  State.init({
    isEditorActive: isEditorActive ?? false,
  });

  const form = useForm({ initialValues, stateKey: "form" });

  const editorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isEditorActive: forcedState ?? !lastKnownState.isEditorActive,
    }));

  const onCancelClick = () => {
    form.reset();
    editorToggle(false);
    if (typeof onSubmit === "function") onSubmit(initialValues);
    if (typeof onCancel === "function") onCancel();
  };

  const onSubmitClick = () => {
    editorToggle(false);
    if (typeof onSubmit === "function") onSubmit(form.values);
  };

  return widget("components.molecule.tile", {
    className: classNames.root,
    heading,
    noFrame: noEditorFrame,

    headerSlotRight:
      isMutable && !state.isEditorActive
        ? widget("components.atom.button", {
            classNames: {
              root: "btn-sm btn-secondary",
              adornment: "bi bi-pen-fill",
            },

            label: "Edit",
            onClick: () => editorToggle(true),
          })
        : null,

    children: (
      <div className="flex-grow-1 d-flex flex-column gap-3">
        <div
          className={`d-flex flex-column gap-${state.isEditorActive ? 1 : 4}`}
        >
          {fieldsRender({
            form,
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
              label: cancelLabel ?? "Cancel",
              onClick: onCancelClick,
            })}

            {widget("components.atom.button", {
              classNames: {
                root: classNames.submit ?? "btn-success",
                adornment: `bi ${classNames.submitAdornment}`,
              },

              disabled: !form.hasUnsubmittedChanges,
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

return Editor(props);
