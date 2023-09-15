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

function trimHttps(url) {
  if (url.startsWith("https://")) {
    return url.substring(8);
  }
  return url;
}

const CommunitySummary = (community) => {
  const socialLinks = [
    ...((community.website_url?.length ?? 0) > 0
      ? [
          {
            href: `https://${trimHttps(community.website_url)}`,
            iconClass: "bi bi-globe",
            name: trimHttps(community.website_url),
          },
        ]
      : []),

    ...((community.github_handle?.length ?? 0) > 0
      ? [
          {
            href: `https://github.com/${community.github_handle}`,
            iconClass: "bi bi-github",
            name: community.github_handle,
          },
        ]
      : []),

    ...((community.twitter_handle?.length ?? 0) > 0
      ? [
          {
            href: `https://twitter.com/${community.twitter_handle}`,
            iconClass: "bi bi-twitter",
            name: community.twitter_handle,
          },
        ]
      : []),

    ...(community.telegram_handle.length > 0
      ? community.telegram_handle.map((telegram_handle) => ({
          href: `https://t.me/${telegram_handle}`,
          iconClass: "bi bi-telegram",
          name: telegram_handle,
        }))
      : []),
  ];

  return (
    <div style={{ top: "0", left: "0" }}>
      {widget("components.molecule.markdown-viewer", {
        text: community.bio_markdown,
      })}
      <small class="text-muted mb-3">
        {widget("components.atom.tag", { linkTo: "Feed", ...community })}
      </small>

      <div className="mt-3">
        {socialLinks.map((link, index) => (
          <a
            className={`mt-1 btn-outline-light text-reset border-0 d-flex align-items-center`}
            href={link.href}
            style={{ marginLeft: index !== 0 ? "0px" : "0px" }}
            key={link.href}
            target="_blank"
          >
            <i className={link.iconClass}></i>
            <span
              className="ms-1"
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

const UserList = (users) => {
  return (
    <div>
      {users.map((user, i) => (
        <div className={`row ${i < users.length - 1 ? "mb-3" : ""}`}>
          <div class="col-9">
            <span
              key={user}
              className="d-inline-flex"
              style={{ fontWeight: 500 }}
            >
              {widget("components.molecule.profile-card", {
                accountId: user,
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Sidebar = ({ handle }) => {
  const community = DevHub.get_community({ handle }) ?? null;

  if ((handle ?? null) === null) {
    return (
      <div class="alert alert-danger" role="alert">
        Error: community handle is required in sidebar
      </div>
    );
  }

  return community === null ? (
    <div>Loading...</div>
  ) : (
    <div class="col-md-12 d-flex flex-column align-items-end">
      {widget("components.molecule.tile", {
        minHeight: 0,
        children: CommunitySummary(community),
        noBorder: true,
        borderRadius: "rounded",
      })}

      <hr style={{ width: "100%", borderTop: "1px solid #00000033" }} />

      {widget("components.molecule.tile", {
        heading: "Admins",
        minHeight: 0,
        children: UserList(community.admins),
        noBorder: true,
        borderRadius: "rounded",
      })}
    </div>
  );
};

return Sidebar(props);
