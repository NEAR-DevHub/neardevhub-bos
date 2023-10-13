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
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */
/* INCLUDE: "core/adapter/dev-hub" */
const devHubAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  get_root_members: () =>
    Near.view(devHubAccountId, "get_root_members") ?? null,

  has_moderator: ({ account_id }) =>
    Near.view(devHubAccountId, "has_moderator", { account_id }) ?? null,

  create_community: ({ inputs }) =>
    Near.call(devHubAccountId, "create_community", { inputs }),

  get_community: ({ handle }) =>
    Near.view(devHubAccountId, "get_community", { handle }) ?? null,

  get_account_community_permissions: ({ account_id, community_handle }) =>
    Near.view(devHubAccountId, "get_account_community_permissions", {
      account_id,
      community_handle,
    }) ?? null,

  update_community: ({ handle, community }) =>
    Near.call(devHubAccountId, "update_community", { handle, community }),

  delete_community: ({ handle }) =>
    Near.call(devHubAccountId, "delete_community", { handle }),

  update_community_board: ({ handle, board }) =>
    Near.call(devHubAccountId, "update_community_board", { handle, board }),

  update_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "update_community_github", { handle, github }),

  get_access_control_info: () =>
    Near.view(devHubAccountId, "get_access_control_info") ?? null,

  get_all_authors: () => Near.view(devHubAccountId, "get_all_authors") ?? null,

  get_all_communities_metadata: () =>
    Near.view(devHubAccountId, "get_all_communities_metadata") ?? null,

  get_all_labels: () => Near.view(devHubAccountId, "get_all_labels") ?? null,

  get_post: ({ post_id }) =>
    Near.view(devHubAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  useQuery: (name, params) => {
    const initialState = { data: null, error: null, isLoading: true };

    const cacheState = useCache(
      () =>
        Near.asyncView(devHubAccountId, ["get", name].join("_"), params ?? {})
          .then((response) => ({
            ...initialState,
            data: response ?? null,
            isLoading: false,
          }))
          .catch((error) => ({
            ...initialState,
            error: props?.error ?? error,
            isLoading: false,
          })),

      JSON.stringify({ name, params }),
      { subscribe: true }
    );

    return cacheState === null ? initialState : cacheState;
  },
};
/* END_INCLUDE: "core/adapter/dev-hub" */
/* INCLUDE: "entity/viewer" */
const Viewer = {
  communityPermissions: ({ handle }) =>
    DevHub.get_account_community_permissions({
      account_id: context.accountId,
      community_handle: handle,
    }) ?? {
      can_configure: false,
      can_delete: false,
    },

  role: {
    isDevHubModerator:
      DevHub.has_moderator({ account_id: context.accountId }) ?? false,
  },
};
/* END_INCLUDE: "entity/viewer" */

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

const SlimButton = styled.button`
  height: 24px;
  line-height: 12px;
`;

const TeamDataDefaults = {
  member: null,
  description: null,
  labels: Object.entries(metadata.permissions)
    .map((entry) => entry[0])
    .join(","),
};

function getInitialPermissionsString() {
  const initialPermissionsString = {};
  for (const [label, per] of Object.entries(metadata.permissions)) {
    initialPermissionsString[label] = per.join(",");
  }
  return initialPermissionsString;
}

State.init({
  addMember: false,
  labelError: "",
  permissionError: "",
  memberError: "",
  editLabels: false,
  teamData: isTeam ? TeamDataDefaults : null,
  permissions: getInitialPermissionsString(),
  newLabel: "",
  newPermissions: "",
  isActive: true,
});

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
      <div class="d-flex justify-content-between">
        <p class="card-text" key={`${permissionType}-permissions`}>
          {permissionDesc[permissionType]}:
          {permissions.map((permission) => (
            <span class="badge text-bg-primary" key={permission}>
              {permissionExplainer(permission)}
            </span>
          ))}
        </p>
      </div>
    );
  } else {
    return <div></div>;
  }
};

