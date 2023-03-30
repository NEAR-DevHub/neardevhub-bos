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
/* END_INCLUDE: "common.jsx" */

const Grey = styled.div`
   {
    position: fixed;
    left: calc(-50vw + 50%);
    width: 100vw;
    height: 204px;
    z-index: 11;
    margin-top: 76px;

    overflow: hidden;
    background: #f3f3f3;
  }
`;

const Content = styled.div`
   {
    position: fixed;
    padding: 10px 0;
    z-index: 13;
    margin-top: 76px;
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

// TODO nav-underline is available in bootstrap: https://getbootstrap.com/docs/5.3/components/navs-tabs/#underline,
// but it's not there in near social, need write such style here
return (
  <>
    <Grey></Grey>

    <Content>
      <div aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <BreadcrumbLink href={href("Feed")}>
              Developer Governance
            </BreadcrumbLink>
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
          <li class="nav-item">
            <a
              className={
                props.tab === "Overview" ? "nav-link active" : "nav-link"
              }
              aria-current="page"
              href={href("community.Overview", { label: props.label })}
            >
              <i class="bi-house-door"> </i>
              Overview
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              className={
                props.tab === "Discussions" ? "nav-link active" : "nav-link"
              }
              href={href("community.Discussions", {
                label: props.label,
              })}
            >
              <i class="bi-chat-square-text"> </i>
              Discussions
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              className={
                props.tab === "Sponsorship" ? "nav-link active" : "nav-link"
              }
              href={href("community.Sponsorship", {
                label: props.label,
              })}
            >
              <i class="bi-kanban"> </i>
              Sponsorship
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              className={
                props.tab === "Events" ? "nav-link active" : "nav-link"
              }
              href={href("community.Events", {
                label: props.label,
                tab: "Events",
              })}
            >
              <i class="bi-calendar"> </i>
              Events
            </a>
          </li>
        </NavUnderline>
      </div>
    </Content>
  </>
);
