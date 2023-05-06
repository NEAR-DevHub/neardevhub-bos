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

const inputToBoard = ({
  name = "NEAR Protocol NEPs",
  repoURL = "https://github.com/near/NEPs",
}) => {
  const { body: pullRequests } = fetch(
    `https://api.github.com/repos/${repoURL
      .split("/")
      .slice(-2, -1)
      .join("/")}/pulls`
  );

  console.board(pullRequests);

  return {
    boardId: "probablyUUIDv4", // uuid-v4() ?

    columns: [
      { label: "widget", title: "Widget" },
      { label: "integration", title: "Integration" },
      { label: "feature-request", title: "Feature Request" },
    ],

    excludedLabels: [],
    name,
    requiredLabels: ["near-social"],
  };
};

const { action, boardId, label } = props;

const TabContent = (
  <div class="flex column gap-4">
    {widget("components.boards.GitBoard", inputToBoard())}
  </div>
);

return widget("components.community.Layout", {
  label,
  tab: "Custom GH integration",
  children: TabContent,
});
