const ownerId = "devgovgigs.near";

const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }

`;

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
          <span class="badge text-bg-primary" key={`${permission}-permission`}>
            {permissionExplainer(permission)}
          </span>
        ))}
      </p>
    );
  } else {
    return <div></div>;
  }
};

const childrenRenderer = () => {
  let children = metadata.children;
  if (children) {
    return (
      <div class="vstack">
        {children.map((child) => (
          <Widget
            src={`${ownerId}/widget/TeamInfo`}
            props={{ member: child, members_list: props.members_list }}
            key={`subpost-${child}-of-${props.member}`}
          />
        ))}
      </div>
    );
  } else {
    return <div></div>;
  }
};

return (
  <Card className="card my-2 border-secondary" key={`member-${props.member}`}>
    <div className="card-header">
      <small class="text-muted">{header}</small>
    </div>
    <div className="card-body">
      <p class="card-text" key="description">
        <Markdown class="card-text" text={metadata.description}></Markdown>
      </p>
      {permissionsRenderer("edit-post")}
      {permissionsRenderer("use-labels")}
      {childrenRenderer()}
    </div>
  </Card>
);

