const access_info =
  Near.view("devgovgigs.near", "get_access_control_info") ?? null;

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
        <li class="list-group-item" key={`${pattern}`}>
          <span class="badge text-bg-primary" key={`${pattern}-permission`}>
            {permissionExplainer(pattern)}
          </span>{" "}
          {metadata.description}
        </li>
      ))}
    </ul>
  </div>
);

