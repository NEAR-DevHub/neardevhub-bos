const {
  useQuery,
  getAccountCommunityPermissions,
  getAvailableAddons,
  getCommunityAddonConfigs,
} = VM.require("devhub.efiz.testnet/widget/DevHub.modules.contract-sdk");

if (
  !useQuery ||
  !getAccountCommunityPermissions ||
  !getAvailableAddons ||
  !getCommunityAddonConfigs
) {
  return <p>Loading modules...</p>;
}

const Button = styled.button`
  height: 40px;
  font-size: 14px;
  border-color: #e3e3e0;
  background-color: #ffffff;
`;

const Banner = styled.div`
  max-width: 100%;
  min-height: 240px;
  height: 240px;
`;

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

const NavUnderline = styled.ul`
  border-bottom: 1px #eceef0 solid;
  cursor: pointer;
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

const { handle, tab } = props;

if (!tab) {
  tab = "Activity";
}

const community = useQuery("community", { handle });
const permissions = getAccountCommunityPermissions({
  account_id: context.accountId,
  community_handle: handle,
}) || {
  can_configure: false,
  can_delete: false,
};

if (!community.data) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>{`Community with handle "${handle}" not found.`}</h2>
    </CenteredMessage>
  );
} else if (community.isLoading) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>Loading...</h2>
    </CenteredMessage>
  );
}

community = community.data;

const [isLinkCopied, setLinkCopied] = useState(false);

const availableAddons = getAvailableAddons() || [];
const communityAddonConfigs = getCommunityAddonConfigs({ handle }) || [];

const tabs = [
  {
    iconClass: "bi bi-house-door",
    viewer: "devgovgigs.near/widget/gigs-board.pages.community.activity",
    title: "Activity",
  },
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

// var foundAddOn = (config_id) =>
//   communityAddonConfigs?.some((config) => config.config_id === config_id) ||
//   false;
// console.log(
//   "!community?.github || foundAddOn('github')",
//   !community?.github,
//   foundAddOn("github")
// );
// const tabs = [
//   {
//     defaultActive: true,
//     iconClass: "bi bi-house-door",
//     route: "community.activity",
//     title: "Activity",
//   },

//   ...(!community?.features.wiki
//     ? []
//     : [community?.wiki1, community?.wiki2]
//         .filter((maybeWikiPage) => maybeWikiPage ?? false)
//         .map(({ name }, idx) => ({
//           params: { id: idx + 1 },
//           route: "community.wiki",
//           title: name,
//         }))),

//   {
//     iconClass: "bi bi-people-fill",
//     route: "community.teams",
//     title: "Teams",
//   },

//   ...(!community?.features.board || foundAddOn("kanban")
//     ? []
//     : [
//         {
//           iconClass: "bi bi-kanban-fill",
//           route: "community.board",
//           title: "Board",
//         },
//       ]),

//   ...(!community?.github || foundAddOn("github")
//     ? []
//     : [
//         {
//           iconClass: "bi bi-github",
//           route: "community.github",
//           title: "GitHub",
//         },
//       ]),

//   ...(!community?.features.telegram ||
//   (community?.telegram_handle.length ?? 0) === 0 ||
//   foundAddOn("telegram")
//     ? []
//     : [
//         {
//           iconClass: "bi bi-telegram",
//           route: "community.telegram",
//           title: "Telegram",
//         },
//       ]),

//   ...(communityAddonConfigs || []).map((addon) => ({
//     title: addon.name,
//     route: availableAddons.find((it) => it.id === addon.config_id).viewer,
//     iconClass: addon.icon,
//     params: {
//       viewer: availableAddons.find((it) => it.id === addon.config_id).viewer,
//       data: addon.parameters || "", // @elliotBraem not sure which will work better I guess this is needed for the wiki data but we can also add another data object inside the addon's parameters
//       ...JSON.parse(addon.parameters), // this seems to work witht the wiki for now
//     },
//   })),
// ];

const onShareClick = () =>
  clipboard
    .writeText(
      `https://near.org/devgovgigs.near/widget/DevHub.App?page=community?handle=${handle}`
    ) // TODO: how should this be determined?
    .then(setLinkCopied(true));

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
        <Widget
          src="devgovgigs.near/widget/gigs-board.components.molecule.button"
          props={{
            classNames: { root: "btn-outline-light text-dark" },
            href: `https://near.org/devgovgigs.near/widget/DevHub.App?page=community?handle=${handle}`,
            icon: { type: "bootstrap_icon", variant: "bi-gear-wide-connected" },
            isHidden: !permissions.can_configure,
            label: "Configure community",
            type: "link",
          }}
        />

        <Widget
          src="devgovgigs.near/widget/gigs-board.components.molecule.button"
          props={{
            classNames: { root: "btn-outline-light text-dark" },

            icon: {
              type: "bootstrap_icon",
              variant: state.isLinkCopied ? "bi-check" : "bi-link-45deg",
            },

            label: "Share",
            onClick: onShareClick,
            onMouseLeave: () => setLinkCopied(false),
            title: "Copy link to clipboard",
          }}
        />
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
                tab === title ? "nav-link active" : "nav-link",
              ].join(" ")}
              // href={href(route, { handle, ...(params ?? {}) })}
            >
              <span>{title}</span>
            </a>
          </li>
        ) : null
      )}
    </NavUnderline>
  </div>
);
