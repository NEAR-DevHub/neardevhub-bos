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
    .map(([key, value]) => `${key}=${value}`)
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
        { title: "DRAFT", labelFilters: ["S-draft"] },
        { title: "REVIEW", labelFilters: ["S-review"] },
      ],

      dataTypes: { Issue: false, PullRequest: true },
      name: "NEAR Protocol NEPs",
      repoURL: "https://github.com/near/NEPs",
    },
  }[boardId];
};

const GithubActivityPage = ({ action, boardId, label }) => {
  State.init({
    boardConfig: {
      id: "probablyUUIDv4",

      columns: [
        { title: "DRAFT", labelFilters: ["S-draft"] },
        { title: "REVIEW", labelFilters: ["S-review"] },
      ],

      dataTypes: { Issue: false, PullRequest: true },
      name: "NEAR Protocol NEPs",
      repoURL: "https://github.com/near/NEPs",
    },
  });

  return widget("components.community.Layout", {
    label,
    tab: "Custom GitHub board title",
    children: (
      <div className="d-flex flex-column gap-4">
        {action === "new" && (
          <div className="d-flex flex-column gap-3 w-100">
            <h4 className="m-0">New GitHub activity board</h4>

            <div className="d-flex gap-3 flex-column flex-lg-row">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  Repository URL
                </span>

                <input
                  aria-describedby="basic-addon1"
                  aria-label="Repository URL"
                  className="form-control"
                  onChange={({ target: { value: repoURL } }) =>
                    State.update({ boardConfig: { repoURL } })
                  }
                  placeholder="https://github.com/example-org/example-repo"
                  type="text"
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
          </div>
        )}

        {action === "new" &&
          widget("entities.GithubRepo.Board", state.boardConfig)}

        {action === "view" &&
          widget("entities.GithubRepo.Board", {
            ...boardConfigByBoardId(boardId),
            linkedPage: "GithubActivity",
          })}
      </div>
    ),
  });
};

return GithubActivityPage(props);
