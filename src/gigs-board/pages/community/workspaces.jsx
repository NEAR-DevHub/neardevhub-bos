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
/* INCLUDE: "core/lib/struct" */
const Struct = {
  deepFieldUpdate: (
    node,
    { input, params, path: [nextNodeKey, ...remainingPath], via: toFieldValue }
  ) => ({
    ...node,

    [nextNodeKey]:
      remainingPath.length > 0
        ? Struct.deepFieldUpdate(
            Struct.typeMatch(node[nextNodeKey]) ||
              Array.isArray(node[nextNodeKey])
              ? node[nextNodeKey]
              : {
                  ...((node[nextNodeKey] ?? null) !== null
                    ? { __archivedLeaf__: node[nextNodeKey] }
                    : {}),
                },

            { input, path: remainingPath, via: toFieldValue }
          )
        : toFieldValue({
            input,
            lastKnownValue: node[nextNodeKey],
            params,
          }),
  }),

  isEqual: (input1, input2) =>
    Struct.typeMatch(input1) && Struct.typeMatch(input2)
      ? JSON.stringify(Struct.toOrdered(input1)) ===
        JSON.stringify(Struct.toOrdered(input2))
      : false,

  toOrdered: (input) =>
    Object.keys(input)
      .sort()
      .reduce((output, key) => ({ ...output, [key]: input[key] }), {}),

  pick: (object, subsetKeys) =>
    Object.fromEntries(
      Object.entries(object ?? {}).filter(([key, _]) =>
        subsetKeys.includes(key)
      )
    ),

  typeMatch: (input) =>
    input !== null && typeof input === "object" && !Array.isArray(input),
};
/* END_INCLUDE: "core/lib/struct" */
/* INCLUDE: "core/adapter/dev-hub" */
const devHubAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  has_moderator: ({ account_id }) =>
    Near.view(devHubAccountId, "has_moderator", { account_id }) ?? null,

  edit_community: ({ handle, community }) =>
    Near.call(devHubAccountId, "edit_community", { handle, community }),

  delete_community: ({ handle }) =>
    Near.call(devHubAccountId, "delete_community", { handle }),

  edit_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "edit_community_github", { handle, github }) ??
    null,

  edit_community_board: ({ handle, board }) =>
    Near.call(devHubAccountId, "edit_community_board", { handle, board }) ??
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
const Viewer = {
  can: {
    editCommunity: (communityData) =>
      Struct.typeMatch(communityData) &&
      (communityData.admins.includes(context.accountId) ||
        Viewer.role.isDevHubModerator),
  },

  communityPermissions: ({ handle }) =>
    DevHub.useQuery("account_community_permissions", {
      account_id: context.account_id,
      community_handle: handle,
    }).data ?? {
      can_configure: false,
      can_delete: false,
    },

  role: {
    isDevHubModerator:
      DevHub.has_moderator({ account_id: context.accountId }) ?? false,
  },
};
/* END_INCLUDE: "entity/viewer" */

const workspaceSchema = {
  name: {
    inputProps: {
      min: 2,
      max: 30,
      placeholder: "Workspace name",
      required: true,
    },

    label: "Name",
    order: 1,
  },

  description: {
    label: "Description",
    order: 2,

    inputProps: {
      min: 2,
      max: 60,
      placeholder: "A short sentence describing the purpose of this workspace",
      required: true,
    },
  },
};

const CommunityWorkspacesPage = ({ handle }) => {
  State.init({
    isNewWorkspaceFormDisplayed: false,
  });

  const isToolbarHidden = state.isNewWorkspaceFormDisplayed;

  const community = DevHub.useQuery({ name: "community", params: { handle } });

  const workspacesMetadata = DevHub.useQuery({
    name: "community_workspaces_metadata",
    params: { community_handle: handle },
  });

  const onNewWorkspaceSubmit = ({ name, description }) =>
    typeof name === "string" && typeof description === "string"
      ? DevHub.create_workspace({
          author_community_handle: handle,
          metadata: { name, description },
        })
      : null;

  return workspacesMetadata.data === null && workspacesMetadata.isLoading ? (
    <div>Loading...</div>
  ) : (
    widget("entity.community.layout", {
      handle,
      path: [{ label: "Communities", pageId: "communities" }],
      title: "Workspaces",

      children: (
        <div className="d-flex flex-column gap-4">
          {!isToolbarHidden ? (
            <div className="d-flex justify-content-end gap-3">
              {Viewer.communityPermissions({ handle }).can_configure
                ? widget("components.atom.button", {
                    classNames: { adornment: "bi bi-tools" },
                    label: "New workspace",

                    onClick: () =>
                      State.update({ isNewWorkspaceFormDisplayed: true }),
                  })
                : null}
            </div>
          ) : null}

          {state.isNewWorkspaceFormDisplayed &&
            widget("components.organism.configurator", {
              fullWidth: true,
              heading: "New workspace",
              isActive: true,

              isUnlocked: Viewer.communityPermissions({ handle }).can_configure,

              onCancel: () =>
                State.update({ isNewWorkspaceFormDisplayed: false }),

              onChangesSubmit: onNewWorkspaceSubmit,
              submitLabel: "Create",
              schema: workspaceSchema,
            })}

          {workspacesMetadata.data === null ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center gap-4"
              style={{ height: 384 }}
            >
              <h5 className="h5 d-inline-flex gap-2 m-0">
                This community doesn't own any workspaces
              </h5>
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-4 w-100 h-100">
              {workspacesMetadata.data.map((metadata) =>
                widget(
                  "entity.workspace.card",

                  {
                    link: href("workspace", { id: metadata.id, dir: handle }),
                    metadata,
                  },

                  metadata.id
                )
              )}
            </div>
          )}
        </div>
      ),
    })
  );
};

return CommunityWorkspacesPage(props);
