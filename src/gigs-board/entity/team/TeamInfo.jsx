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
  edit_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "edit_community_github", { handle, github }) ??
    null,

  get_access_control_info: () =>
    Near.view(devHubAccountId, "get_access_control_info") ?? null,

  get_all_authors: () => Near.view(devHubAccountId, "get_all_authors") ?? null,

  get_all_communities: () =>
    Near.view(devHubAccountId, "get_all_communities") ?? null,

  get_all_labels: () => Near.view(devHubAccountId, "get_all_labels") ?? null,

  get_community: ({ handle }) =>
    Near.view(devHubAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(devHubAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(devHubAccountId, "get_root_members") ?? null,

  useQuery: ({ name, params }) => {
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
const access_control_info = DevHub.useQuery({
  name: "access_control_info",
});

const Viewer = {
  can: {
    editCommunity: (communityData) =>
      Struct.typeMatch(communityData) &&
      (communityData.admins.includes(context.accountId) ||
        Viewer.role.isDevHubModerator),
  },

  role: {
    isDevHubModerator:
      access_control_info.data === null || access_control_info.isLoading
        ? false
        : access_control_info.data.members_list[
            "team:moderators"
          ]?.children?.includes?.(context.accountId) ?? false,
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
  // TODO
  // <Widget
  //   src={`neardevgov.near/widget/ProfileLine`}
  //   props={{ accountId: props.member }}
  // />
  <div class="d-flex">
    <i class="bi bi-people-fill me-1"></i>
    {props.member}
  </div>
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
  permissions: Object.entries(metadata.permissions)
    .map((entry) => entry[1])
    .join(","),
};

const initialLabels = {};
for (const [label, permissions] of Object.entries(metadata.permissions)) {
  initialLabels[label] = permissions.join(',');
}

State.init({
  addMember: false,
  addLabel: false,
  labelError: "",
  memberError: "",
  editLabels: true, // TODO false
  teamData: isTeam ? TeamDataDefaults : null,
  permissions: initialLabels,
  newLabel: "",
  newPermissions: "",
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
    Object.values(props.root_members).filter((metadata) =>
      metadata.children.includes(memberId)
    ).length > 1;
  if (isMemberInMultipleTeams) {
    // edit_member
    let metadata = props.root_members[props.teamId] || {};
    let newChildren =
      metadata.children?.filter((item) => item !== memberId) || [];
    Near.call([
      {
        contractName: nearDevGovGigsContractAccountId,
        methodName: "edit_member",
        args: {
          member: props.teamId,
          metadata: {
            ...metadata,
            children: [...newChildren],
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
  let memberExists = !!props.members_list[memberData.member];
  let metadata = props.members_list[memberData.member] || {};
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: memberExists ? "edit_member" : "add_member",
      args: {
        member: memberData.member,
        metadata: {
          ...metadata,
          description: memberData.description,
          parents: [...metadata.parents, props.teamId],
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

// TODO edit labels from members as well as top level
function editLabelsFromTeam(labelData) {
  // Labels need to exist in order to add them to a team.
  const possibleLabels = Object.keys(props.rules_list);
  const team = props.member;
  let newPermissions = {};
  let allLabels = labelData.labels.split(",");
  let legitLabels = allLabels.filter((label) => possibleLabels.includes(label));
  legitLabels.forEach((label) => {
    // TODO
    newPermissions[label] = ["edit-post", "use-labels"];
  });
  if (legitLabels.length) {
    Near.call([
      {
        contractName: nearDevGovGigsContractAccountId,
        methodName: "edit_member",
        args: {
          member: team,
          metadata: {
            ...props.root_members[team],
            permissions: newPermissions,
          },
        },
        deposit: Big(0).pow(21),
        gas: Big(10).pow(12).mul(100),
      },
    ]);
  } else {
    State.update({
      labelError:
        "Error labels do not exist yet, first add it in the restricted labels section or use starts-with:<label>",
    });
  }
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

// Edit label
// Add label
// Remove label
function editLabel() {}

const singleLabelEditor = (label) =>
  widget("components.organism.editor", {
    classNames: {
      submit: "btn-primary",
      submitAdornment: "bi-check-circle-fill",
    },
    heading: `Label: ${label}`,
    isEditorActive: state.isEditorActive,
    isEditingAllowed: props.editMode,
    onChangesSubmit: editLabelsFromTeam,
    submitLabel: "Accept",
    data: state.teamData,
    schema: {
      permissions: {
        inputProps: {
          min: 9, // edit-post
          max: 20, // edit-post,use-labels
          format: "comma-separated",
          placeholder: `edit-post,use-labels`,
          required: true,
        },
        label: "Label permissions",
        order: 2,
      },
    },
  });

const editLabelsDiv = () => {
  return (
    <div>
      {Object.entries(metadata.permissions).map((entry) => {
        return editLabelDiv(entry[0]);
      })}
      {editLabelDiv("")}
    </div>
  );
};

const editLabelDiv = (label) => {
  const labelNameInput = widget("components.molecule.text-input", {
    inputProps: { type: "text", disabled: !!label },
    placeholder: "example-label",
    label: "name",
    value: !!label ? label : state.newLabel,
    onChange: ({ text }) => {
      State.update({ newLabel: text });
    },
  });
  const labelPermissionsInput = widget("components.molecule.text-input", {
    inputProps: { type: "text" },
    placeholder: "edit-post,use-labels",
    label: "permissions",
    value: !!label ? state.permissions[label] : state.newPermissions,
    onChange: ({ text }) => {
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
      onClick={() => emoveLabelFromTeam(label)}
    >
      Remove
    </button>
  );

  return (
    <div class="d-flex">
      {labelNameInput}
      {labelPermissionsInput}
      {widget("components.layout.Controls", {
        title: label ? "Edit" : "Add",
        icon: label ? "bi-pencil-square" : "",
        className: "d-flex align-items-end mb-2",
        onClick: () => {
          // TODO submit new label
          if (label) {
            editLabel();
          } else {
            addLabel();
          }
        },
      })}
      {label ? deleteLabelBtn : null}
    </div>
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
                    addLabel: false,
                  });
                },
              })}
            {!props.teamLevel && props.editMode && (
              <button
                class="btn btn-light"
                onClick={() => removeMemberFromTeam(props.member)}
              >
                Remove
              </button>
            )}
            {props.teamLevel &&
              props.editMode &&
              widget("components.layout.Controls", {
                title: !state.editLabels ? "Edit Labels" : "Stop Editing",
                icon: !state.editLabels
                  ? "bi-pencil-square"
                  : "bi-stop-circle-fill",
                onClick: () => {
                  // TODO
                  if (!state.editLabels) {
                    // Submit new labels
                  }
                  State.update({
                    editLabels: !state.editLabels,
                  });
                },
              })}
            {/* TODO make it unable for moderators to delete the moderator team unless they are contract owner  */}
            {/* props.member !== "team:moderators" */}
            {props.teamLevel && props.editMode ? (
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
      <div className="card-body">
        <p class="card-text" key="description">
          <Markdown class="card-text" text={metadata.description}></Markdown>
        </p>
        <div className="d-flex align-items-center justify-content-center">
          {state.addMember &&
            widget("components.organism.editor", {
              classNames: {
                submit: "btn-primary",
                submitAdornment: "bi-check-circle-fill",
              },
              heading: "Adding member",
              isEditorActive: state.isEditorActive,
              isEditingAllowed: props.editMode,
              onChangesSubmit: addMemberToTeam,
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
                description: {
                  inputProps: {
                    min: 2,
                    max: 60,
                    placeholder: "Description",
                    required: true,
                  },
                  label: "Role description",
                  order: 3,
                },
              },
            })}
          {state.addLabel && state.labelError ? (
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
          {state.editLabels && props.teamLevel && editLabelsDiv()}
        </div>
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
    </AttractableDiv>
  </>
);
