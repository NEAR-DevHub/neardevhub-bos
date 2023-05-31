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
/* INCLUDE: "shared/lib/gui" */
const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }
`;

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;
/* END_INCLUDE: "shared/lib/gui" */
/* INCLUDE: "shared/lib/uuid" */
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
/* END_INCLUDE: "shared/lib/uuid" */
/* INCLUDE: "shared/mocks" */
const communities = {
  "zero-knowledge": {
    overviewId: 397,
    eventsId: 401,

    icon: "https://ipfs.near.social/ipfs/bafkreiajwq6ep3n7veddozji2djv5vviyisabhycbweslvpwhsoyuzcwi4",

    cover:
      "https://ipfs.near.social/ipfs/bafkreihgxg5kwts2juldaeasveyuddkm6tcabmrat2aaq5u6uyljtyt7lu",

    title: "Zero Knowledge",
    desc: "Building a zero knowledge ecosystem on NEAR.",
    telegram: "NearZeroKnowledge",
  },

  protocol: {
    overviewId: 412,
    eventsId: 413,

    icon: "https://ipfs.near.social/ipfs/bafkreidpitdafcnhkp4uyomacypdgqvxr35jtfnbxa5s6crby7qjk2nv5a",

    cover:
      "https://ipfs.near.social/ipfs/bafkreicg4svzfz5nvllomsahndgm7u62za4sib4mmbygxzhpcl4htqwr4a",

    title: "Protocol",
    desc: "Supporting the ongoing innovation of the NEAR Protocol.",

    integrations: {
      github: {
        kanban: {
          boards: {
            "18855b9c9f2-216091d-6484800b-42593f54-6102b48a": {
              id: "18855b9c9f2-216091d-6484800b-42593f54-6102b48a",

              columns: {
                "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630": {
                  id: "18855f4a93e-76a9b704-14c3ebdb-1e6c0f05-22653630",
                  description: "Lorem ipsum",
                  labelSearchTerms: ["S-draft"],
                  title: "Draft",
                },
              },

              dataTypesIncluded: { Issue: false, PullRequest: true },
              description: "Latest NEAR Enhancement Proposals by status",
              repoURL: "https://github.com/near/NEPs",
              title: "NEAR Protocol NEPs",
            },
          },
        },
      },
    },

    telegram: "NEAR_Protocol_Community_Group",
  },

  tooling: {
    overviewId: 416,
    eventsId: 417,

    icon: "https://ipfs.near.social/ipfs/bafkreie2eaj5czmpfe6pe53kojzcspgozebdsonffwvbxtpuipnwahybvi",

    cover:
      "https://ipfs.near.social/ipfs/bafkreiehzr7z2fhoqqmkt3z667wubccbch6sqtsnvd6msodyzpnf72cszy",

    title: "Tooling",
    desc: "Supporting the ongoing innovation of tooling.",
    telegram: "NEAR_Tools_Community_Group",
  },

  "contract-standards": {
    overviewId: 414,
    eventsId: 415,

    icon: "https://ipfs.near.social/ipfs/bafkreiepgdnu7soc6xgbyd4adicbf3eyxiiwqawn6tguaix6aklfpir634",

    cover:
      "https://ipfs.near.social/ipfs/bafkreiaowjqxds24fwcliyriintjd4ucciprii2rdxjmxgi7f5dmzuscey",

    title: "Contract Standards",
    desc: "Coordinating the contribution to the NEAR dapp standards.",
    telegram: "nearnft",
  },
};
/* END_INCLUDE: "shared/mocks" */

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
  title: "",
};

const GithubIntegrationSetupFrame = ({ label, pageURL }) => {
  const communityGitHubKanbanBoards =
    communities[label].integrations?.github?.kanban?.boards ?? {};

  State.init({
    boardConfig: null,

    editingMode: "form",
    isEditingAllowed: true, // According to user permission level
    isEditorEnabled: false,

    ...Storage.get(
      "state",
      `${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.components.community.CommunityHeader`
    ),
  });

  const onEditorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isEditorEnabled: forcedState ?? !lastKnownState.isEditorEnabled,
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

  const boardsCreateNew = () =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      boardConfig: boardConfigDefaults,
      isEditorEnabled: true,
    }));

  const { formState, formUpdate } = useForm({ stateKey: "boardConfig" });

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

  const form =
    formState !== null ? (
      <>
        <div className="d-flex gap-3 flex-column flex-lg-row">
          <div className="input-group-text border-0 d-flex flex-column flex-1 flex-shrink-0">
            <span id={`${formState.id}-title`}>Title</span>

            <input
              aria-describedby={`${formState.id}-title`}
              className="form-control"
              onChange={formUpdate({ path: ["title"] })}
              placeholder="NEAR Protocol NEPs"
              type="text"
              value={formState.title}
            />
          </div>

          <div
            className={[
              "input-group-text border-0",
              "d-flex flex-column justify-content-evenly flex-4 w-100",
            ].join(" ")}
          >
            <span id={`${formState.id}-repoURL`}>GitHub repository URL</span>

            <input
              aria-describedby={`${formState.id}-repoURL`}
              className="form-control"
              onChange={formUpdate({ path: ["repoURL"] })}
              placeholder="https://github.com/example-org/example-repo"
              type="text"
              value={formState.repoURL}
            />
          </div>
        </div>

        <div className="d-flex gap-3 flex-column flex-lg-row">
          <CompactContainer className="d-flex gap-3 flex-column justify-content-start p-3 ps-0">
            <span
              className="d-inline-flex gap-2"
              id={`${formState.id}-dataTypesIncluded`}
            >
              <i class="bi bi-database-fill" />
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

          <div className="input-group-text border-0 d-flex flex-column w-100">
            <span id={`${formState.id}-description`}>Description</span>

            <textarea
              aria-describedby={`${formState.id}-description`}
              className="form-control h-75"
              onChange={formUpdate({ path: ["description"] })}
              placeholder="Latest NEAR Enhancement Proposals by status."
              type="text"
              value={formState.description}
            />
          </div>
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
                class="d-flex flex-column gap-3 rounded-2 p-3 w-100 bg-secondary bg-opacity-25"
                key={id}
              >
                <div class="d-flex gap-3">
                  <div
                    className="d-flex flex-column flex-grow-1"
                    style={{ width: "inherit" }}
                  >
                    <span id={`${formState.id}-column-${id}-title`}>Title</span>

                    <input
                      aria-describedby={`${formState.id}-column-${id}-title`}
                      className="form-control"
                      onChange={formUpdate({
                        path: ["columns", id, "title"],
                      })}
                      placeholder="👀 Review"
                      type="text"
                      value={title}
                    />
                  </div>

                  <button
                    class="btn btn-outline-danger"
                    onClick={formUpdate({
                      path: ["columns"],
                      via: columnsDeleteById(id),
                    })}
                    title="Delete column"
                  >
                    <i class="bi bi-file-earmark-minus-fill" />
                  </button>
                </div>

                <div
                  className="d-flex flex-column"
                  style={{ width: "inherit" }}
                >
                  <span id={`${formState.id}-column-${id}-description`}>
                    Description
                  </span>

                  <input
                    aria-describedby={`${formState.id}-column-${id}-description`}
                    className="form-control"
                    onChange={formUpdate({
                      path: ["columns", id, "description"],
                    })}
                    placeholder="NEPs that need a review by Subject Matter Experts."
                    type="text"
                    value={description}
                  />
                </div>

                <div
                  className="d-flex flex-column"
                  style={{ width: "inherit" }}
                >
                  <span
                    className="text-wrap"
                    id={`${formState.id}-column-${title}-searchTerms`}
                  >
                    Search terms for all the labels MUST be presented in
                    included tickets, comma-separated
                  </span>

                  <input
                    aria-describedby={`${formState.id}-column-${title}-searchTerms`}
                    aria-label="Search terms for included labels"
                    className="form-control"
                    onChange={formUpdate({
                      path: ["columns", id, "labelSearchTerms"],
                    })}
                    placeholder="WG-, draft, review, proposal, ..."
                    type="text"
                    value={labelSearchTerms.join(", ")}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </>
    ) : null;

  return (
    <div className="d-flex flex-column gap-4">
      {state.isEditorEnabled && formState !== null ? (
        <div
          className={[
            "d-flex flex-column gap-3",
            "border border-2 border-primary rounded-2 p-3 w-100",
          ].join(" ")}
        >
          <div className="d-flex align-items-center justify-content-between gap-3">
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-wrench-adjustable-circle-fill" />
              <span>Board configuration</span>
            </h5>

            {widget("components.atom.button-switch", {
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
              className="btn btn-outline-secondary d-inline-flex gap-2 me-auto"
              disabled={Object.keys(formState.columns).length >= 6}
              onClick={formUpdate({
                path: ["columns"],
                via: columnsCreateNew,
              })}
            >
              <i class="bi bi-plus-lg" />
              <span>New column</span>
            </button>

            <button
              className="btn btn-outline-danger d-inline-flex gap-2 align-items-center"
              onClick={() => onEditorToggle(false)}
              style={{ width: "fit-content" }}
            >
              <span>Cancel</span>
            </button>

            <button
              disabled={!formState.hasChanges}
              className="btn btn-primary d-inline-flex gap-2 align-items-center"
              style={{ width: "fit-content" }}
            >
              <i className="bi bi-file-arrow-up-fill" />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : null}

      {state.boardConfig !== null ? (
        widget("entity.github-repo.board", {
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
            className="btn btn-primary d-inline-flex gap-2"
            onClick={boardsCreateNew}
          >
            <i class="bi bi-kanban-fill" />
            <span>Create board</span>
          </button>
        </div>
      )}
    </div>
  );
};

return GithubIntegrationSetupFrame(props);
