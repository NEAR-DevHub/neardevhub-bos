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

    case "object": {
      if (Array.isArray(input) && typeof lastKnownValue === "string") {
        return input.join(arrayDelimiter ?? ",");
      } else {
        return Array.isArray(lastKnownValue)
          ? [...lastKnownValue, ...input]
          : { ...lastKnownValue, ...input };
      }
    }

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

const useForm = ({ initialValues, onUpdate, stateKey, uninitialized }) => {
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

      if (
        typeof onUpdate === "function" &&
        !Struct.isEqual(updatedValues, initialFormState.values)
      ) {
        onUpdate(updatedValues);
      }
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

// Helper function to determine field type
const getFieldType = (fieldValue) => {
  if (Array.isArray(fieldValue)) return "array";
  return typeof (fieldValue ?? "");
};

// Helper function to format field value based on type and format
const formatFieldValue = (fieldType, format, fieldValue, arrayDelimiter) => {
  if (fieldType === "array" && format === "comma-separated") {
    return fieldValue
      .filter((string) => string.length > 0)
      .join(arrayDelimiter ?? ",");
  }
  return fieldValue;
};

function FormFields({ schema, form, isEditable }) {
  // Render a single form field
  const renderFormField = ({ fieldKey, fieldConfig, form, isEditable }) => {
    const { format, inputProps, label, order, style, ...fieldProps } =
      fieldConfig;
    const fieldType = getFieldType(form.values[fieldKey]);
    const isMarkdown = format === "markdown";
    const value = formatFieldValue(fieldType, format, form.values[fieldKey]);

    if (isEditable) {
      // Render editable field
      return widget(fieldParamsByType[fieldType].name, {
        ...fieldProps,
        className: "w-100",
        format,
        key: `${fieldKey}`,
        label,
        onChange: form.update({ path: [fieldKey] }),
        style: { ...style, order },
        value,
        inputProps: {
          ...(inputProps ?? {}),
          ...(fieldParamsByType[fieldType].inputProps ?? {}),
          tabIndex: order,
        },
      });
    } else {
      // Render non-editable field
      const contentDisplayClassName =
        (form.values[fieldKey]?.length ?? 0) > 0 ? "" : "text-muted";
      return (
        <div className="d-flex gap-3" key={`${fieldKey}`} style={{ order }}>
          <label className="fw-bold w-25">{label}</label>
          <ValueWrapper className={[contentDisplayClassName, "w-75"].join(" ")}>
            {!isMarkdown ? (
              <span>{value?.toString?.() || "none"}</span>
            ) : (form.values[fieldKey]?.length ?? 0) > 0 ? (
              widget("components.molecule.markdown-viewer", {
                text: form.values[fieldKey],
              })
            ) : (
              <span>none</span>
            )}
          </ValueWrapper>
        </div>
      );
    }
  };

  return (
    <div className={`d-flex flex-column ${!isEditable && "gap-4"}`}>
      {Object.entries(schema).map(([fieldKey, fieldConfig], idx) => (
        <div key={idx}>
          {renderFormField({ fieldKey, fieldConfig, form, isEditable })}
        </div>
      ))}
    </div>
  );
}

const Configurator = ({
  actionsAdditional,
  cancelLabel,
  classNames,
  data,
  isValid,
  onCancel,
  onSubmit,
  schema,
  isEditActive,
  submitIcon,
  submitLabel,
}) => {
  const initialValues = Struct.typeMatch(schema)
    ? Struct.pick(data ?? {}, Object.keys(schema))
    : {};

  const form = useForm({ initialValues, stateKey: "form" });

  const formFormattedValues =
    typeof toFormatted === "function" ? toFormatted(form.values) : form.values;

  const isFormValid =
    typeof isValid === "function" ? isValid(formFormattedValues) : true;

  const onCancelClick = () => {
    form.reset();
    if (typeof onCancel === "function") onCancel();
  };

  const onSubmitClick = () => {
    if (typeof onSubmit === "function" && isFormValid) {
      onSubmit(formFormattedValues);
    }
  };

  return (
    <>
      <FormFields form={form} isEditable={isEditActive} schema={schema} />
      {isEditActive && (
        <div className="d-flex align-items-center justify-content-end gap-3 mt-auto">
          {actionsAdditional && (
            <div className="me-auto">{actionsAdditional}</div>
          )}

          {widget("components.molecule.button", {
            classNames: { root: "btn-outline-danger shadow-none border-0" },
            label: cancelLabel ?? "Reset",
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
      )}
    </>
  );
};

return Configurator(props);
