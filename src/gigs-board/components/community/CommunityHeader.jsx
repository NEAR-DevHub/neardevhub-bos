/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  // (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
  (context.widgetSrc ?? "jgdev.near").split("/", 1)[0];

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

const Header = styled.div`
  overflow: hidden;
  background: #f3f3f3;
  margin-top: -25px;
  margin-bottom: 25px;
`;

const NavUnderline = styled.ul`
  a {
    color: #3252a6;
    text-decoration: none;
  }

  a.active {
    font-weight: bold;
    border-bottom: 2px solid #0c7283;
  }
`;

const BreadcrumbLink = styled.a`
   {
    color: #3252a6;
    text-decoration: none;
  }
`;

const BreadcrumbBold = styled.b`
   {
    color: #3252a6;
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

const CommunityHeader = ({ label, tab }) => {
  State.init({ shared: { isEditorEnabled: false } });
  Storage.set("state", state.shared);

  const onEditorToggle = () =>
    State.update((lastState) => ({
      ...lastState,

      shared: {
        ...lastState.shared,
        isEditorEnabled: !lastState.shared.isEditorEnabled,
      },
    }));

  return (
    <Header className="d-flex flex-column gap-3 px-4 pt-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <BreadcrumbLink href={href("Feed")}>DevHub</BreadcrumbLink>
        </li>

        <li className="breadcrumb-item active" aria-current="page">
          <BreadcrumbBold>{props.title}</BreadcrumbBold>
        </li>
      </ol>

      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <img src={props.icon} width="95px" height="95px"></img>

          <div>
            <div className="h5 pt-3 ps-3">{props.title}</div>
            <div className="ps-3 pb-2 text-secondary">{props.desc}</div>
          </div>
        </div>

        {widget("components.atom.toggle", {
          active: state.shared.isEditorEnabled,
          className: "visually-hidden",
          direction: "rtl",
          key: "community-editor-toggle",
          label: "( WIP ) Editor mode",
          onSwitch: onEditorToggle,
        })}
      </div>

      <NavUnderline className="nav">
        {topicTabs.map(({ defaultActive, iconClass, path, title }) =>
          title ? (
            <li className="nav-item" key={title}>
              <a
                aria-current={defaultActive && "page"}
                className={[
                  "d-inline-flex gap-2",
                  tab === title ? "nav-link active" : "nav-link",
                ].join(" ")}
                href={href(path, { label })}
              >
                {iconClass && <i className={iconClass} />}
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
