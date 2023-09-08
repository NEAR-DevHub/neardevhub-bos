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
/* INCLUDE: "core/lib/struct" */
const Struct = {
  deepFieldUpdate: (
    node,
    { input, params, path: [nextNodeKey, ...remainingPath], via: toFieldValue }
  ) => ({
    ...node,

    [nextNodeKey]:
      remainingPath.length > 0
        ? Struct.deepFieldUpdate(
            Struct.typeMatch(node[nextNodeKey]) ||
              Array.isArray(node[nextNodeKey])
              ? node[nextNodeKey]
              : {
                  ...((node[nextNodeKey] ?? null) !== null
                    ? { __archivedLeaf__: node[nextNodeKey] }
                    : {}),
                },

            { input, path: remainingPath, via: toFieldValue }
          )
        : toFieldValue({
            input,
            lastKnownValue: node[nextNodeKey],
            params,
          }),
  }),

  isEqual: (input1, input2) =>
    Struct.typeMatch(input1) && Struct.typeMatch(input2)
      ? JSON.stringify(Struct.toOrdered(input1)) ===
        JSON.stringify(Struct.toOrdered(input2))
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

  typeMatch: (input) =>
    input !== null && typeof input === "object" && !Array.isArray(input),
};
/* END_INCLUDE: "core/lib/struct" */
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

const useForm = ({ initialValues, stateKey, uninitialized }) => {
  const initialFormState = {
    hasUnsubmittedChanges: false,
    values: initialValues ?? {},
  };

  const formState = state[stateKey] ?? null,
    isSynced = Struct.isEqual(formState?.values ?? {}, initialFormState.values);

  const formReset = () =>
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [stateKey]: initialFormState,
      hasUnsubmittedChanges: false,
    }));

  const formUpdate =
    ({ path, via: customFieldUpdate, ...params }) =>
    (fieldInput) => {
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

        [stateKey]: {
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
    (formState === null || (!formState.hasUnsubmittedChanges && !isSynced))
  ) {
    formReset();
  }

  return {
    ...(formState ?? initialFormState),
    isSynced,
    reset: formReset,
    stateKey,
    update: formUpdate,
  };
};
/* END_INCLUDE: "core/lib/gui/form" */

const ValueWrapper = styled.div`
  & > p {
    margin: 0;
  }
`;

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

        let fieldType;
        if (Array.isArray(form.values[fieldKey])) {
          fieldType = "array";
        } else {
          fieldType = typeof (form.values[fieldKey] ?? "");
        }

        return (
          <>
            {!isEditable ? (
              <div
                className="d-flex gap-3"
                key={`${idx}-${fieldKey}`}
                style={{ order }}
              >
                <label className="fw-bold w-25">{label}</label>

                <ValueWrapper
                  className={[contentDisplayClassName, "w-75"].join(" ")}
                >
                  {format !== "markdown" ? (
                    <span>
                      {(fieldType === "array" && format === "comma-separated"
                        ? form.values[fieldKey]
                            .filter((string) => string.length > 0)
                            .join(", ")
                        : form.values[fieldKey]
                      )?.toString?.() || "none"}
                    </span>
                  ) : (form.values[fieldKey]?.length ?? 0) > 0 ? (
                    widget("components.molecule.markdown-viewer", {
                      text: form.values[fieldKey],
                    })
                  ) : (
                    <span>none</span>
                  )}
                </ValueWrapper>
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
                  fieldType === "array" && format === "comma-separated"
                    ? form.values[fieldKey].join(", ")
                    : form.values[fieldKey],

                inputProps: {
                  ...(inputProps ?? {}),
                  ...(fieldParamsByType[fieldType].inputProps ?? {}),
                  tabIndex: order,
                },
              })
            )}
          </>
        );
      }
    )}
  </>
);

const Configurator = ({
  actionsAdditional,
  cancelLabel,
  classNames,
  data,
  fieldsRender: customFieldsRender,
  formatter: toFormatted,
  fullWidth,
  heading,
  isActive,
  isHidden,
  isSubform,
  isUnlocked,
  isValid,
  noFrame,
  onCancel,
  onSubmit,
  schema,
  submitIcon,
  submitLabel,
  ...otherProps
}) => {
  const fieldsRender =
    typeof customFieldsRender === "function"
      ? customFieldsRender
      : defaultFieldsRender;

  State.init({
    isActive: isActive ?? false,
  });

  const initialValues = Struct.typeMatch(schema)
    ? Struct.pick(data ?? {}, Object.keys(schema))
    : {};

  const form = useForm({ initialValues, stateKey: "form" });

  const formFormattedValues =
    typeof toFormatted === "function" ? toFormatted(form.values) : form.values;

  const isFormValid =
    typeof isValid === "function" ? isValid(formFormattedValues) : true;

  const formToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isActive: forcedState ?? !lastKnownState.isActive,
    }));

  const onCancelClick = () => {
    if (!isActive) formToggle(false);
    form.reset();
    if (isSubform && typeof onSubmit === "function") onSubmit(initialValues);
    if (typeof onCancel === "function") onCancel();
  };

  const onSubmitClick = () => {
    if (typeof onSubmit === "function" && isFormValid) {
      onSubmit(formFormattedValues);
    }

    formToggle(false);
  };

  return widget("components.molecule.tile", {
    className: classNames.root,
    fullWidth,
    heading,
    isHidden,
    noFrame,
    ...otherProps,

    headerSlotRight:
      isUnlocked && !state.isActive
        ? widget("components.molecule.button", {
            classNames: { root: "btn-sm btn-secondary" },
            icon: { kind: "bootstrap-icon", variant: "bi-pen-fill" },
            label: "Edit",
            onClick: () => formToggle(true),
          })
        : null,

    children: (
      <div className="flex-grow-1 d-flex flex-column gap-4">
        <div
          className={`d-flex flex-column gap-${state.isActive ? 1 : 4} py-1`}
        >
          {fieldsRender({
            form,
            isEditable: isUnlocked && state.isActive,
            schema,
          })}
        </div>

        {!noFrame && isUnlocked && state.isActive ? (
          <div className="d-flex align-items-center justify-content-end gap-3 mt-auto">
            {actionsAdditional ? (
              <div className="me-auto">{actionsAdditional}</div>
            ) : null}

            {widget("components.molecule.button", {
              classNames: { root: "btn-outline-danger shadow-none border-0" },
              label: cancelLabel ?? "Cancel",
              onClick: onCancelClick,
            })}

            {widget("components.molecule.button", {
              classNames: { root: classNames.submit ?? "btn-success" },
              disabled: !form.hasUnsubmittedChanges || !isFormValid,

              icon: submitIcon ?? {
                kind: "bootstrap-icon",
                variant: "bi-check-circle-fill",
              },

              label: submitLabel ?? "Submit",
              onClick: onSubmitClick,
            })}
          </div>
        ) : null}
      </div>
    ),
  });
};

return Configurator(props);
