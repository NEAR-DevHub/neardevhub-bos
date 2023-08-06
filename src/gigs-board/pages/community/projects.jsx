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
  edit_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "edit_community_github", { handle, github }) ??
    null,

  create_project: ({ tag, name, description }) =>
    Near.call(devHubAccountId, "create_project", { tag, name, description }) ??
    null,

  update_project_metadata: ({ metadata }) =>
    Near.call(devHubAccountId, "update_project_metadata", { metadata }) ?? null,

  get_project_views_metadata: ({ project_id }) =>
    Near.view(devHubAccountId, "get_project_views_metadata", { project_id }) ??
    null,

  create_project_view: ({ project_id, view }) =>
    Near.call(devHubAccountId, "create_project_view", { project_id, view }) ??
    null,

  get_project_view: ({ project_id, view_id }) =>
    Near.view(devHubAccountId, "get_project_view", { project_id, view_id }) ??
    null,

  update_project_view: ({ project_id, view }) =>
    Near.call(devHubAccountId, "create_project_view", { project_id, view }) ??
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

  projectPermissions: (projectId) =>
    Near.view(devHubAccountId, "get_project_permissions", {
      id: projectId,
    }) ?? { can_configure: false },

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

const projectSchema = {
  name: {
    inputProps: {
      min: 2,
      max: 30,
      placeholder: "Project name",
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
      placeholder: "Describe your project in one short sentence.",
      required: true,
    },
  },

  tag: {
    inputProps: {
      min: 2,
      max: 30,
      placeholder: "awesome-app",
      required: true,
    },

    label: "Tag",
    order: 3,
  },
};

const project_mock = {
  metadata: {
    id: "3456345",
    tag: "i-am-a-project-tag",
    name: "Test Project",
    description: "Test project please ignore",
    owner_community_handles: ["devhub-test"],
  },
};

const onNewProjectSubmit = ({ tag, name, description }) =>
  typeof tag === "string" &&
  typeof name === "string" &&
  typeof description === "string"
    ? DevHub.create_project({ tag, name, description })
    : null;

const CommunityProjectsPage = ({ handle }) => {
  State.init({
    isNewProjectFormDisplayed: false,
  });

  const community = DevHub.useQuery({ name: "community", params: { handle } });

  const community_projects_metadata =
    { data: [project_mock.metadata] } ??
    DevHub.useQuery({
      name: "community_projects_metadata",
      params: { community_handle: handle },
    });

  const isToolbarHidden = state.isNewProjectFormDisplayed;

  return community_projects_metadata.data === null &&
    community_projects_metadata.isLoading ? (
    <div>Loading...</div>
  ) : (
    widget("entity.community.layout", {
      handle,
      path: [{ label: "Communities", pageId: "communities" }],
      title: "Projects",

      children: (
        <div className="d-flex flex-column gap-4">
          {!isToolbarHidden ? (
            <div className="d-flex justify-content-end gap-3">
              {Viewer.can.editCommunity(community.data)
                ? widget("components.atom.button", {
                    classNames: { adornment: "bi bi-tools" },
                    label: "New project",

                    onClick: () =>
                      State.update({ isNewProjectFormDisplayed: true }),
                  })
                : null}
            </div>
          ) : null}

          {state.isNewProjectFormDisplayed &&
            widget("components.organism.editor", {
              fullWidth: true,
              heading: "New project",
              isEditorActive: true,
              isEditingAllowed: Viewer.can.editCommunity(community.data),

              onCancel: () =>
                State.update({ isNewProjectFormDisplayed: false }),

              onChangesSubmit: onNewProjectSubmit,
              submitLabel: "Create",
              schema: projectSchema,
            })}

          {community_projects_metadata.data === null ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center gap-4"
              style={{ height: 384 }}
            >
              <h5 className="h5 d-inline-flex gap-2 m-0">
                This community doesn't own any projects
              </h5>
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-4" style={{ minHeight: 384 }}>
              {community_projects_metadata.data.map((metadata) =>
                widget(
                  "entity.project.card",

                  {
                    link: href("project", { id: metadata.id, dir: handle }),
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

return CommunityProjectsPage(props);
