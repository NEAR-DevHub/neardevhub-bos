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
  State.init({
    copiedShareUrl: false,
  });

  const community = DevHub.useQuery({
    name: "community",
    params: { handle },
  });

  if (community.data === null && community.isLoading) {
    return <div>Loading...</div>;
  }

  const tabs = [
    {
      defaultActive: true,
      iconClass: "bi bi-house-door",
      route: "community.activity",
      title: "Activity",
    },

    ...[community.data?.wiki1, community.data?.wiki2]
      .filter((maybeWikiPage) => maybeWikiPage ?? false)
      .map(({ name }, idx) => ({
        params: { id: idx + 1 },
        route: "community.wiki",
        title: name,
      })),

    {
      iconClass: "bi bi-people-fill",
      route: "community.teams",
      title: "Teams",
    },

    {
      iconClass: "bi bi-kanban-fill",
      route: "community.board",
      title: "Board",
    },

    {
      iconClass: "bi bi-github",
      route: "community.github",
      title: "GitHub",
    },

    ...((community.data?.telegram_handle?.length ?? 0) > 0
      ? [
          {
            iconClass: "bi bi-telegram",
            route: "community.telegram",
            title: "Telegram",
          },
        ]
      : []),
  ];

  return (
    <div className="d-flex flex-column gap-3 bg-white">
      <Banner
        className="object-fit-cover"
        style={{
          background: `center / cover no-repeat url(${community.data.banner_url})`,
        }}
      />

      <div className="d-md-flex d-block justify-content-between container">
        <div className="d-md-flex d-block align-items-end">
          <div className="position-relative">
            <div style={{ width: 150, height: 100 }}>
              <img
                alt="Community logo"
                className="border border-3 border-white rounded-circle shadow position-absolute"
                width="150"
                height="150"
                src={community.data.logo_url}
                style={{ top: -50 }}
              />
            </div>
          </div>

          <div className="d-flex flex-column ps-3 pt-3 pb-2">
            <span className="h1 text-nowrap">{community.data.name}</span>
            <span className="text-secondary">{community.data.description}</span>
          </div>
        </div>

        <div className="d-flex align-items-end gap-3">
          {widget("components.atom.button", {
            classNames: {
              root: "btn-outline-primary",
              adornment: "bi bi-gear-wide-connected",
            },

            href: href("community.configure", { handle }),
            isHidden: !Viewer.communityPermissions({ handle }).can_configure,
            label: "Configure community",
            type: "link",
          })}

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Copy URL to clipboard</Tooltip>}
          >
            <Button
              type="button"
              className={[
                "d-flex align-items-center gap-2 border border-1 rounded-pill px-3 py-2",
                "text-dark text-nowrap font-weight-bold fs-6",
              ].join(" ")}
              onMouseLeave={() => {
                State.update({ copiedShareUrl: false });
              }}
              onClick={() => {
                clipboard
                  .writeText(
                    "https://near.org" + href("community.activity", { handle })
                  )
                  .then(() => {
                    State.update({ copiedShareUrl: true });
                  });
              }}
            >
              {state.copiedShareUrl ? (
                <i className="bi bi-16 bi-check"></i>
              ) : (
                <i className="bi bi-16 bi-link-45deg"></i>
              )}

              <span>Share</span>
            </Button>
          </OverlayTrigger>
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
