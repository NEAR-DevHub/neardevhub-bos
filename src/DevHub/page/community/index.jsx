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

const { tab, permissions, community } = props;

const { href } = VM.require(
  "${REPL_DEVHUB}/widget/DevHub.modules.utils"
);

if (!href) {
  return <></>;
}

if (!tab) {
  tab = "Activity";
}

const [isLinkCopied, setLinkCopied] = useState(false);

const tabs = [
  {
    title: "Activity",
    view: "${REPL_DEVHUB}/widget/DevHub.entity.community.Activity",
    params: {
      handle: community.handle,
    },
  },
  {
    title: "Teams",
    view: "${REPL_DEVHUB}/widget/DevHub.entity.community.Teams",
    params: {
      handle: community.handle,
    },
  },
];


(community.addons || []).map((addon) => {
  addon.enabled && tabs.push({
    title: addon.display_name,
    view: "${REPL_DEVHUB}/widget/DevHub.page.addon",
    params: {
      addon_id: addon.addon_id,
      config: JSON.parse(addon.parameters),
    },
  });
});
const onShareClick = () =>
  clipboard
    .writeText(
      href({
        gateway: "near.org",
        widgetSrc: "${REPL_DEVHUB}/widget/DevHub.App",
        params: { page: "community", handle: community.handle },
      })
    )
    .then(setLinkCopied(true));

let currentTab = tabs.find((it) => it.title === tab);

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
        </div>
      </div>

      <div className="d-flex align-items-end gap-3 ms-auto">
        {permissions.can_configure && (
          <Link
            to={`/${REPL_DEVHUB}/widget/DevHub.App?page=community.configuration&handle=${community.handle}`}
          >
            <Widget
              src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
              props={{
                classNames: { root: "btn-outline-light text-dark" },
                icon: {
                  type: "bootstrap_icon",
                  variant: "bi-gear-wide-connected",
                },
                label: "Configure community",
              }}
            />
          </Link>
        )}

        <Widget
          src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
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
          }}
        />
      </div>
    </div>
    <NavUnderline className="nav">
      {tabs.map(
        ({ title }) =>
          title && (
            <li className="nav-item" key={title}>
              <Link
                to={href({
                  widgetSrc: "${REPL_DEVHUB}/widget/DevHub.App",
                  params: { page: "community", handle: community.handle, tab: title },
                })}
                aria-current={tab === title && "page"}
                className={[
                  "d-inline-flex gap-2",
                  tab === title ? "nav-link active" : "nav-link",
                ].join(" ")}
              >
                <span>{title}</span>
              </Link>
            </li>
          )
      )}
    </NavUnderline>
    <div className="d-flex w-100 h-100">
      {currentTab && <Widget src={currentTab.view} props={currentTab.params} />}
    </div>
  </div>
);
