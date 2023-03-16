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

const selectedBoardId = props.selectedBoardId ?? "mnwtransition";

const boards = props.boards ?? [
  {
    name: "near.social",
    id: "nearsocial",
    config: {
      requiredLabels: ["near-social"],
      columnLabels: ["widget", "integration", "feature-request"],
      excludedLabels: [],
    },
  },
  {
    name: "Gigs Board",
    id: "gigsboard",
    config: {
      requiredLabels: ["gigs-board"],
      columnLabels: ["nep", "badges", "feature-request"],
      excludedLabels: [],
    },
  },
  {
    name: "Funding",
    id: "funding",
    config: {
      requiredLabels: ["funding"],
      columnLabels: [
        "funding-new-request",
        "funding-information-collection",
        "funding-processing",
        "funding-funded",
      ],
      excludedLabels: [],
    },
  },
];

// Bootstrap tabs documentation: https://getbootstrap.com/docs/5.2/components/navs-tabs
const pageContent = (
  <div>
    <ul class="nav nav-tabs my-3">
      {boards.map((board) => (
        <li class="nav-item" key={board.id}>
          <a
            href={href("Boards", { selectedBoardId: board.id })}
            class={`nav-link ${board.id == selectedBoardId ? "active" : ""}`}
          >
            {board.name}
          </a>
        </li>
      ))}
    </ul>
    <div class="tab-content">
      {boards.map((board) => (
        <div
          class={`tab-pane fade ${
            board.id == selectedBoardId ? "show active" : ""
          }`}
          id={`board${board.id}`}
          role="tabpanel"
          aria-labelledby={`${board.id}-tab`}
          tabindex="0"
          key={board.id}
        >
          {widget("components.boards.KanbanBoard", {
            requiredLabels: board.config.requiredLabels,
            excludedLabels: board.config.excludedLabels,
            columnLabels: board.config.columnLabels,
            boardId: board.id,
          })}
        </div>
      ))}
    </div>
  </div>
);

return widget("components.layout.Page", {
  children: pageContent,
});
