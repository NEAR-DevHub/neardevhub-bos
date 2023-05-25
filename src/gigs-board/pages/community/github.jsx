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
/* INCLUDE: "shared/mocks" */
/**
 * Reads a board config from DevHub contract storage.
 * Currently a mock.
 *
 * Boards are indexed by their ids.
 */
const boardConfigByBoardId = ({ boardId }) => ({
  id: boardId,

  columns: {
    [uuid()]: {
      description: "Lorem ipsum",
      labelTerms: ["S-draft"],
      title: "Draft",
    },
  },

  dataTypes: {
    Issue: { enabled: false, locked: true },
    PullRequest: { enabled: true, locked: true },
  },

  description: "Latest NEAR Enhancement Proposals by status",
  repoURL: "https://github.com/near/NEPs",
  title: "NEAR Protocol NEPs",
});
/* END_INCLUDE: "shared/mocks" */
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
/* END_INCLUDE: "shared/lib/uuid" */

const GithubPage = ({ boardId, label }) => {
  State.init({
    boardConfig: {
      id: uuid(),
      columns: {},

      dataTypes: {
        Issue: { enabled: false, locked: true },
        PullRequest: { enabled: true, locked: true },
      },

      description: "Latest NEAR Enhancement Proposals by status",
      repoURL: "https://github.com/near/NEPs",
      title: "NEAR Protocol NEPs",
    },

    isEditorEnabled: false,
    ...Storage.get(
      "state",
      `${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.components.community.CommunityHeader`
    ),
  });

  const { formState, formUpdate } = useForm({ stateKey: "boardConfig" });

  console.log(formState);

  const onEditorToggle = () =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isEditorEnabled: !lastKnownState.isEditorEnabled,
    }));

  const columnsCreateNew = ({ lastKnownState }) => {
    if (Object.keys(lastKnownState).length < 6) {
      const id = uuid();

      return {
        ...lastKnownState,
        [id]: { id, description: "", labelTerms: [], title: "New column" },
      };
    }
  };

  return widget("components.community.Layout", {
    label,
    tab: "GitHub",
    children: (
      <div className="d-flex flex-column gap-5">
        {widget("components.toggle", {
          active: state.isEditorEnabled,

          className: [
            "position-fixed",
            "d-flex justify-content-center align-items-center",
            "shadow-md rounded-pill p-4",
          ].join(" "),

          direction: "rtl",
          key: "editor-toggle",
          label: "Editor mode",
          onSwitch: onEditorToggle,

          style: {
            zIndex: 99,
            right: 24,
            bottom: 24,
            backgroundColor: "#f3f3f3",
          },
        })}

        {state.isEditorEnabled ? (
          <div
            className={[
              "d-flex flex-column gap-3",
              "border border-2 border-primary rounded-2 p-3 w-100",
            ].join(" ")}
          >
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-kanban-fill" />
              <span>{formState.title} board configuration</span>
            </h5>

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
                <span id={`${formState.id}-repoURL`}>
                  GitHub repository URL
                </span>

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
                  id={`${formState.id}-dataTypes`}
                >
                  <i class="bi bi-database-fill" />
                  <span>Tracked data</span>
                </span>

                {Object.entries(formState.dataTypes).map(
                  ([typeName, { enabled, locked }]) =>
                    widget(
                      "components.toggle",
                      {
                        active: enabled,
                        className: "w-100",
                        disabled: locked,
                        key: typeName,
                        label: typeName,

                        onSwitch: formUpdate({
                          path: ["dataTypes", typeName, "enabled"],
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
                ({ id, description, labelTerms, title }) => (
                  <div
                    class="d-flex flex-column gap-3 rounded-2 p-3 w-100 bg-secondary bg-opacity-25"
                    key={id}
                  >
                    <div className="d-flex flex-column flex-lg-row gap-3 align-items-center w-100">
                      <div className="d-flex flex-column flex-grow-1 flex-md-grow-0 flex-shrink-0">
                        <span id={`${formState.id}-column-${id}-title`}>
                          Title
                        </span>

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

                      <div className="d-flex flex-column flex-grow-1 border-0 bg-transparent w-100">
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
                    </div>

                    <div
                      className="d-flex flex-column"
                      style={{ width: "inherit" }}
                    >
                      <span
                        className="text-wrap"
                        id={`${formState.id}-column-${title}-searchTerms`}
                      >
                        Search terms for labels to attach, comma-separated
                      </span>

                      <input
                        aria-describedby={`${formState.id}-column-${title}-searchTerms`}
                        aria-label="Search terms for included labels"
                        className="form-control"
                        onChange={formUpdate({
                          path: ["columns", id, "labelTerms"],
                        })}
                        placeholder="WG-, draft, review, proposal, ..."
                        type="text"
                        value={labelTerms.join(", ")}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <button
                className="btn btn-secondary d-inline-flex gap-2"
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
                disabled={!formState.hasChanges || "DELETE WHEN DONE"}
                className={[
                  "btn",
                  (boardId ?? null) === null ? "btn-primary" : "btn-secondary",
                  "d-inline-flex gap-2 align-items-center",
                ].join(" ")}
                style={{ width: "fit-content" }}
              >
                <span>💾</span>
                <span>( WIP ) Save as new board</span>
              </button>

              {(boardId ?? null) === null ? null : (
                <button
                  disabled={!formState.hasChanges}
                  className="btn btn-primary d-inline-flex gap-2 align-items-center"
                  style={{ width: "fit-content" }}
                >
                  <span>💾</span>
                  <span>Save changes</span>
                </button>
              )}
            </div>
          </div>
        ) : null}

        {!boardId && widget("entity.github-repo.board", formState)}

        {boardId &&
          widget("entity.github-repo.board", {
            ...boardConfigByBoardId(boardId),
            pageURL: boardId ? href("community.github", { boardId }) : null,
          })}
      </div>
    ),
  });
};

return GithubPage(props);
