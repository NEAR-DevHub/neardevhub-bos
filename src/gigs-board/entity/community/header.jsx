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

  add_community_addon: ({ handle, config }) =>
    Near.call(devHubAccountId, "add_community_addon", {
      community_handle: handle,
      addon_config: config,
    }),

  update_community_addon: ({ handle, config }) =>
    Near.call(devHubAccountId, "update_community_addon", {
      community_handle: handle,
      addon_config: config,
    }),

  remove_community_addon: ({ handle, config_id }) =>
    Near.call(devHubAccountId, "remove_community_addon", {
      community_handle: handle,
      config_id,
    }),

  get_access_control_info: () =>
    Near.view(devHubAccountId, "get_access_control_info") ?? null,

  get_all_authors: () => Near.view(devHubAccountId, "get_all_authors") ?? null,

  get_all_communities_metadata: () =>
    Near.view(devHubAccountId, "get_all_communities_metadata") ?? null,

  get_available_addons: () =>
    Near.view(devHubAccountId, "get_available_addons") ?? null,

  get_community_addons: ({ handle }) =>
    Near.view(devHubAccountId, "get_community_addons", { handle }),
  get_community_addon_configs: ({ handle }) =>
    Near.view(devHubAccountId, "get_community_addon_configs", { handle }),

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

const Button = styled.button`
  height: 40px;
  font-size: 14px;
  border-color: #e3e3e0;
  background-color: #ffffff;
`;

const Banner = styled.div`
  max-width: 100%;
  width: 1320px;
  min-height: 240px;
  height: 240px;
`;

