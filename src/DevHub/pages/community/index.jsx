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

const {
  nearDevGovGigsWidgetsAccountId,
  handle,
  tab,
  permissions,
  community,
  communityAddonConfigs,
  availableAddons,
} = props;

if (!tab) {
  tab = "Activity";
}

const [isLinkCopied, setLinkCopied] = useState(false);

const tabs = [
  {
    iconClass: "bi bi-house-door",
    viewer: "devgovgigs.near/widget/gigs-board.pages.community.activity",
    title: "Activity",
  },
  ...(communityAddonConfigs || []).map((addon) => ({
    title: addon.name,
    route: availableAddons.find((it) => it.id === addon.config_id).viewer,
    viewer: availableAddons.find((it) => it.id === addon.config_id).viewer,
    iconClass: addon.icon,
    params: {
      viewer: availableAddons.find((it) => it.id === addon.config_id).viewer,
      data: addon.parameters || "", // @elliotBraem not sure which will work better I guess this is needed for the wiki data but we can also add another data object inside the addon's parameters
      ...JSON.parse(addon.parameters), // this seems to work witht the wiki for now
    },
  })),
];

const onShareClick = () =>
  clipboard
    .writeText(
      `https://near.org/${nearDevGovGigsWidgetsAccountId}/widget/DevHub.App?page=community?handle=${handle}`
    ) // TODO: how should this be determined?
    .then(setLinkCopied(true));
// TODO;
let currentTab = tabs.find((tab) => tab.title == props.tab);
console.log(currentTab);
return (
  <div className="d-flex flex-column gap-3 bg-white w-100">
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
          <span className="text-secondary">{props.tab}</span>
        </div>
      </div>

      <div className="d-flex align-items-end gap-3 ms-auto">
        {permissions.can_configure && (
          <Widget
            src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Button`}
            props={{
              classNames: { root: "btn-outline-light text-dark" },
              // Need to calculate href
              href: `http://localhost:3000/${nearDevGovGigsWidgetsAccountId}/widget/DevHub.App?page=community.configuration&handle=${handle}`,
              icon: {
                type: "bootstrap_icon",
                variant: "bi-gear-wide-connected",
              },
              label: "Configure community",
              type: "link",
              nearDevGovGigsWidgetsAccountId,
            }}
          />
        )}

        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Button`}
          props={{
            classNames: { root: "btn-outline-light text-dark" },

            icon: {
              type: "bootstrap_icon",
              variant: isLinkCopied ? "bi-check" : "bi-link-45deg",
            },

            label: "Share",
            onClick: onShareClick,
            onMouseLeave: () => setLinkCopied(false),
            title: "Copy link to clipboard",
            nearDevGovGigsWidgetsAccountId,
          }}
        />
      </div>
    </div>
    <NavUnderline className="nav">
      {tabs.map(({ defaultActive, params, route, title }) =>
        title ? (
          <li className="nav-item" key={title}>
            <Link
              to={`/${nearDevGovGigsWidgetsAccountId}/widget/DevHub.App?page=community&handle=${handle}&tab=${title}`}
              aria-current={defaultActive && "page"}
              className={[
                "d-inline-flex gap-2",
                tab === title ? "nav-link active" : "nav-link",
              ].join(" ")}
              // href={href(route, { handle, ...(params ?? {}) })}
            >
              <span>{title}</span>
            </Link>
          </li>
        ) : null
      )}
    </NavUnderline>
    {/* TODO: remove */}
    <div>{tabs.find((tab) => tab.viewer == props.tab)[0]}</div>
    <div>{tabs.map((tab) => tab.viewer).join(",")}</div>
    <Widget
      src={currentTab.viewer}
      props={{
        tab: currentTab,
      }}
    />
  </div>
);
