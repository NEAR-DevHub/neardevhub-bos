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
}) => {
  console.log("traversalUpdate INPUT >>>>>>>>>", input);

  return {
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
  };
};

const fieldDefaultUpdate = ({
  input,
  lastKnownState,
  params: { stringToArrayBy },
}) => {
  console.log("fieldDefaultUpdate INPUT >>>>>>>>>", input);
  console.log("fieldDefaultUpdate LAST_KNOWN_STATE >>>>>>>>>", lastKnownState);

  if (typeof input === "string") {
    return Array.isArray(lastKnownState)
      ? input.split(stringToArrayBy ?? ",").map((string) => string.trim())
      : input;
  } else if ((input ?? null) === null) {
    switch (typeof lastKnownState) {
      case "boolean": {
        return !lastKnownState;
      }

      default: {
        return input;
      }
    }
  }
};

const useForm = ({ stateKey: formStateKey }) => ({
  /**
   * TODO: Also output `formState: state[formStateKey]` if it doesn't break the VM
   */

  formUpdate:
    ({ path: fieldPath, via: fieldCustomUpdate, ...params }) =>
    (fieldInput) =>
      State.update((lastKnownState) => {
        console.log("FIELD INPUT >>>>>>>>>", fieldInput);

        return traversalUpdate({
          input: fieldInput?.target?.value ?? fieldInput,
          target: lastKnownState,
          path: [formStateKey, ...fieldPath],
          params,

          via:
            typeof fieldCustomUpdate === "function"
              ? fieldCustomUpdate
              : fieldDefaultUpdate,
        });
      }),
});
