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

    return cacheState === null
      ? { ...cacheState, ...initialState }
      : cacheState;
  },
};
/* END_INCLUDE: "core/adapter/dev-hub" */
/* INCLUDE: "entity/viewer" */
const access_control_info = DevHub.useQuery({
  name: "access_control_info",
});

const Viewer = {
  isDevHubModerator:
    access_control_info.data === null || access_control_info.isLoading
      ? false
      : access_control_info.data.members_list[
          "team:moderators"
        ]?.children?.includes?.(context.accountId) ?? false,
};
/* END_INCLUDE: "entity/viewer" */

const Header = styled.div`
  overflow: hidden;
  background: #fff;
  margin-bottom: 25px;
`;

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

const Button = styled.button`
  height: 40px;
  font-size: 14px;
  border-color: #e3e3e0;
  background-color: #ffffff;
`;

const Banner = styled.div`
  max-width: 100%;
  width: 1320px;
  height: 240px;
`;

const LogoImage = styled.img`
  top: -50px;
`;

const SizedDiv = styled.div`
  width: 150px;
  height: 100px;
`;

const CommunityHeader = ({ activeTabTitle, handle }) => {
  State.init({
    copiedShareUrl: false,
  });

  const communityData = DevHub.get_community({ handle });

  if (communityData === null) {
    return <div>Loading...</div>;
  }

  const tabs = [
    {
      defaultActive: true,
      iconClass: "bi bi-house-door",
      route: "community.activity",
      title: "Activity",
    },

    ...[communityData.wiki1, communityData.wiki2]
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
      iconClass: "bi bi-coin",
      route: "community.sponsorship",
      title: "Sponsorship",
    },

    {
      iconClass: "bi bi-github",
      route: "community.github",
      title: "GitHub",
    },

    ...((communityData?.telegram_handle?.length ?? 0) > 0
      ? [
          {
            iconClass: "bi bi-telegram",
            route: "community.telegram",
            title: "Telegram",
          },
        ]
      : []),
  ];

  const canEdit =
    Viewer.isDevHubModerator ||
    communityData?.admins?.includes?.(context.accountId);

  return (
    <Header className="d-flex flex-column gap-3">
      <Banner
        className="object-fit-cover"
        style={{
          background: `center / cover no-repeat url(${communityData.banner_url})`,
        }}
      />

      <div className="d-md-flex d-block justify-content-between container">
        <div className="d-md-flex d-block align-items-end">
          <div className="position-relative">
            <SizedDiv>
              <LogoImage
                src={communityData.logo_url}
                alt="Community logo"
                width="150"
                height="150"
                className="border border-3 border-white rounded-circle shadow position-absolute"
              />
            </SizedDiv>
          </div>

          <div>
            <div className="h1 pt-3 ps-3 text-nowrap">{communityData.name}</div>

            <div className="ps-3 pb-2 text-secondary">
              {communityData.description}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-end gap-3">
          {canEdit && (
            <a
              href={href("community.edit-info", { handle })}
              className={[
                "d-flex align-items-center gap-2 border border-1 rounded-pill px-3 py-2",
                "text-decoration-none text-dark text-nowrap font-weight-bold fs-6",
              ].join(" ")}
            >
              <i className="bi bi-gear" />
              <span>Edit information</span>
            </a>
          )}

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
    </Header>
  );
};

return CommunityHeader(props);
