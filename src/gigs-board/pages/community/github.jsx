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
      columns: [{ title: "Draft", labelFilters: ["S-draft"] }],
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
      columns: [{ title: "Draft", labelFilters: ["S-draft"] }],
      dataTypes: { Issue: false, PullRequest: true },
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
    ({ typeName }) =>
    ({ lastState }) => ({
      ...lastState.boardConfig.dataTypes,
      [typeName]: !lastState.boardConfig.dataTypes[typeName],
    });

  const onColumnCreate = () =>
    State.update((lastState) => ({
      ...lastState,

      boardConfig: {
        ...lastState.boardConfig,

        columns: [
          ...lastState.boardConfig.columns,
          { title: "New status", labelFilters: [] },
        ],
      },
    }));

  const onColumnStatusTitleChange =
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
      <div className="d-flex flex-column gap-4">
        <div className="d-flex justify-content-end">
          {widget("components.toggle", {
            active: state.isEditorEnabled,
            key: "editor-toggle",
            label: "Editor mode",
            onSwitch: onEditorToggle,
          })}
        </div>

        {state.isEditorEnabled ? (
          <div className="d-flex flex-column gap-3 w-100 border border-dark rounded-2 p-4">
            <div className="d-flex gap-3">
              <div className="input-group-text d-flex flex-column w-25">
                <span id="newGithubBoardTitle">Board title</span>

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

              <div className="input-group-text d-flex flex-column w-75">
                <span id="newGithubBoardTitle">Description</span>

                <input
                  aria-describedby="newGithubBoardTitle"
                  aria-label="Board title"
                  className="form-control"
                  onChange={onBoardConfigChange({ fieldName: "description" })}
                  placeholder="Latest NEAR Enhancement Proposals by status."
                  type="text"
                  value={state.boardConfig.title}
                />
              </div>
            </div>

            <div className="d-flex gap-3 flex-column flex-lg-row">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  Repository URL
                </span>

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

              <CompactContainer className="input-group flex-nowrap">
                <span className="input-group-text" id="basic-addon1">
                  Tracked data
                </span>

                <CompactContainer className="form-control d-flex flex-column gap-2">
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
                            updateHandler: dataTypeToggle({ typeName }),
                          }),
                        },
                        key
                      )
                  )}
                </CompactContainer>
              </CompactContainer>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <h4 className="m-0">Columns</h4>

              <button onClick={onColumnCreate} style={{ width: "fit-content" }}>
                <i class="bi-plus" />
                <span>New column</span>
              </button>
            </div>

            <div className="d-flex flex-column align-items-center gap-3">
              {state.boardConfig.columns.map(
                ({ title, labelFilters }, columnIdx) => (
                  <div className="input-group" key={`column-${columnIdx}`}>
                    <span className="input-group-text d-flex flex-column w-25">
                      <span id={`newGithubBoardColumnStatus-${title}`}>
                        Status title
                      </span>

                      <input
                        aria-describedby={`newGithubBoardColumnStatus-${title}`}
                        aria-label="Status title"
                        className="form-control"
                        onChange={onColumnStatusTitleChange({ columnIdx })}
                        placeholder="👀 Review"
                        type="text"
                        value={title}
                      />
                    </span>

                    <span className="input-group-text d-flex flex-column w-75">
                      <span
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
                        placeholder="draft, review, proposal, ..."
                        type="text"
                        value={labelFilters.join(", ")}
                      />
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        ) : null}

        {!boardId && widget("entity.github-repo.board", state.boardConfig)}

        {boardId &&
          widget("entity.github-repo.board", {
            ...boardConfigByBoardId(boardId),
            pageLink: href("community.github", { boardId }),
          })}
      </div>
    ),
  });
};

return GithubPage(props);
