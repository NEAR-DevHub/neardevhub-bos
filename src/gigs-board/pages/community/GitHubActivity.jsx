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
/* END_INCLUDE: "common.jsx" */

const GithubActivityPage = ({ action, boardId, label }) => {
  State.init({
    newBoardConfig: {
      id: "probablyUUIDv4",

      columns: [
        { title: "DRAFT", labelFilters: ["S-draft"] },
        { title: "REVIEW", labelFilters: ["S-review"] },
      ],

      contentTypes: { Issue: false, PullRequest: true },
      name: "NEAR Protocol NEPs",
      repoURL: "https://github.com/near/NEPs",
    },
  });

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

        contentTypes: { Issue: false, PullRequest: true },
        name: "NEAR Protocol NEPs",
        repoURL: "https://github.com/near/NEPs",
      },
    }[boardId];
  };

  const TabContent = (
    <div class="flex column gap-4">
      {action === "new" && (
        <div>
          <h4>New GitHub activity board</h4>

          <div></div>
        </div>
      )}

      {action === "new" &&
        widget("entities.GithubRepo.Board", state.newBoardConfig)}

      {action === "view" &&
        widget("entities.GithubRepo.Board", {
          ...boardConfigByBoardId(boardId),
          linkedPage: "GithubActivity",
        })}
    </div>
  );

  return widget("components.community.Layout", {
    label,
    tab: "Custom GitHub board title",
    children: TabContent,
  });
};

return GithubActivityPage(props);