function removeTeam(team) {
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: "remove_member",
      args: { member: team },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

function removeMemberFromTeam(memberId) {
  let isMemberInMultipleTeams =
    Object.values(props.root_members).filter((meta) =>
      meta.children.includes(memberId)
    ).length > 1;
  let membersMetaData = props.members_list[memberId];
  if (isMemberInMultipleTeams) {
    // edit_member
    let newParents =
      membersMetaData?.parents?.filter((item) => item !== props.teamId) || [];
    Near.call([
      {
        contractName: nearDevGovGigsContractAccountId,
        methodName: "edit_member",
        args: {
          member: memberId,
          metadata: {
            ...membersMetaData,
            parents: [...newParents],
          },
        },
        deposit: Big(0).pow(21),
        gas: Big(10).pow(12).mul(100),
      },
    ]);
  } else {
    // remove_member
    Near.call([
      {
        contractName: nearDevGovGigsContractAccountId,
        methodName: "remove_member",
        args: { member: memberId },
        deposit: Big(0).pow(21),
        gas: Big(10).pow(12).mul(100),
      },
    ]);
  }
}

function addMemberToTeam(memberData) {
  let memberId = memberData.member;
  if (metadata.children.includes(memberId))
    return State.update({
      memberError: "Member already exists in team",
    });
  let memberExists = !!props.members_list[memberId];
  let membersMetaData = memberExists
    ? props.members_list[memberId]
    : { parents: [] };
  let args = {
    member: memberId,
    metadata: {
      children: [],
      description: "",
      member_metadata_version: "V0",
      parents: [...membersMetaData.parents, props.teamId],
      permissions: {},
    },
  };
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: memberExists ? "edit_member" : "add_member",
      args,
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

function editLabelsFromTeam(label, permissions) {
  const possibleLabels = Object.keys(props.rules_list);
  const team = props.member;
  // Labels need to exist in the contract in order to add them to a team.
  let permissionsArray = permissions.split(",");
  if (!possibleLabels.includes(label)) {
    State.update({
      labelError:
        "Error label does not exist yet, first add it in the restricted labels section or use starts-with:<label>",
    });
  }
  // Only 'edit-post' and 'use-labels' are valid
  if (!checkPermissions(permissionsArray)) {
    State.update({
      permissionError:
        "Permissions can only have value 'edit-post' and/or 'use-labels' comma-seperated.",
    });
    return;
  }
  let newPermissions = metadata.permissions;
  newPermissions[label] = permissionsArray;
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: "edit_member",
      args: {
        member: team,
        metadata: {
          ...metadata,
          permissions: newPermissions,
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

function removeLabelFromTeam(rule) {
  // Copy
  let permissions = { ...metadata.permissions };
  delete permissions[rule];
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: "edit_member",
      args: {
        member: props.teamId,
        metadata: {
          ...metadata,
          permissions: permissions,
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

function checkPermissions(arr) {
  // Check if both are or either one of the values is present exactly once
  const uniqueValues = new Set();
  for (const value of arr) {
    if (value !== "edit-post" && value !== "use-labels") {
      return false; // Value is not allowed
    }
    if (uniqueValues.has(value)) {
      return false;
    }
    uniqueValues.add(value);
  }
  return uniqueValues.size === 2 || uniqueValues.size === 1;
}

const editLabelsDiv = () => {
  const warning = state.permissionError && (
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      {state.permissionError}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={() => State.update({ permissionError: "" })}
      ></button>
    </div>
  );

  return (
    <div>
      {warning}
      {Object.entries(metadata.permissions).length
        ? Object.entries(metadata.permissions).map((entry) => {
            return editLabelDiv(entry[0]);
          })
        : editLabelDiv("")}
      {/* {editLabelDiv("")} */}
    </div>
  );
};

const editLabelDiv = (label) => {
  const labelNameInput = widget("components.molecule.text-input", {
    inputProps: { type: "text", disabled: !!label },
    placeholder: "example-label",
    label: "name",
    value: !!label ? label : state.newLabel,
    onChange: (data) => {
      let text = data.target.value;
      State.update({ newLabel: text });
    },
  });
  const labelPermissionsInput = widget("components.molecule.text-input", {
    inputProps: { type: "text" },
    placeholder: "edit-post,use-labels",
    label: "permissions",
    value: !!label ? state.permissions[label] : state.newPermissions,
    onChange: (data) => {
      let text = data.target.value;
      if (!!label) {
        state.permissions[label] = text;
        State.update({
          permissions: state.permissions,
        });
      } else {
        State.update({
          newPermissions: text,
        });
      }
    },
  });

  const deleteLabelBtn = (
    <button
      class="btn btn-light mb-2 align-self-end h-25"
      onClick={() => removeLabelFromTeam(label)}
    >
      Remove
    </button>
  );

  return (
    <>
      <div class="d-flex">
        {labelNameInput}
        {labelPermissionsInput}
        {widget("components.layout.Controls", {
          title: label ? "Edit" : "Add",
          icon: label ? "bi-pencil-square" : "",
          className: "d-flex align-items-end mb-2",
          onClick: () => {
            if (label) {
              // Edit permissions of label on team
              editLabelsFromTeam(label, state.permissions[label]);
            } else {
              // Add a label with permissions to the team
              editLabelsFromTeam(state.newLabel, state.newPermissions);
            }
          },
        })}
        {label ? deleteLabelBtn : null}
      </div>
    </>
  );
};

return (
  <>
    <AttractableDiv className="card my-2">
      <div className="card-body">
        <div class="d-flex justify-content-between">
          <small class="text-muted">{header}</small>
          <div class="d-flex">
            {props.teamLevel &&
              props.editMode &&
              widget("components.layout.Controls", {
                title: "Add member",
                onClick: () => {
                  State.update({
                    addMember: !state.addMember,
                    editLabels: false,
                  });
                },
              })}
            {!props.teamLevel && props.editMode && (
              <button
                class="btn btn-sm btn-light"
                onClick={() => removeMemberFromTeam(props.member)}
              >
                Remove member
              </button>
            )}
            {props.teamLevel &&
              props.editMode &&
              widget("components.layout.Controls", {
                title: !state.editLabels
                  ? "Edit labels"
                  : "Stop editing labels",
                icon: !state.editLabels
                  ? "bi-pencil-square"
                  : "bi-stop-circle-fill",
                onClick: () => {
                  State.update({
                    editLabels: !state.editLabels,
                    addMember: false,
                  });
                },
              })}
            {props.teamLevel &&
            props.editMode &&
            props.member !== "team:moderators" ? (
              <button
                class="btn btn-light"
                onClick={() => removeTeam(props.member)}
              >
                Delete team
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {props.teamLevel && (
        <div className="card-body">
          {
            <p class="card-text" key="description">
              {widget("components.molecule.markdown-viewer", {
                text: metadata.description,
              })}
            </p>
          }
          {state.editLabels && state.memberError && props.editMode ? (
            <div
              class="alert alert-warning alert-dismissible fade show"
              role="alert"
            >
              {state.memberError}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => State.update({ memberError: "" })}
              ></button>
            </div>
          ) : null}
          {state.addMember &&
            props.editMode &&
            widget("components.organism.configurator", {
              classNames: {
                submit: "btn-primary",
                submitAdornment: "bi-check-circle-fill",
              },
              heading: "Adding member",
              isActive: state.isActive,
              isUnlocked: props.editMode,
              onSubmit: addMemberToTeam,
              submitLabel: "Accept",
              data: state.teamData,
              schema: {
                member: {
                  inputProps: {
                    min: 2,
                    max: 60,
                    placeholder: "member.near",
                    required: true,
                  },
                  label: "Members name",
                  order: 2,
                },
              },
            })}
          {state.editLabels && state.labelError && props.editMode ? (
            <div
              class="alert alert-warning alert-dismissible fade show"
              role="alert"
            >
              {state.labelError}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => State.update({ labelError: "" })}
              ></button>
            </div>
          ) : null}
          {state.editLabels &&
            props.teamLevel &&
            props.editMode &&
            editLabelsDiv()}
          {permissionsRenderer("edit-post")}
          {permissionsRenderer("use-labels")}
          {metadata.children && (
            <div class="vstack">
              {metadata.children.map((child) =>
                widget(
                  "entity.team.TeamInfo",
                  {
                    member: child,
                    members_list: props.members_list,
                    teamLevel: false,
                    root_members: props.root_members,
                    teamId: props.teamId,
                    editMode: props.editMode,
                  },
                  child
                )
              )}
            </div>
          )}
        </div>
      )}
    </AttractableDiv>
  </>
);
