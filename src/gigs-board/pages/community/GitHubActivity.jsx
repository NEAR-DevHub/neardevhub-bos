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

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const FormCheckLabel = styled.label`
  white-space: nowrap;
`;
/* END_INCLUDE: "common.jsx" */

const GithubActivityPage = ({ boardId, label }) => {
  State.init({
    boardConfig: {
      id: "probablyUUIDv4",

      columns: [
        { title: "Draft", labelFilters: ["S-draft"] },
        { title: "Review", labelFilters: ["S-review"] },
      ],

      dataTypes: { Issue: false, PullRequest: true },
      description: "Latest NEAR Enhancement Proposals by status",
      repoURL: "https://github.com/near/NEPs",
      title: "NEAR Protocol NEPs",
    },
  });

  console.log(
    "Board config columns",
    JSON.stringify(state.boardConfig.columns)
  );

  const onBoardTitleChange = ({ target: { value: title } }) =>
    State.update({ boardConfig: { title } });

  const onRepoURLChange = ({ target: { value: repoURL } }) =>
    State.update({ boardConfig: { repoURL } });

  const onColumnCreate = () =>
    State.update(({ boardConfig }) => ({
      boardConfig: {
        columns: [
          ...boardConfig.columns,
          { title: "New status", labelFilters: [] },
        ],
      },
    }));

  const onColumnStatusTitleChange =
    ({ columnIdx }) =>
    ({ target: { value: title } }) =>
      State.update(({ boardConfig }) => ({
        boardConfig: {
          columns: boardConfig.columns.map((column, idx) =>
            idx === columnIdx ? { ...column, title } : column
          ),
        },
      }));

  const onColumnLabelFiltersChange =
    ({ columnIdx }) =>
    ({ target: { value } }) =>
      State.update(({ boardConfig }) => ({
        boardConfig: {
          columns: boardConfig.columns.map((column, idx) =>
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
    tab: state.boardConfig.title,
    children: (
      <div className="d-flex flex-column gap-4">
        <div
          className="d-flex flex-column gap-3 w-100 border border-dark-subtle rounded-2 p-3"
          style={{ backgroundColor: "rgb(243, 243, 243)" }}
        >
          <span className="input-group-text d-flex flex-column w-25">
            <span id="newGithubBoardTitle">Board title</span>

            <input
              aria-describedby="newGithubBoardTitle"
              aria-label="Board title"
              className="form-control"
              onChange={onBoardTitleChange}
              placeholder="NEAR Protocol NEPs"
              type="text"
              value={state.boardConfig.title}
            />
          </span>

          <div className="d-flex gap-3 flex-column flex-lg-row">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                Repository URL
              </span>

              <input
                aria-describedby="basic-addon1"
                aria-label="Repository URL"
                className="form-control"
                onChange={onRepoURLChange}
                placeholder="https://github.com/example-org/example-repo"
                type="text"
                value={state.boardConfig.repoURL}
              />
            </div>

            <CompactContainer className="input-group flex-nowrap">
              <span className="input-group-text" id="basic-addon1">
                Tracked data
              </span>

              <CompactContainer className="form-control">
                {Object.entries(state.boardConfig.dataTypes).map(
                  ([dataTypeKey, dataTypeIncluded]) => (
                    <CompactContainer className="form-check form-switch">
                      <input
                        disabled
                        checked={dataTypeIncluded}
                        className="form-check-input"
                        id={`newGithubBoardDataTypeSwitch-${dataTypeKey}`}
                        onClick={() =>
                          State.update({
                            boardConfig: {
                              dataTypes: {
                                [dataTypeKey]: !dataTypeIncluded,
                              },
                            },
                          })
                        }
                        role="switch"
                        type="checkbox"
                      />

                      <FormCheckLabel
                        className="form-check-label"
                        for="newGithubBoardDataTypeSwitchPullRequests"
                      >
                        {dataTypeKey}
                      </FormCheckLabel>
                    </CompactContainer>
                  )
                )}
              </CompactContainer>
            </CompactContainer>
          </div>

          <h4 className="m-0">Columns</h4>

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

            <button onClick={onColumnCreate} style={{ width: "fit-content" }}>
              <i class="bi-plus" />
              <span>New column</span>
            </button>
          </div>
        </div>

        {!boardId && widget("entities.GithubRepo.Board", state.boardConfig)}

        {boardId &&
          widget("entities.GithubRepo.Board", {
            ...boardConfigByBoardId(boardId),
            linkedPage: "GithubActivity",
          })}
      </div>
    ),
  });
};

return GithubActivityPage(props);
