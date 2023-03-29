/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId || "devgovgigs.near".split("/", 1)[0];
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
    height: 200px;
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

// TODO nav-underline is available in bootstrap: https://getbootstrap.com/docs/5.3/components/navs-tabs/#underline,
// but it's not there in near social, need write such style here
return (
  <>
    <Grey></Grey>

    <Content>
      <div aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href={href("Feed")}>Developer Governance</a>
          </li>
          <li class="breadcrumb-item">
            <a href={href("Feed")}>Communities</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {props.title}
          </li>
        </ol>
      </div>
      <div class="d-flex flex-row align-items-center pb-3">
        <img src={props.icon}></img>
        <div>
          <div class="h5 pt-3 ps-3">{props.title}</div>
          <div class="ps-3 pb-2 text-secondary">{props.desc}</div>
        </div>
      </div>
      <div>
        <ul class="nav nav-underline">
          <li class="nav-item">
            <a
              class="nav-link active"
              aria-current="page"
              onClick={() => props.switchTab("Overview")}
            >
              <i class="bi-house-door"> </i>
              Overview
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" onClick={() => props.switchTab("Discussions")}>
              <i class="bi-chat-square-text"> </i>
              Discussions
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" onClick={() => props.switchTab("Sponsorship")}>
              <i class="bi-kanban"> </i>
              Sponsorship
            </a>
          </li>
          <li class="nav-item" onClick={() => props.switchTab("Events")}>
            <a class="nav-link">
              <i class="bi-calendar"> </i>
              Events
            </a>
          </li>
        </ul>
      </div>
    </Content>
  </>
);
