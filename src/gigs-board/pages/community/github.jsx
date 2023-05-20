/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

/**
 * Reads a board config from DevHub contract storage.
 * Currently a mock.
 *
 * Boards are indexed by their ids.
 */
const boardConfigByBoardId = ({ boardId }) => {
  return {
    probablyUUIDv4: {
      id: "probablyUUIDv4",
      columns: [
        { title: "Draft", labelFilters: ["S-draft"] },
        { title: "Review", labelFilters: ["S-review"] },
        { title: "HALP!", labelFilters: ["help"] },
      ],
      dataTypes: { Issue: true, PullRequest: true },
      description: "Latest NEAR Enhancement Proposals by status",
      repoURL: "https://github.com/near/NEPs",
      title: "NEAR Protocol NEPs",
    },
  }[boardId];
};

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

const formHandler =
  ({ formStateKey }) =>
  ({ fieldName, updateHandler }) =>
  (input) =>
    State.update((lastState) => ({
      ...lastState,

      [formStateKey]: {
        ...lastState[formStateKey],

        [fieldName]:
          typeof updateHandler === "function"
            ? updateHandler({
                input: input?.target?.value ?? input ?? null,
                lastState,
              })
            : input?.target?.value ?? input ?? null,
      },
    }));

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;
/* END_INCLUDE: "common.jsx" */

