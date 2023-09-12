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

const isContractOwner = nearDevGovGigsContractAccountId == context.accountId;

State.init({
  labelData: null,
  teamData: null,
  createTeam: false,
  createLabel: false,
  isActive: true,
  editTeams: false,
});

const access_info = DevHub.get_access_control_info() ?? null,
  root_members = DevHub.get_root_members() ?? null;

if (!access_info || !root_members) {
  return <div>Loading...</div>;
}

function addLabel(labelData) {
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: "set_restricted_rules",
      args: {
        rules: {
          [labelData.name]: {
            description: labelData.description,
            rule_metadata_version: "V0",
          },
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

function addTeam(teamData) {
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: "add_member",
      args: {
        member: `team:${teamData.name}`,
        metadata: {
          member_metadata_version: "V0",
          description: teamData.description,
          permissions: {
            [teamData.label]: ["edit-post", "use-labels"],
          },
          children: [],
          parents: [],
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

// Check for the edit state and sufficient user permissions, it is passed down
// to the TeamInfo widget
const editMode =
  (Viewer.role.isDevHubModerator || isContractOwner) && state.editTeams;

const pageContent = (
  <div className="pt-3 pb-5">
    {(Viewer.role.isDevHubModerator || isContractOwner) &&
      widget("components.layout.Controls", {
        title: state.editTeams ? "Stop editing page" : "Edit page",
        onClick: () => {
          State.update({
            editTeams: !state.editTeams,
            icon: !state.editLabels
              ? "bi-pencil-square"
              : "bi-stop-circle-fill",
          });
        },
      })}
    {editMode &&
      widget("components.molecule.tile", {
        className: "",
        heading: "Some explanation",
        minHeight: 0,
        children: (
          <div>
            <p>
              <b>Step 1:</b> Create an label that needs to be restricted
            </p>
            <p>The 'any' label is reserved for moderators</p>
            <p>
              Labels that start with <b>start-with:</b>example can restrict all
              labels that start with that example.
            </p>
            <p>
              <b>Step 2:</b> Create the team and add the label, only 1 label per
              Team allowed
            </p>
            <p>Team 'moderators' is reserved</p>
            <p>
              <b>Step 3:</b> Add a member to the team
            </p>
            <p>Members can be in multiple teams</p>
            <p>
              <b>Step 4:</b> Edit the label on the team to edit it's permission
            </p>
            <p>
              The only possible permissions are: 'edit-post' and/or 'use-labels'
            </p>
          </div>
        ),
      })}
    {editMode &&
      widget("components.layout.Controls", {
        title: "Create Restricted labels",
        onClick: () => {
          State.update({
            createLabel: !state.createLabel,
          });
        },
      })}
    <div className="pt-3">
      {widget("entity.team.LabelsPermissions", {
        rules: access_info.rules_list,
        editMode: editMode,
      })}
    </div>
    {editMode && state.createLabel && (
      <div className="pt-3">
        {widget("components.organism.configurator", {
          classNames: {
            root: "mt-1",
            submit: "btn-primary",
            submitAdornment: "bi-check-circle-fill",
          },
          heading: "Restricted labels",
          isActive: state.isActive,
          isUnlocked: editMode,
          onSubmit: addLabel,
          submitLabel: "Accept",
          data: state.labelData,
          schema: {
            name: {
              inputProps: {
                min: 2,
                max: 30,
                placeholder: "Label name (starts-with:<label>  or <label>)",
                required: true,
              },
              label: "Name",
              order: 1,
            },
            description: {
              inputProps: {
                min: 2,
                max: 60,
                placeholder: "Label description",
                required: true,
              },
              label: "Description",
              order: 2,
            },
          },
        })}
      </div>
    )}

    {editMode && (
      <div class="pt-3">
        {widget("components.layout.Controls", {
          title: "Create team",
          onClick: () => {
            State.update({
              createTeam: !state.createTeam,
            });
          },
        })}
      </div>
    )}
    {editMode &&
      state.createTeam &&
      widget("components.organism.configurator", {
        classNames: {
          submit: "btn-primary",
          submitAdornment: "bi-check-circle-fill",
        },
        heading: "Team info",
        isActive: state.isActive,
        isUnlocked: editMode,
        onSubmit: addTeam,
        submitLabel: "Accept",
        data: state.teamData,
        schema: {
          name: {
            inputProps: {
              min: 2,
              max: 30,
              placeholder: "Team name",
              required: true,
            },
            label: "Name",
            order: 1,
          },
          description: {
            inputProps: {
              min: 2,
              max: 60,
              placeholder: "Team description",
              required: true,
            },
            label: "Description",
            order: 2,
          },
          label: {
            label: "Labels",
            order: 3,
            // format: "comma-separated",
            inputProps: {
              min: 2,
              max: 60,
              placeholder: Object.keys(access_info.rules_list).join(","),
              required: true,
            },
          },
        },
      })}
    {root_members
      ? Object.keys(root_members).map((member) =>
          widget(
            "entity.team.TeamInfo",
            {
              member,
              members_list: access_info.members_list,
              rules_list: access_info.rules_list,
              teamLevel: true,
              root_members,
              teamId: member,
              editMode: editMode,
            },
            member
          )
        )
      : null}
  </div>
);

return widget("components.template.app-layout", {
  children: pageContent,
});
