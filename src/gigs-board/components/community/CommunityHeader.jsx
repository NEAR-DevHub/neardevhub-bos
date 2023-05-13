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

  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const FormCheckLabel = styled.label`
  white-space: nowrap;
`;
/* END_INCLUDE: "common.jsx" */

const Header = styled.div`
   {
    height: 204px;
    overflow: hidden;
    background: #f3f3f3;
    padding: 10px 0;
    margin-top: -25px;
    margin-bottom: 25px;
    padding-left: 32px;
  }
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

const { label, tab } = props;

const topicTabs = [
  {
    contentProps: { label },
    defaultActive: true,
    iconClass: "bi-house-door",
    path: "community.Overview",
    title: "Overview",
  },
  {
    contentProps: { label },
    iconClass: "bi-chat-square-text",
    path: "community.Discussions",
    title: "Discussions",
  },
  {
    contentProps: { label },
    iconClass: "bi-kanban",
    path: "community.Sponsorship",
    title: "Sponsorship",
  },
  {
    contentProps: { label },
    iconClass: "bi-calendar",
    path: "community.Events",
    title: "Events",
  },
  {
    contentProps: {
      /**
       * Either "new" or "view".
       **/
      action: "new",

      /**
       * Probably UUIDv4 assigned to the board upon its creation.
       * The parameter is ignored if `action` is `"new"`.
       **/
      boardId: "probablyUUIDv4",

      label,
    },

    iconClass: "bi-github",
    path: "community.GithubActivity",
    title: "Custom GitHub board title",
  },
];

// TODO nav-underline is available in bootstrap: https://getbootstrap.com/docs/5.3/components/navs-tabs/#underline,
// but it's not there in near social, need write such style here
return (
  <Header>
    <div aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <BreadcrumbLink href={href("Feed")}>DevHub</BreadcrumbLink>
        </li>

        <li class="breadcrumb-item active" aria-current="page">
          <BreadcrumbBold>{props.title}</BreadcrumbBold>
        </li>
      </ol>
    </div>

    <div class="d-flex flex-row align-items-center pb-3">
      <img src={props.icon} width="95px" height="95px"></img>

      <div>
        <div class="h5 pt-3 ps-3">{props.title}</div>
        <div class="ps-3 pb-2 text-secondary">{props.desc}</div>
      </div>
    </div>

    <div>
      <NavUnderline className="nav">
        {topicTabs.map(
          ({ contentProps, defaultActive, iconClass, path, title }, topicIdx) =>
            title ? (
              <li class="nav-item">
                <a
                  aria-current={defaultActive && "page"}
                  className={tab === title ? "nav-link active" : "nav-link"}
                  href={href(path, contentProps)}
                >
                  {iconClass && <i class={iconClass} />}
                  {title}
                </a>
              </li>
            ) : null
        )}
      </NavUnderline>
    </div>
  </Header>
);
