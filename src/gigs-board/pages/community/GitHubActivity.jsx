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
      description: "",
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
    .map(([key, value]) => (value ?? null === null ? null : `${key}=${value}`))
    .filter((nullable) => nullable !== null)
    .join("&");

  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
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

	console.log(state.boardConfig)

  const onRepoURLChange = ({ target: { value: repoURL } }) =>
    State.update({ boardConfig: { repoURL } });

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
              ? { ...column, labelFilters: value.split(",") }
              : column
          ),
        },
      }));

  return widget("components.community.Layout", {
    label,
    tab: state.boardConfig.title,
    children: (
      <div className="d-flex flex-column gap-4">
        <div className="d-flex flex-column gap-3 w-100">
          <h4 className="m-0">Board title</h4>

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
                <CompactContainer className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="newGithubBoardDataTypeSwitchPullRequests"
                    checked
                  />

                  <FormCheckLabel
                    className="form-check-label"
                    for="newGithubBoardDataTypeSwitchPullRequests"
                  >
                    Pull requests
                  </FormCheckLabel>
                </CompactContainer>

                <CompactContainer className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="newGithubBoardDataTypeSwitchIssues"
                    checked
                  />

                  <FormCheckLabel
                    className="form-check-label"
                    for="newGithubBoardDataTypeSwitchIssues"
                  >
                    Issues
                  </FormCheckLabel>
                </CompactContainer>
              </CompactContainer>
            </CompactContainer>
          </div>

          <h4 className="m-0">Columns</h4>

          <div className="d-flex flex-column gap-3">
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
                      Search terms for included labels, comma-separated
                    </span>

                    <input
                      aria-describedby={`newGithubBoardColumnStatus-${title}-searchTerms`}
                      aria-label="Search terms for included labels"
                      className="form-control"
                      onChange={onColumnLabelFiltersChange({ columnIdx })}
                      placeholder="S-draft, S-review, proposal, ..."
                      type="text"
                      value={labelFilters.join(", ")}
                    />
                  </span>
                </div>
              )
            )}
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
