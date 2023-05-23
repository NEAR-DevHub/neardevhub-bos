const formUpdater =
  ({ path }) =>
  ({ field, via }) =>
  (input) =>
    State.update((lastState) => ({
      ...lastState,

      [path]: {
        ...lastState[path],

        [field]:
          typeof via === "function"
            ? via({
                input: input?.target?.value ?? input ?? null,
                lastState,
              })
            : input?.target?.value ?? input ?? null,
      },
    }));
