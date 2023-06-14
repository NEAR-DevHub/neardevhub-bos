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

State.init({
  copiedShareUrl: false,
});

const canEdit =
  (Near.view(
    nearDevGovGigsContractAccountId,
    "get_access_control_info"
  ).members_list["team:moderators"]?.children?.includes?.(context.accountId) ??
    false) ||
  (
    Near.view(
      nearDevGovGigsContractAccountId,
      "get_community",
      JSON.stringify({ handle: communityHandle })
    )?.admins ?? []
  ).includes(context.accountId);

const shareUrl = window.location.href;

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

const topicTabs = [
  {
    defaultActive: true,
    iconClass: "bi bi-house-door",
    path: "community.Overview",
    title: "Overview",
  },
  {
    iconClass: "bi bi-chat-square-text",
    path: "community.Discussions",
    title: "Discussions",
  },
  {
    iconClass: "bi bi-coin",
    path: "community.Sponsorship",
    title: "Sponsorship",
  },
  {
    iconClass: "bi bi-calendar",
    path: "community.Events",
    title: "Events",
  },
  {
    iconClass: "bi bi-github",
    path: "community.github",
    title: "GitHub",
  },
  {
    iconClass: "bi bi-telegram",
    path: "community.Telegram",
    title: "Telegram",
  },
];

const buttonString = `
height: 40px;
font-size: 14px;
border-color: #e3e3e0;
`;

const Link = styled.a`
  ${buttonString}
`;

const Button = styled.button`
  ${buttonString}
`;

const BannerImage = styled.img`
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

const CommunityHeader = ({ handle, label, tab }) => {
  return (
    <Header className="d-flex flex-column gap-3 px-4 pt-3">
      <BannerImage
        src={props.banner_url}
        className="object-fit-cover"
        alt="Community Banner"
      ></BannerImage>
      <div className="d-md-flex d-block justify-content-between container">
        <div className="d-md-flex d-block align-items-end">
          <div className="position-relative">
            <SizedDiv>
              <LogoImage
                src={props.logo_url}
                alt="Community Icon"
                width="150"
                height="150"
                className="border border-3 border-white rounded-circle shadow position-absolute"
              ></LogoImage>
            </SizedDiv>
          </div>
          <div>
            <div className="h1 pt-3 ps-3 text-nowrap">{props.name}</div>
            <div className="ps-3 pb-2 text-secondary">{props.description}</div>
          </div>
        </div>
        <div className="d-flex align-items-end">
          {canEdit && (
            <Link
              href={href("community.new", { label })}
              className="border border-1 text-nowrap rounded-pill p-2 m-2 bg-white text-dark font-weight-bold"
            >
              <i className="bi bi-gear" /> Edit Community
            </Link>
          )}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Copy URL to clipboard</Tooltip>}
          >
            <Button
              type="button"
              className="ms-3 border border-1 text-nowrap rounded-pill p-2 m-2 bg-white text-dark font-weight-bold"
              onMouseLeave={() => {
                State.update({ copiedShareUrl: false });
              }}
              onClick={() => {
                clipboard.writeText(shareUrl).then(() => {
                  State.update({ copiedShareUrl: true });
                });
              }}
            >
              {state.copiedShareUrl ? (
                <i className="bi bi-16 bi-check"></i>
              ) : (
                <i className="bi bi-16 bi-link-45deg"></i>
              )}
              Share
            </Button>
          </OverlayTrigger>
        </div>
      </div>

      <NavUnderline className="nav">
        {topicTabs.map(({ defaultActive, path, title }) =>
          title ? (
            <li className="nav-item" key={title}>
              <a
                aria-current={defaultActive && "page"}
                className={[
                  "d-inline-flex gap-2",
                  tab === title ? "nav-link active" : "nav-link",
                ].join(" ")}
                href={href(path, { handle })}
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
