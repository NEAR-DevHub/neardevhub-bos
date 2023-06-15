/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  // (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
  (context.widgetSrc ?? "jgdev.near").split("/", 1)[0];

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
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "shared/lib/gui" */
const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }
`;

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;
/* END_INCLUDE: "shared/lib/gui" */

const metadata = props.members_list[props.member];
const isTeam = props.member.startsWith("team:");
const memberBadge = isTeam ? "bi-people-fill" : "person-fill";
const header = isTeam ? (
  <div class="d-flex">
    <i class="bi bi-people-fill me-1"></i>
    {props.member}
  </div>
) : (
  <Widget
    src={`neardevgov.near/widget/ProfileLine`}
    props={{ accountId: props.member }}
  />
);

const permissionDesc = {
  "edit-post": "Can edit posts with these labels",
  "use-labels": "Can assign and unassign these labels",
};

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

const permissionsFilter = (permissionType) => {
  let res = [];
  for (const [pattern, permissions] of Object.entries(metadata.permissions)) {
    if (permissions.includes(permissionType)) {
      res.push(pattern);
    }
  }
  return res;
};

const permissionsRenderer = (permissionType) => {
  let permissions = permissionsFilter(permissionType);
  if (permissions.length > 0) {
    return (
      <p class="card-text" key={`${permissionType}-permissions`}>
        {permissionDesc[permissionType]}:
        {permissions.map((permission) => (
          <span class="badge text-bg-primary" key={permission}>
            {permissionExplainer(permission)}
          </span>
        ))}
      </p>
    );
  } else {
    return <div></div>;
  }
};

return (
  <Card className="card my-2 border-secondary">
    <div className="card-header">
      <small class="text-muted">{header}</small>
    </div>
    <div className="card-body">
      <p class="card-text" key="description">
        <Markdown class="card-text" text={metadata.description}></Markdown>
      </p>
      {permissionsRenderer("edit-post")}
      {permissionsRenderer("use-labels")}
      {metadata.children ? (
        <div class="vstack">
          {metadata.children.map((child) =>
            widget(
              "components.teams.TeamInfo",
              { member: child, members_list: props.members_list },
              child
            )
          )}
        </div>
      ) : null}
    </div>
  </Card>
);
