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

  useMutation: ({ name, params }) => () =>
    Near.asyncView(devHubAccountId, params ?? {}),
};
/* END_INCLUDE: "core/adapter/dev-hub" */

const project_mock = {
  metadata: {
    id: "3456345",
    tag: "test-project",
    name: "Test Project",
    description: "Test project please ignore",
    owner_community_handles: ["devhub-test"],
  },

  view_configs: JSON.stringify({
    "near-social-kanban": {
      type: "kanban-view",
      name: "near.social",
      id: "near-social-kanban",

      tags: {
        excluded: [],
        required: ["near-social"],
      },

      columns: [
        { tag: "widget", title: "Widget" },
        { tag: "integration", title: "Integration" },
        { tag: "feature-request", title: "Feature Request" },
      ],
    },

    "gigs-board-kanban": {
      type: "kanban-view",
      name: "Gigs Board",
      id: "gigs-board-kanban",

      tags: {
        excluded: [],
        required: ["gigs-board"],
      },

      columns: [
        { tag: "nep", title: "NEP" },
        { tag: "badges", title: "Badges" },
        { tag: "feature-request", title: "Feature Request" },
      ],
    },

    "funding-kanban": {
      type: "kanban-view",
      name: "Funding",
      id: "funding-kanban",

      tags: {
        excluded: [],
        required: ["funding"],
      },

      columns: [
        { tag: "funding-new-request", title: "New Request" },
        {
          tag: "funding-information-collection",
          title: "Information Collection",
        },
        { tag: "funding-processing", title: "Processing" },
        { tag: "funding-funded", title: "Funded" },
      ],
    },
  }),
};

const ProjectPage = ({ id, view: selectedViewId }) => {
  const project =
    {
      data: project_mock,
    } ?? DevHub.useQuery({ name: "project", params: { id } });

  const viewConfigs = Object.values(
    JSON.parse(project.data?.view_configs ?? "{}")
  );

  console.log(viewConfigs);

  return community.data === null && community.isLoading ? (
    <div>Loading...</div>
  ) : (
    widget("entity.project.layout", {
      ...(project.data?.metadata ?? {}),

      children:
        project.data === null ? (
          <div class="alert alert-danger" role="alert">
            {`Project with id ${id} doesn't exist`}
          </div>
        ) : (
          <div className="d-flex flex-column">
            <ul class="nav nav-tabs">
              {viewConfigs.map((view) => (
                <li class="nav-item" key={view.id}>
                  <a
                    href={href("project", { id, view: view.id })}
                    class={`nav-link ${
                      view.id === selectedViewId ? "active" : ""
                    }`}
                  >
                    {view.name}
                  </a>
                </li>
              ))}

              <li class="nav-item" key={view.id}>
                <a
                  href={href("project", { id, view: "new" })}
                  class={`nav-link ${selectedViewId === "new" ? "active" : ""}`}
                >
                  <i class="bi bi-plus"></i>
                  <span>New view</span>
                </a>
              </li>
            </ul>

            <div class="tab-content">
              {viewConfigs.map((view) => (
                <div
                  class={`tab-pane fade ${
                    view.id === selectedViewId ? "show active" : ""
                  }`}
                  id={`view${view.id}`}
                  role="tabpanel"
                  aria-labelledby={`${view.id}-tab`}
                  tabindex="0"
                  key={view.id}
                >
                  {widget(["entity.project", view.type].join("."), {
                    ...view,
                    link: href("project", { id, view: view.id }),
                  })}
                </div>
              ))}

              {selectedViewId === "new" ? (
                <div>{widget("feature.project.view-configurator")}</div>
              ) : null}
            </div>
          </div>
        ),
    })
  );
};

return ProjectPage(props);
