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
/* INCLUDE: "core/lib/gui/navigation" */
const NavUnderline = styled.ul`
  border-bottom: 1px #eceef0 solid;

  a {
    color: #687076;
    text-decoration: none;
  }

  a.active {
    font-weight: bold;
    color: #0c7283;
    border-bottom: 4px solid #0c7283;
  }
`;
/* END_INCLUDE: "core/lib/gui/navigation" */
/* INCLUDE: "core/lib/uuid" */
const uuid = () =>
  [Date.now().toString(16)]
    .concat(
      Array.from(
        { length: 4 },
        () => Math.floor(Math.random() * 0xffffffff) & 0xffffffff
      ).map((value) => value.toString(16))
    )
    .join("-");

const withUUIDIndex = (data) => {
  const id = uuid();

  return Object.fromEntries([[id, { ...data, id }]]);
};
/* END_INCLUDE: "core/lib/uuid" */
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

  create_project_view: ({ config }) =>
    Near.call(devHubAccountId, "create_project_view", { config }) ?? null,

  edit_project_view: ({ config }) =>
    Near.call(devHubAccountId, "create_project_view", { config }) ?? null,

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
    Near.view(devHubAccountId, "check_project_permissions", {
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

const project_mock = {
  metadata: {
    id: "3456345",
    tag: "i-am-a-project-tag",
    name: "Test Project",
    description: "Test project please ignore",
    owner_community_handles: ["devhub-test"],
  },

  view_configs: {
    "near-social-kanban": {
      type: "kanban-view",
      name: "Lorem",
      id: "near-social-kanban",

      tags: {
        excluded: [],
        required: ["near-social"],
      },

      columns: [
        { id: "hr839hf2", tag: "widget", title: "Widget" },
        { id: "iu495g95", tag: "integration", title: "Integration" },
        { id: "i5hy2iu3", tag: "feature-request", title: "Feature Request" },
      ],
    },

    "gigs-board-kanban": {
      type: "kanban-view",
      name: "Ipsum",
      id: "gigs-board-kanban",

      tags: {
        excluded: [],
        required: ["gigs-board"],
      },

      columns: [
        { id: "l23r34t4", tag: "nep", title: "NEP" },
        { id: "f5rn09i4", tag: "badges", title: "Badges" },
        { id: "v33xj3u8", tag: "feature-request", title: "Feature Request" },
      ],
    },

    "funding-kanban": {
      type: "kanban-view",
      name: "Yet another kanban",
      id: "funding-kanban",

      tags: {
        excluded: [],
        required: ["funding"],
      },

      columns: [
        { id: "gf39lk82", tag: "funding-new-request", title: "New Request" },

        {
          id: "dg39i49b",
          tag: "funding-information-collection",
          title: "Information Collection",
        },

        { id: "e3if93ew", tag: "funding-processing", title: "Processing" },
        { id: "u8t3gu9f", tag: "funding-funded", title: "Funded" },
      ],
    },
  },
};

const ProjectPage = ({ dir, id, view: selectedViewId }) => {
  const project =
    {
      data: project_mock,
    } ?? DevHub.useQuery({ name: "project", params: { id } });

  const permissions = Viewer.projectPermissions(project_id);

  return project.data === null && project.isLoading ? (
    <div>Loading...</div>
  ) : (
    widget("entity.project.layout", {
      metadata: project.data?.metadata ?? {},

      path: [
        {
          label: "Projects",
          pageId: typeof dir === "string" ? "community.projects" : "projects",
          params: typeof dir === "string" ? { handle: dir } : null,
        },
      ],

      children:
        project.data === null ? (
          <div class="alert alert-danger" role="alert">
            {`Project with id ${id} doesn't exist`}
          </div>
        ) : (
          <div className="d-flex flex-column">
            <NavUnderline className="nav">
              {Object.values(project.data.view_configs).map((view) => (
                <li className="nav-item" key={view.id}>
                  <a
                    aria-current={defaultActive && "page"}
                    className={[
                      "nav-link d-inline-flex gap-2",
                      view.id === selectedViewId ? "active" : "",
                    ].join(" ")}
                    href={href("project", {
                      id: project.data.metadata.id,
                      view: view.id,
                      dir,
                    })}
                  >
                    <span>{view.name}</span>
                  </a>
                </li>
              ))}

              <li class="nav-item" key={view.id}>
                <a
                  href={href("project", { id, view: "new", dir })}
                  className={[
                    "nav-link d-flex gap-2",
                    selectedViewId === "new" ? "active" : "",
                  ].join(" ")}
                >
                  <i class="bi bi-plus-lg" />
                  <span>New view</span>
                </a>
              </li>
            </NavUnderline>

            <div class="tab-content">
              {Object.values(project.data.view_configs).map((view) => (
                <div
                  class={`tab-pane fade ${
                    view.id === selectedViewId ? "show active" : ""
                  }`}
                  role="tabpanel"
                  tabindex="0"
                  key={view.id}
                >
                  {widget("feature.project.view-configurator", {
                    config: view,
                    link: href("project", { id, view: view.id }),
                    permissions,
                    projectId: id,
                  })}
                </div>
              ))}

              <div
                class={`tab-pane fade ${
                  selectedViewId === "new" ? "show active" : ""
                }`}
                role="tabpanel"
                tabindex="0"
                key={view.id}
              >
                {widget("feature.project.view-configurator", { projectId: id })}
              </div>
            </div>
          </div>
        ),
    })
  );
};

return ProjectPage(props);
