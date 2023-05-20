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

const access_info =
  Near.view(nearDevGovGigsContractAccountId, "get_access_control_info") ?? null;

if (!access_info) {
  return <div>Loading...</div>;
}

const rules_list = props.rules_list ?? access_info.rules_list;

const permissionExplainer = (permission) => {
  if (permission.startsWith("starts-with:")) {
    let s = permission.substring("starts-with:".length);
    if (s == "") {
      return "Any label";
    } else {
      return `Labels that start with "${s}"`;
    }
  } else {
    return permission;
  }
};

return (
  <div className="card border-secondary" key="labelpermissions">
    <div className="card-header">
      <i class="bi-lock-fill"> </i>
      <small class="text-muted">Restricted Labels</small>
    </div>
    <ul class="list-group list-group-flush">
      {Object.entries(rules_list).map(([pattern, metadata]) => (
        <li class="list-group-item" key={pattern}>
          <span class="badge text-bg-primary" key={`${pattern}-permission`}>
            {permissionExplainer(pattern)}
          </span>{" "}
          {metadata.description}
        </li>
      ))}
    </ul>
  </div>
);
