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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

/* INCLUDE: "core/adapter/dev-hub" */
const contractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  edit_community_github: ({ handle, github }) =>
    Near.call(contractAccountId, "edit_community_github", { handle, github }) ??
    null,

  get_access_control_info: () =>
    Near.view(contractAccountId, "get_access_control_info") ?? null,

  get_all_authors: () =>
    Near.view(contractAccountId, "get_all_authors") ?? null,

  get_all_communities: () =>
    Near.view(contractAccountId, "get_all_communities") ?? null,

  get_all_labels: () => Near.view(contractAccountId, "get_all_labels") ?? null,

  get_community: ({ handle }) =>
    Near.view(contractAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(contractAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(contractAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(contractAccountId, "get_root_members") ?? null,
};
/* END_INCLUDE: "core/adapter/dev-hub" */

if (!props.label) {
  return (
    <div class="alert alert-danger" role="alert">
      Error: handle is required
    </div>
  );
}

const CommunitySummary = (community) => {
  const socialLinks = [
    ...(community.website_url
      ? [
          {
            href: community.website_url,
            iconClass: "bi bi-globe",
            name: community.website_url,
          },
        ]
      : []),
    ...(community.github_handle
      ? [
          {
            href: `https://github.com/${github_handle}`,
            iconClass: "bi bi-github",
            name: community.github_handle,
          },
        ]
      : []),
    ...(community.twitter_handle
      ? [
          {
            href: `https://twitter.com/NearSocial_`,
            iconClass: "bi bi-twitter",
            name: community.twitter_handle,
          },
        ]
      : []),
    ...(community.telegram_handle
      ? [
          {
            href: `https://t.me/${community.telegram_handle}`,
            iconClass: "bi bi-telegram",
            name: community.telegram_handle,
          },
        ]
      : []),
  ];
  return (
    <div style={{ top: "0", left: "0" }}>
      <Markdown text={community.bio_markdown} />
      <small class="text-muted mb-3">
        {widget("components.atom.tag", { label: community.tag })}
      </small>
      <div className="mt-3">
        {socialLinks.map((link, index) => (
          <a
            className={`mt-1 btn-outline-light text-reset border-0 d-flex align-items-center`}
            href={link.href}
            style={{ marginLeft: index !== 0 ? "0px" : "0px" }}
            key={link.href}
          >
            <i className={link.iconClass}></i>
            <span className="ms-1">{link.name}</span>
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

const Sidebar = ({ label }) => {
  const community = DevHub.get_community({ handle: label });
  const root_members = DevHub.get_root_members() ?? null;

  if (root_members === null || community == null) {
    return <div>Loading...</div>;
  }

  const moderators = root_members["team:moderators"].children;

  return (
    <div class="col-md-12 d-flex flex-column align-items-end">
      {widget("components.molecule.tile", {
        heading: community.tag[0].toUpperCase() + community.tag.slice(1),
        minHeight: 0,
        children: CommunitySummary(community),
        noBorder: true,
        borderRadius: "rounded",
      })}
      <hr style={{ width: "100%", borderTop: "1px solid #00000033" }} />
      {widget("components.molecule.tile", {
        heading: "Group Moderators",
        minHeight: 0,
        children: UserList(moderators),
        noBorder: true,
        borderRadius: "rounded",
      })}
    </div>
  );
};

return Sidebar(props);
