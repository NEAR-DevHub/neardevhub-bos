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
  cursor: pointer;
  a {
    color: #151515;
    text-decoration: none;
  }

  a.active {
    font-weight: bold;
    border-bottom: 4px solid #00ec97;
  }
`;

const { tab, permissions, community, view } = props;

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

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
    view: "${REPL_DEVHUB}/widget/devhub.entity.community.Activity",
    params: {
      handle: community.handle,
    },
  },
  {
    title: "Teams",
    view: "${REPL_DEVHUB}/widget/devhub.entity.community.Teams",
    params: {
      handle: community.handle,
    },
  },
];

(community.addons || []).map((addon) => {
  addon.enabled &&
    tabs.push({
      title: addon.display_name,
      view: "${REPL_DEVHUB}/widget/devhub.page.addon",
      params: { addon },
    });
});

const onShareClick = () =>
  clipboard
    .writeText(
      href({
        gateway: "near.org",
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: { page: "community", handle: community.handle },
      })
    )
    .then(setLinkCopied(true));

let currentTab = tabs.find((it) => it.title === tab);

const CommunityName = styled.span`
  color: #151515;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 48px */
`;

const CommunityDetails = styled.span`
  color: #818181;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
`;

function trimHttps(url) {
  if (url.startsWith("https://")) {
    return url.substring(8);
  }
  return url;
}

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

const NavlinksContainer = styled.div`
  background: white;
  padding: 0 3rem;

  @media screen and (max-width: 960px) {
    padding: 0 1rem;
  }
`;

return (
  <div
    className="d-flex flex-column gap-3 w-100"
    style={{ background: "#F4F4F4" }}
  >
    <Banner
      className="object-fit-cover"
      style={{
        background: `center / cover no-repeat url(${community.banner_url})`,
      }}
    />

    <div className="container d-flex flex-wrap justify-content-between align-items-center align-items-md-start gap-4">
      <div className="d-flex flex-column ms-3">
        <div className="position-relative">
          <div style={{ width: 150, height: 45 }}>
            <img
              alt="Loading logo..."
              className="rounded-circle position-absolute"
              width="160"
              height="160"
              src={community.logo_url}
              style={{ top: -124 }}
            />
          </div>
        </div>

        <div className="d-flex flex-column gap-3 ps-md-3 pt-md-3 pb-md-2">
          <CommunityName className="text-nowrap">
            {community.name}
          </CommunityName>
          <CommunityDetails>{community.description}</CommunityDetails>
        </div>

        <div className="mt-3 ps-3 d-flex gap-3 align-items-center">
          {socialLinks.map((link, index) => (
            <a
              href={link.href}
              style={{
                marginLeft: index !== 0 ? "0px" : "0px",
                color: "#818181",
              }}
              key={link.href}
              target="_blank"
            >
              <i className={link.iconClass}></i>
            </a>
          ))}
        </div>
      </div>

      <div className="d-flex align-items-end gap-3 ms-auto mb-md-5">
        {permissions.can_configure && (
          <Link
            to={`/${REPL_DEVHUB}/widget/app?page=community.configuration&handle=${community.handle}`}
          >
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
              props={{
                classNames: { root: "btn-outline-light text-dark shadow-none" },
                notRounded: true,
                style: {
                  display: "flex",
                  padding: "0.75rem 1rem",
                  alignItems: "center",
                  gap: "16px",

                  borderRadius: "4px",
                  border: "1px solid #00EC97",
                  background: "rgba(129, 129, 129, 0.00)",
                },
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
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-outline-light text-dark shadow-none" },
            notRounded: true,
            style: {
              display: "flex",
              padding: "0.75rem 1rem",
              alignItems: "center",
              gap: "16px",

              borderRadius: "4px",
              border: "1px solid #00EC97",
              background: "rgba(129, 129, 129, 0.00)",
            },
            label: "Share ↗",
            onClick: onShareClick,
            onMouseLeave: () => setLinkCopied(false),
            title: "Copy link to clipboard",
          }}
        />
      </div>
    </div>
    <NavlinksContainer>
      <NavUnderline className="nav gap-4 my-4">
        {tabs.map(
          ({ title }) =>
            title && (
              <li className="nav-item" key={title}>
                <Link
                  to={href({
                    widgetSrc: "${REPL_DEVHUB}/widget/app",
                    params: {
                      page: "community",
                      handle: community.handle,
                      tab: title,
                    },
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
      <div
        className="my-4 d-flex align-items-center justify-content-between"
        style={{ gap: "2.5rem" }}
      >
        <div class="d-flex align-items-center justify-content-between">
          <small class="text-muted">
            <span>Required tags:</span>
            <Link
              to={href({
                widgetSrc: "${REPL_DEVHUB}/widget/app",
                params: { page: "feed", tag: community.tag },
              })}
            >
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
                props={{
                  tag: community.tag,
                }}
              />
            </Link>
          </small>
        </div>
        {context.accountId && (
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"
            }
            props={{
              title: "Post",
              href: href({
                widgetSrc: "${REPL_DEVHUB}/widget/app",
                params: {
                  page: "create",
                  labels: [community.tag],
                },
              }),
            }}
          />
        )}
      </div>
    </NavlinksContainer>
    {currentTab && (
      <div className="d-flex w-100 h-100" key={currentTab.title}>
        <Widget
          src={currentTab.view}
          props={{
            ...currentTab.params,
            view, // default view for an addon, can come as a prop from a community or from a direct link to page.addon

            // below is temporary prop drilling until kanban and github are migrated
            permissions,
            handle: community.handle,
          }}
        />
      </div>
    )}
  </div>
);
