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

const CommunityEditorBasicInfoSection = ({ data, isEditingAllowed }) => {
  return widget("components.organism.form", {
    actionLabelSubmit: data?.handle ? "Save" : "Next",
    heading: "Basic information",
    initialState: data,
    isMutable: isEditingAllowed,
    onSubmit: () => null,

    fieldsRender: ({
      formState,
      formUpdate,
      isEditorActive,
      isMutable,
    }) => (
      <>
        {(!isMutable || !isEditorActive) ? (
          <div>{formState.name}</div>
        ) : (
          widget("components.molecule.text-input", {
            className: "w-100",
            key: `${formState.handle}-name`,
            label: "Community name",
            onChange: formUpdate({ path: ["name"] }),
            value: formState.name,
          })
        )}

				{(!isMutable || !isEditorActive) ? (
					<div>{formState.name}</div>
				) : (
					widget("components.molecule.text-input", {
						className: "w-100",
						key: `${formState.handle}-name`,
						label: "Community name",
						onChange: formUpdate({ path: ["name"] }),
						value: formState.name,
					})
				)}

				{(!isMutable || !isEditorActive) ? (
					<div>{formState.name}</div>
				) : (
					widget("components.molecule.text-input", {
						className: "w-100",
						key: `${formState.handle}-name`,
						label: "Community name",
						onChange: formUpdate({ path: ["name"] }),
						value: formState.name,
					})
				)}

				{(!isMutable || !isEditorActive) ? (
					<div>{formState.name}</div>
				) : (
					widget("components.molecule.text-input", {
						className: "w-100",
						key: `${formState.handle}-name`,
						label: "Community name",
						onChange: formUpdate({ path: ["name"] }),
						value: formState.name,
					})
				)}
      </>
    ),
  });
};

return CommunityEditorBasicInfoSection(props);
