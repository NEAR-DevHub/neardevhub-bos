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

const useForm = ({
  initialValues: initialFormValues,
  stateKey: formStateKey,
}) => {
  const formInitialState = {
    hasUnsubmittedChanges: false,
    values: initialFormValues ?? {},
  };

  const { hasUnsubmittedChanges, values } =
    state[formStateKey] ?? formInitialState;

  if ((state[formStateKey] ?? null) === null) {
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [formStateKey]: formInitialState,
    }));
  }

  return {
    hasUnsubmittedChanges,

    reset: () =>
      State.update((lastKnownComponentState) => ({
        ...lastKnownComponentState,
        [formStateKey]: formInitialState,
        hasUnsubmittedChanges: false,
      })),

    update:
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
              initialFormValues
            ),

            values: updatedFormValues,
          },
        }));
      },

    values,
  };
};
