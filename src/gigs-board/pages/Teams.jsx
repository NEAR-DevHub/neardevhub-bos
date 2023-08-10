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

const isContractOwner = nearDevGovGigsContractAccountId == context.accountId;

State.init({
  labelData: null,
  teamData: null,
  createTeam: false,
  createLabel: false,
  isEditorActive: false,
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
  let permissions = {};
  let labels = teamData.label.split(",");
  labels.forEach((element) => {
    permissions[element] = ["edit-post", "use-labels"];
  });
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: "add_member",
      args: {
        member: `team:${teamData.name}`,
        metadata: {
          member_metadata_version: "V0",
          description: teamData.description,
          permissions,
          children: [],
          parents: [],
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

const pageContent = (
  <div className="pt-3">
    {(Viewer.role.isDevHubModerator || isContractOwner) &&
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
      })}
    </div>
    {state.createLabel &&
      widget("components.organism.editor", {
        classNames: {
          submit: "btn-primary",
          submitAdornment: "bi-check-circle-fill",
        },
        heading: "Restricted labels",
        isEditorActive: state.isEditorActive,
        isEditingAllowed: Viewer.role.isDevHubModerator || isContractOwner,
        onChangesSubmit: addLabel,
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
    {(Viewer.role.isDevHubModerator || isContractOwner) && (
      <div class="pt-3">
        {widget("components.layout.Controls", {
          title: "Create Team",
          onClick: () => {
            State.update({
              createTeam: !state.createTeam,
            });
          },
        })}
      </div>
    )}
    {state.createTeam &&
      widget("components.organism.editor", {
        classNames: {
          submit: "btn-primary",
          submitAdornment: "bi-check-circle-fill",
        },
        heading: "Team info",
        isEditorActive: state.isEditorActive,
        isEditingAllowed: Viewer.role.isDevHubModerator || isContractOwner,
        onChangesSubmit: addTeam,
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
            format: "comma-separated",
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
            },
            member
          )
        )
      : null}
  </div>
);

return widget("components.layout.Page", {
  children: pageContent,
});