const GithubPage = ({ boardId, label }) => {
  console.log(
    "CommunityHeader state requested from Github page",
    Storage.get(
      "state",
      `${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.components.community.CommunityHeader`
    )
  );

  State.init({
    boardConfig: {
      id: "probablyUUIDv4",
      columns: [],
      dataTypes: { Issue: true, PullRequest: false },
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

  const onBoardConfigChange = formHandler({
    formStateKey: "boardConfig",
  });

  console.log(state);

  console.log(
    "Board config columns",
    JSON.stringify(state.boardConfig.columns)
  );

  const onEditorToggle = () =>
    State.update((lastState) => ({
      ...lastState,
      isEditorEnabled: !lastState.isEditorEnabled,
    }));

  const dataTypeToggle =
    ({ key }) =>
    ({ lastState }) => ({
      ...lastState.boardConfig.dataTypes,
      [key]: !lastState.boardConfig.dataTypes[key],
    });

  const onColumnCreate = () =>
    State.update((lastState) => ({
      ...lastState,

      boardConfig: {
        ...lastState.boardConfig,

        columns: [
          ...lastState.boardConfig.columns,
          { title: "New column", labelFilters: [] },
        ],
      },
    }));

  const onColumnTitleChange =
    ({ columnIdx }) =>
    ({ target: { value: title } }) =>
      State.update((lastState) => ({
        ...lastState,

        boardConfig: {
          ...lastState.boardConfig,

          columns: lastState.boardConfig.columns.map((column, idx) =>
            idx === columnIdx ? { ...column, title } : column
          ),
        },
      }));

  const onColumnLabelFiltersChange =
    ({ columnIdx }) =>
    ({ target: { value } }) =>
      State.update((lastState) => ({
        ...lastState,

        boardConfig: {
          ...lastState.boardConfig,

          columns: lastState.boardConfig.columns.map((column, idx) =>
            idx === columnIdx
              ? {
                  ...column,
                  labelFilters: value.split(",").map((string) => string.trim()),
                }
              : column
          ),
        },
      }));

  return widget("components.community.Layout", {
    label,
    tab: "GitHub",
    children: (
      <div className="d-flex flex-column gap-4 pb-4">
        {widget("components.toggle", {
          active: state.isEditorEnabled,

          className: [
            "position-fixed",
            "d-flex justify-content-center align-items-center",
            "shadow-md rounded-pill p-4",
          ].join(" "),

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
          <div className="d-flex flex-column gap-3 w-100 border border-dark rounded-2 p-4">
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-kanban-fill" />
              <span>{state.boardConfig.title} board configuration</span>
            </h5>

            <div className="d-flex gap-3 flex-column flex-lg-row">
              <div className="input-group-text d-flex flex-column w-25">
                <span id="newGithubBoardTitle">Title</span>

                <input
                  aria-describedby="newGithubBoardTitle"
                  aria-label="Board title"
                  className="form-control"
                  onChange={onBoardConfigChange({ fieldName: "title" })}
                  placeholder="NEAR Protocol NEPs"
                  type="text"
                  value={state.boardConfig.title}
                />
              </div>

              <div className="input-group-text d-flex flex-column justify-content-evenly w-75">
                <span id="newGithubBoardTitle">Repository URL</span>

                <input
                  aria-describedby="basic-addon1"
                  aria-label="Repository URL"
                  className="form-control"
                  onChange={onBoardConfigChange({ fieldName: "repoURL" })}
                  placeholder="https://github.com/example-org/example-repo"
                  type="text"
                  value={state.boardConfig.repoURL}
                />
              </div>
            </div>

            <div className="d-flex gap-3 flex-column flex-lg-row">
              <CompactContainer className="d-flex gap-3 flex-column justify-content-start p-3 ps-0">
                <span
                  className="d-inline-flex gap-2"
                  id="newGithubBoardTrackedData"
                >
                  <i class="bi bi-database-fill" />
                  <span>Tracked data</span>
                </span>

                {Object.entries(state.boardConfig.dataTypes).map(
                  ([key, active]) =>
                    widget(
                      "components.toggle",
                      {
                        active,
                        key,
                        label: key,

                        onSwitch: onBoardConfigChange({
                          fieldName: "dataTypes",
                          updateHandler: dataTypeToggle({ key }),
                        }),
                      },
                      key
                    )
                )}
              </CompactContainer>

              <div className="input-group-text d-flex flex-column w-100">
                <span id="newGithubBoardDescription">Description</span>

                <textarea
                  aria-describedby="newGithubBoardDescription"
                  aria-label="Board title"
                  className="form-control h-75"
                  onChange={onBoardConfigChange({ fieldName: "description" })}
                  placeholder="Latest NEAR Enhancement Proposals by status."
                  type="text"
                  value={state.boardConfig.description}
                />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <span className="d-inline-flex gap-2 m-0">
                <i className="bi bi-list-task" />
                <span>Columns</span>
              </span>
            </div>

            <div className="d-flex flex-column align-items-center gap-3">
              {state.boardConfig.columns.map(
                ({ title, labelFilters }, columnIdx) => (
                  <div className="input-group" key={`column-${columnIdx}`}>
                    <span className="input-group-text d-flex flex-column w-25">
                      <span id={`newGithubBoardColumn-${title}`}>Title</span>

                      <input
                        aria-describedby={`newGithubBoardColumn-${title}`}
                        aria-label="Column title"
                        className="form-control"
                        onChange={onColumnTitleChange({ columnIdx })}
                        placeholder="👀 Review"
                        type="text"
                        value={title}
                      />
                    </span>

                    <span className="input-group-text d-flex flex-column w-75">
                      <span
                        className="text-wrap"
                        id={`newGithubBoardColumnStatus-${title}-searchTerms`}
                      >
                        Search terms for labels to attach to the status,
                        comma-separated
                      </span>

                      <input
                        aria-describedby={`newGithubBoardColumnStatus-${title}-searchTerms`}
                        aria-label="Search terms for included labels"
                        className="form-control"
                        onChange={onColumnLabelFiltersChange({ columnIdx })}
                        placeholder="WG-, draft, review, proposal, ..."
                        type="text"
                        value={labelFilters.join(", ")}
                      />
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <button
                className="btn btn-outline-secondary d-inline-flex gap-2"
                disabled={state.boardConfig.columns.length >= 6}
                onClick={onColumnCreate}
                style={{ width: "fit-content" }}
              >
                <i class="bi bi-plus-lg" />
                <span>New column</span>
              </button>

              <button
                disabled
                className="btn btn-primary d-inline-flex gap-2 align-items-center"
                style={{ width: "fit-content" }}
              >
                <i
                  class="bi bi-cloud-arrow-up-fill lh-1"
                  style={{ paddingTop: 2 }}
                />

                <span>
                  Save {(boardId ?? null) === null ? "changes" : "board"}
                  <span>( WIP )</span>
                </span>
              </button>
            </div>
          </div>
        ) : null}

        {!boardId && widget("entity.github-repo.board", state.boardConfig)}

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
