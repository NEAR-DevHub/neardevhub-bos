const formUpdater =
  ({ path }) =>
  ({ field, via }) =>
  (input) =>
    State.update((lastState) => ({
      ...lastState,

      [path]: {
        ...lastState[path],
        hasChanges: true,

        [field]:
          typeof via === "function"
            ? via({
                input: input?.target?.value ?? input ?? null,
                lastFieldState: lastState[path][field],
              })
            : input?.target?.value ?? input ?? null,
      },
    }));
