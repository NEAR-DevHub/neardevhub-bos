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