const CommunityHeader = ({ activeTabTitle, handle }) => {
  State.init({ isLinkCopied: false });

  const community = DevHub.get_community({ handle }),
    permissions = Viewer.communityPermissions({ handle });

  if (community === null) {
    return <div>Loading...</div>;
  }

  const availableAddons = DevHub.get_available_addons() || [];
  const communityAddons = community.addon_list || []; // DevHub.get_community_addons({handle});
  const communityAddonConfigs =
    DevHub.get_community_addon_configs({ handle }) || [];
  console.log({ availableAddons });
  console.log({ communityAddons });
  console.log({ communityAddonConfigs });
  // const availableAddons = [
  //   {
  //     "id": "wiki",
  //     "title": "Wiki",
  //     "description": "Wiki description",
  //     "configurator": "entity.addon.wiki-configurator",
  //     "viewer": "community.wiki",
  //     "icon": "bi bi-wikipedia"
  //   },
  //   {
  //     id: "github",
  //     title: "Git Hub",
  //     description: "Github description",
  //     configurator: "feature.workspace.github-view-configurator",
  //     viewer: "community.github",
  //     icon: "bi bi-github"
  //   },
  //   {
  //     "id": "kanban",
  //     "title": "Kanban",
  //     "description": "Kanban description",
  //     "configurator": "feature.workspace.kanban-view-configurator",
  //     "viewer": "community.board",
  //     "icon": "bi bi-kanban"
  //   },
  //   {
  //     "id": "telegram",
  //     "title": "Telegram",
  //     "description": "Telegram description",
  //     "configurator": "",
  //     "viewer": "community.telegram",
  //     "icon": "bi bi-telegram"
  //   },
  // ];

  // const communityAddons = [
  //   {
  //     addon_id: "wiki",
  //     name: "Wiki1",
  //     config_id: "wiki",
  //     parameters: JSON.stringify({
  //       id: 1,
  //     }),
  //     enabled: true,
  //   },
  //   {
  //     addon_id: "wiki",
  //     name: "Wiki2",
  //     config_id: "wiki2",
  //     parameters: JSON.stringify({
  //       id: 2,
  //     }),
  //     enabled: true,
  //   },
  //   {
  //     addon_id: "wiki",
  //     name: "Wiki3",
  //     config_id: "wiki3",
  //     parameters: JSON.stringify({
  //       id: 3,
  //     }),
  //     enabled: true,
  //   },
  //   {
  //     addon_id: "github",
  //     name: "GitHub", // Tab name
  //     config_id: "github",
  //     parameters: JSON.stringify({}),
  //     enabled: true,
  //   },
  //   {
  //     addon_id: "kanban",
  //     name: "Kanban", // Tab name
  //     config_id: "kanban",
  //     parameters: JSON.stringify({}),
  //     enabled: true,
  //   },
  //   {
  //     addon_id: "telegram",
  //     name: "Telegram", // Tab name
  //     config_id: "telegram",
  //     parameters: JSON.stringify({}),
  //     enabled: true,
  //   },
  // ];

  var foundAddOn = (config_id) =>
    communityAddonConfigs?.some((config) => config.config_id === config_id) ||
    false;
  console.log(
    "!community?.github || foundAddOn('github')",
    !community?.github,
    foundAddOn("github")
  );
  const tabs = [
    {
      defaultActive: true,
      iconClass: "bi bi-house-door",
      route: "community.activity",
      title: "Activity",
    },

    ...(!community?.features.wiki
      ? []
      : [community?.wiki1, community?.wiki2]
          .filter((maybeWikiPage) => maybeWikiPage ?? false)
          .map(({ name }, idx) => ({
            params: { id: idx + 1 },
            route: "community.wiki",
            title: name,
          }))),

    {
      iconClass: "bi bi-people-fill",
      route: "community.teams",
      title: "Teams",
    },

    ...(!community?.features.board || foundAddOn("kanban")
      ? []
      : [
          {
            iconClass: "bi bi-kanban-fill",
            route: "community.board",
            title: "Board",
          },
        ]),

    ...(!community?.github || foundAddOn("github")
      ? []
      : [
          {
            iconClass: "bi bi-github",
            route: "community.github",
            title: "GitHub",
          },
        ]),

    ...(!community?.features.telegram ||
    (community?.telegram_handle.length ?? 0) === 0 ||
    foundAddOn("telegram")
      ? []
      : [
          {
            iconClass: "bi bi-telegram",
            route: "community.telegram",
            title: "Telegram",
          },
        ]),

    ...(communityAddonConfigs || []).map((addon) => ({
      title: addon.name,
      route: availableAddons.find((it) => it.id === addon.config_id).viewer,
      iconClass: addon.icon,
      params: {
        viewer: availableAddons.find((it) => it.id === addon.config_id).viewer,
        data: addon.parameters || "", // @elliotBraem not sure which will work better I guess this is needed for the wiki data but we can also add another data object inside the addon's parameters
        ...JSON.parse(addon.parameters), // this seems to work witht the wiki for now
      },
    })),
  ];

  const linkCopyStateToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isLinkCopied: forcedState ?? !lastKnownState.isLinkCopied,
    }));

  const onShareClick = () =>
    clipboard
      .writeText("https://near.org" + href("community.activity", { handle }))
      .then(linkCopyStateToggle(true));

  return (
    <div className="d-flex flex-column gap-3 bg-white">
      <Banner
        className="object-fit-cover"
        style={{
          background: `center / cover no-repeat url(${community.banner_url})`,
        }}
      />

      <div className="container d-flex flex-wrap justify-content-between gap-4">
        <div className="d-flex align-items-end">
          <div className="position-relative">
            <div style={{ width: 150, height: 100 }}>
              <img
                alt="Loading logo..."
                className="border border-3 border-white rounded-circle shadow position-absolute"
                width="150"
                height="150"
                src={community.logo_url}
                style={{ top: -50 }}
              />
            </div>
          </div>

          <div className="d-flex flex-column ps-3 pt-3 pb-2">
            <span className="h1 text-nowrap">{community.name}</span>
            <span className="text-secondary">{community.description}</span>
          </div>
        </div>

        <div className="d-flex align-items-end gap-3 ms-auto">
          {widget("components.molecule.button", {
            classNames: { root: "btn-outline-light text-dark" },
            href: href("community.configuration", { handle }),
            icon: { type: "bootstrap_icon", variant: "bi-gear-wide-connected" },
            isHidden: !permissions.can_configure,
            label: "Configure community",
            type: "link",
          })}

          {widget("components.molecule.button", {
            classNames: { root: "btn-outline-light text-dark" },

            icon: {
              type: "bootstrap_icon",
              variant: state.isLinkCopied ? "bi-check" : "bi-link-45deg",
            },

            label: "Share",
            onClick: onShareClick,
            onMouseLeave: () => linkCopyStateToggle(false),
            title: "Copy link to clipboard",
          })}
        </div>
      </div>

      <NavUnderline className="nav">
        {tabs.map(({ defaultActive, params, route, title }) =>
          title ? (
            <li className="nav-item" key={title}>
              <a
                aria-current={defaultActive && "page"}
                className={[
                  "d-inline-flex gap-2",
                  activeTabTitle === title ? "nav-link active" : "nav-link",
                ].join(" ")}
                href={href(route, { handle, ...(params ?? {}) })}
              >
                <span>{title}</span>
              </a>
            </li>
          ) : null
        )}
      </NavUnderline>
    </div>
  );
};

return CommunityHeader(props);
