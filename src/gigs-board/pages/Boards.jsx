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
  const linkPropsQuery = Object.entries(linkProps)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const selectedBoardId = props.selectedBoardId ?? "mnwtransition";

console.log("selectedBoardId", selectedBoardId);
const boards = props.boards ?? [
  {
    name: "MyNearWallet Transition",
    id: "mnwtransition",
    config: {
      requiredLabels: ["mnw-transition-applicant"],
      columnLabels: [
        "mnw-application-received",
        "mnw-evaluated-by-wg",
        "mwn-selection-decision",
      ],
      excludedLabels: [],
    },
  },
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
        "funding-requested",
        "funding-info-submitted",
        "funding-info-checked",
        "funding-terms-agreed",
        "funding-signed",
        "funding-invoice-instructions-provided",
        "funding-provided",
      ],
      excludedLabels: [],
    },
  },
];

const pageContent = (
  <div>
    <ul class="nav nav-tabs my-3" id="pills-tab" role="tablist">
      {boards.map((board) => (
        <li class="nav-item" role="presentation" key={board.id}>
          <button
            class={`nav-link ${board.id == selectedBoardId ? "active" : ""}`}
            data-bs-toggle="pill"
            data-bs-target={`#board${board.id}`}
            type="button"
            role="tab"
            aria-controls={`board${board.id}`}
            aria-selected={board.id == selectedBoardId ? "true" : "false"}
          >
            {board.name}
          </button>
        </li>
      ))}
    </ul>
    <div class="tab-content" id="pills-tabContent">
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

return widget("components.layout.Page", { children: pageContent });
