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
/* INCLUDE: "core/lib/form" */
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
/* END_INCLUDE: "core/lib/form" */
/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */
/* INCLUDE: "core/lib/uuid" */
const uuid = () =>
  [Date.now().toString(16)]
    .concat(
      Array.from(
        { length: 4 },
        () => Math.floor(Math.random() * 0xffffffff) & 0xffffffff
      ).map((value) => value.toString(16))
    )
    .join("-");

const uuidIndexed = (data) => {
  const id = uuid();

  return Object.fromEntries([[id, { ...data, id }]]);
};
/* END_INCLUDE: "core/lib/uuid" */
/* INCLUDE: "core/adapter/dev-hub" */
const contractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  edit_community_github: ({ handle, github }) =>
    Near.call(contractAccountId, "edit_community_github", { handle, github }) ??
    null,

  get_access_control_info: () =>
    Near.view(contractAccountId, "get_access_control_info") ?? null,

  get_all_authors: () =>
    Near.view(contractAccountId, "get_all_authors") ?? null,

  get_all_communities: () =>
    Near.view(contractAccountId, "get_all_communities") ?? null,

  get_all_labels: () => Near.view(contractAccountId, "get_all_labels") ?? null,

  get_community: ({ handle }) =>
    Near.view(contractAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(contractAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(contractAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(contractAccountId, "get_root_members") ?? null,

  useQuery: ({ name, params, initialData }) => {
    const initialState = { data: null, error: null, isLoading: true };

    return useCache(
      () =>
        Near.asyncView(contractAccountId, name, params ?? {})
          .then((response) => ({
            ...initialState,

            data:
              (initialData ?? null) !== null
                ? { ...initialData, ...(response ?? {}) }
                : response ?? null,

            error: null,
            isLoading: false,
          }))
          .catch((error) => ({
            data: initialData ?? initialState.data,
            error,
            isLoading: false,
          })),
      name,
      { subscribe: true }
    );
  },
};
/* END_INCLUDE: "core/adapter/dev-hub" */

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const dataTypesLocked = {
  Issue: true,
  PullRequest: true,
};

const boardConfigDefaults = {
  id: uuid(),
  columns: {},
  dataTypesIncluded: { Issue: false, PullRequest: true },
  description: "",
  repoURL: "",
  ticketState: "all",
  title: "",
};

const GithubKanbanBoardEditor = ({ communityHandle, pageURL }) => {
  const communityData = DevHub.get_community({ handle: communityHandle });

  if (communityData === null) {
    return <div>Loading...</div>;
  }

  const communityGitHubKanbanBoards =
    JSON.parse(communityData.github)?.kanbanBoards ?? {};

  State.init({
    boardConfig: null,
    editingMode: "form",
    isEditingAllowed: true, // According to user permission level
    isEditorActive: false,
  });

  const onEditorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isEditorActive: forcedState ?? !lastKnownState.isEditorActive,
    }));

  const onEditingModeChange = ({ target: { value } }) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      editingMode: value,
    }));

  if (
    state.boardConfig === null &&
    Object.keys(communityGitHubKanbanBoards).length > 0
  ) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      boardConfig: Object.values(communityGitHubKanbanBoards)[0],
    }));
  }

  const { formState, formUpdate } = useForm({ stateKey: "boardConfig" });

  const boardsCreateNew = () =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      boardConfig: boardConfigDefaults,
      isEditorActive: true,
    }));

  const columnsCreateNew = ({ lastKnownState }) =>
    Object.keys(lastKnownState).length < 6
      ? {
          ...lastKnownState,

          ...uuidIndexed({
            description: "",
            labelSearchTerms: [],
            title: "New column",
          }),
        }
      : lastKnownState;

  const columnsDeleteById =
    (id) =>
    ({ lastKnownState }) =>
      Object.fromEntries(
        Object.entries(lastKnownState).filter(([columnId]) => columnId !== id)
      );

  const onSubmit = () =>
    DevHub.edit_community_github({
      handle: communityHandle,

      github: JSON.stringify({
        kanbanBoards: {
          ...communityGitHubKanbanBoards,
          [formState.id]: formState,
        },
      }),
    });

  const form =
    formState !== null ? (
      <>
        <div className="d-flex gap-3 flex-column flex-lg-row">
          {widget(
            "components.molecule.text-input",
            {
              className: "flex-shrink-0",
              key: `${formState.id}-title`,
              label: "Title",
              onChange: formUpdate({ path: ["title"] }),
              placeholder: "NEAR Protocol NEPs",
              value: formState.title,
            },
            `${formState.id}-title`
          )}

          {widget("components.molecule.text-input", {
            className: "w-100",
            key: `${formState.id}-repoURL`,
            label: "GitHub repository URL",
            onChange: formUpdate({ path: ["repoURL"] }),
            placeholder: "https://github.com/example-org/example-repo",
            value: formState.repoURL,
          })}
        </div>

        <div className="d-flex gap-3 flex-column flex-lg-row">
          <CompactContainer className="d-flex gap-3 flex-column justify-content-start p-2">
            <span
              className="d-inline-flex gap-2"
              id={`${formState.id}-dataTypesIncluded`}
            >
              <i className="bi bi-database-fill" />
              <span>Tracked data</span>
            </span>

            {Object.entries(formState.dataTypesIncluded).map(
              ([typeName, enabled]) =>
                widget(
                  "components.atom.toggle",

                  {
                    active: enabled,
                    className: "w-100",
                    disabled: dataTypesLocked[typeName],
                    key: typeName,
                    label: typeName,

                    onSwitch: formUpdate({
                      path: ["dataTypesIncluded", typeName],
                    }),
                  },

                  typeName
                )
            )}
          </CompactContainer>

          <CompactContainer className="d-flex gap-3 flex-column justify-content-start p-2">
            <span
              className="d-inline-flex gap-2"
              id={`${formState.id}-dataTypesIncluded`}
            >
              <i class="bi bi-database-fill" />
              <span>Ticket state</span>
            </span>

            {widget("components.molecule.button-switch", {
              currentValue: formState.ticketState,
              key: "ticketState",
              onChange: formUpdate({ path: ["ticketState"] }),

              options: [
                { label: "All", value: "all" },
                { label: "Open", value: "open" },
                { label: "Closed", value: "closed" },
              ],

              title: "Editing mode selection",
            })}
          </CompactContainer>

          {widget("components.molecule.text-input", {
            className: "w-100",
            inputProps: { className: "h-75" },
            key: `${formState.id}-description`,
            label: "Description",
            multiline: true,
            onChange: formUpdate({ path: ["description"] }),
            placeholder: "Latest NEAR Enhancement Proposals by status.",
            value: formState.description,
          })}
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <span className="d-inline-flex gap-2 m-0">
            <i className="bi bi-list-task" />
            <span>Columns ( max. 6 )</span>
          </span>
        </div>

        <div className="d-flex flex-column align-items-center gap-3">
          {Object.values(formState.columns).map(
            ({ id, description, labelSearchTerms, title }) => (
              <div
                className="d-flex gap-3 border border-secondary rounded-4 p-3 w-100"
                key={id}
              >
                <div className="d-flex flex-column gap-1 w-100">
                  {widget("components.molecule.text-input", {
                    className: "flex-grow-1",
                    key: `${formState.id}-column-${id}-title`,
                    label: "Title",
                    onChange: formUpdate({ path: ["columns", id, "title"] }),
                    placeholder: "👀 Review",
                    value: title,
                  })}

                  {widget("components.molecule.text-input", {
                    className: "flex-grow-1",
                    key: `${formState.id}-column-${id}-description`,
                    label: "Description",

                    onChange: formUpdate({
                      path: ["columns", id, "description"],
                    }),

                    placeholder:
                      "NEPs that need a review by Subject Matter Experts.",

                    value: description,
                  })}

                  {widget("components.molecule.text-input", {
                    format: "comma-separated",
                    key: `${formState.id}-column-${title}-labelSearchTerms`,

                    label: `Search terms for all the labels
											MUST be presented in included tickets`,

                    onChange: formUpdate({
                      path: ["columns", id, "labelSearchTerms"],
                    }),

                    placeholder: "WG-, draft, review, proposal, ...",
                    value: labelSearchTerms.join(", "),
                  })}
                </div>

                <div
                  className="d-flex flex-column gap-3 border-start p-3 pe-0"
                  style={{ marginTop: -16, marginBottom: -16 }}
                >
                  <button
                    className="btn btn-outline-danger shadow"
                    onClick={formUpdate({
                      path: ["columns"],
                      via: columnsDeleteById(id),
                    })}
                    title="Delete column"
                  >
                    <i className="bi bi-trash-fill" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </>
    ) : null;

  return (
    <div className="d-flex flex-column gap-4">
      {state.isEditorActive && formState !== null ? (
        <AttractableDiv className="d-flex flex-column gap-3 p-3 w-100 rounded-4">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-wrench-adjustable-circle-fill" />
              <span>Board configuration</span>
            </h5>

            {widget("components.molecule.button-switch", {
              currentValue: state.editingMode,
              key: "editingMode",
              onChange: onEditingModeChange,

              options: [
                { label: "Form", value: "form" },
                { label: "JSON", value: "JSON" },
              ],

              title: "Editing mode selection",
            })}
          </div>

          {state.editingMode === "form" ? (
            form
          ) : (
            <div className="d-flex flex-column flex-grow-1 border-0 bg-transparent w-100">
              <textarea
                className="form-control"
                disabled
                rows="12"
                type="text"
                value={JSON.stringify(formState, null, "\t")}
              />
            </div>
          )}

          <div className="d-flex align-items-center justify-content-end gap-3">
            <button
              className="btn shadow btn-outline-secondary d-inline-flex gap-2 me-auto"
              disabled={Object.keys(formState.columns).length >= 6}
              onClick={formUpdate({ path: ["columns"], via: columnsCreateNew })}
            >
              <i className="bi bi-plus-lg" />
              <span>New column</span>
            </button>

            <button
              className="btn btn-outline-danger border-0 d-inline-flex gap-2 align-items-center"
              onClick={() => onEditorToggle(false)}
              style={{ width: "fit-content" }}
            >
              <span>Cancel</span>
            </button>

            <button
              disabled={false}
              className="btn shadow btn-success d-inline-flex gap-2 align-items-center"
              onClick={onSubmit}
              style={{ width: "fit-content" }}
            >
              <i className="bi bi-cloud-arrow-up-fill" />
              <span>Save</span>
            </button>
          </div>
        </AttractableDiv>
      ) : null}

      {state.boardConfig !== null ? (
        widget("entity.team-board.github-kanban", {
          ...state.boardConfig,
          editorTrigger: () => onEditorToggle(true),
          isEditable: state.isEditingAllowed,
          pageURL,
        })
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center gap-4"
          style={{ height: 384 }}
        >
          <h5 className="h5 d-inline-flex gap-2 m-0">
            This community doesn't have GitHub integrations
          </h5>

          <button
            className="btn shadow btn-primary d-inline-flex gap-2"
            onClick={boardsCreateNew}
          >
            <i className="bi bi-kanban-fill" />
            <span>Create board</span>
          </button>
        </div>
      )}
    </div>
  );
};

return GithubKanbanBoardEditor(props);
