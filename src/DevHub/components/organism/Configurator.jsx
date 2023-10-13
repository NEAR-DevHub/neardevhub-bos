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

const ValueView = styled.div`
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
    name: "components.atom.toggle",
  },

  string: {
    name: "components.molecule.text-input",
    inputProps: { type: "text" },
  },
};

const defaultFieldsRender = ({ schema, form, isEditable, isUnlocked }) => (
  <>
    {Object.entries(schema).map(
      (
        [key, { format, inputProps, noop, label, order, style, ...fieldProps }],
        idx
      ) => {
        const fieldKey = `${idx}-${key}`,
          fieldValue = form.values[key];

        const fieldType = Array.isArray(fieldValue)
          ? "array"
          : typeof (fieldValue ?? "");

        const isDisabled =
          (noop ?? inputProps.disabled ?? false) || !isUnlocked;

        const viewClassName = [
          (fieldValue?.length ?? 0) > 0 ? "" : "text-muted",
          "m-0",
        ].join(" ");

        return (
          <>
            <div
              className={[
                "d-flex gap-3",
                isEditable || noop ? "d-none" : "",
              ].join(" ")}
              key={fieldKey}
              style={{ order }}
            >
              <label className="fw-bold w-25">{label}</label>

              <ValueView className={[viewClassName, "w-75"].join(" ")}>
                {format !== "markdown" ? (
                  <span>
                    {(fieldType === "array" && format === "comma-separated"
                      ? fieldValue
                          .filter((string) => string.length > 0)
                          .join(", ")
                      : fieldValue
                    )?.toString?.() || "none"}
                  </span>
                ) : (fieldValue?.length ?? 0) > 0 ? (
                  widget("components.molecule.markdown-viewer", {
                    text: fieldValue,
                  })
                ) : (
                  <span>none</span>
                )}
              </ValueView>
            </div>

            {widget(fieldParamsByType[fieldType].name, {
              ...fieldProps,

              className: [
                "w-100",
                fieldProps.className ?? "",
                isEditable && !noop ? "" : "d-none",
              ].join(" "),

              disabled: isDisabled,
              format,
              key: `${fieldKey}--editable`,
              label,
              onChange: form.update({ path: [key] }),
              style: { ...style, order },

              value:
                fieldType === "array" && format === "comma-separated"
                  ? fieldValue.join(", ")
                  : fieldValue,

              inputProps: {
                ...(inputProps ?? {}),
                disabled: isDisabled,

                title:
                  noop ?? false
                    ? "Temporarily disabled due to technical reasons."
                    : inputProps.title,

                ...(fieldParamsByType[fieldType].inputProps ?? {}),
                tabIndex: order,
              },
            })}
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
  externalState,
  fieldsRender: customFieldsRender,
  formatter: toFormatted,
  fullWidth,
  heading,
  isEmbedded,
  isHidden,
  isUnlocked,
  isValid,
  noBorder,
  noFrame,
  onCancel,
  onChange,
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
    isActive: otherProps.isActive ?? false,
  });

  const isActive = otherProps.isActive ?? state.isActive;

  const initialValues = Struct.typeMatch(schema)
    ? Struct.pick(externalState ?? {}, Object.keys(schema))
    : {};

  const form = useForm({ initialValues, onUpdate: onChange, stateKey: "form" });

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
    if (isEmbedded && typeof onSubmit === "function") onSubmit(initialValues);
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
    noBorder,
    noFrame,
    ...otherProps,

    headerSlotRight:
      isUnlocked && !isActive
        ? widget("components.molecule.button", {
            classNames: { root: "btn-sm btn-secondary" },
            icon: { type: "bootstrap_icon", variant: "bi-pen-fill" },
            label: "Edit",
            onClick: () => formToggle(true),
          })
        : null,

    children: (
      <div className="flex-grow-1 d-flex flex-column gap-4">
        <div className={`d-flex flex-column gap-${isActive ? 1 : 4}`}>
          {fieldsRender({
            form,
            isEditable: isUnlocked && isActive,
            isUnlocked,
            schema,
          })}
        </div>

        {!noFrame ? (
          <div
            className={[
              "d-flex align-items-center justify-content-end gap-3 mt-auto",
              isUnlocked && isActive && typeof onChange !== "function"
                ? ""
                : "d-none",
            ].join(" ")}
          >
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
                type: "bootstrap_icon",
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
