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

const Scroll = styled.div`
   {
    z-index: -1;
    margin-top: calc(-24px + 100px + 25px + 200px);
  }
`;

return (
  <>
    {widget("components.layout.Banner")}
    {widget("components.layout.CommunityHeader", {
      title: props.title,
      icon: props.icon,
      desc: props.desc,
    })}
    <Scroll>
      <div>
        <Markdown class="card-text" text={"hello\n# aaa"}></Markdown>
        Zero Knowledge (ZK) technology is gaining significant traction within
        the NEAR community. This space brings together individuals, experts, and
        organizations who are interested in developing a ZK ecosystem on NEAR.
        Vision Drive the development of ZK technology on NEAR. Organization
        There are two main groups involved in the Zero Knowledge community:
        Working Group This formal group makes official decisions on proposals
        and questions related to Zero Knowledge. They follow a strict process to
        review proposals, recommend funding to DAO or grant programs, and hold
        grant takers accountable. They engage with the broader community to
        understand their needs and encourage ideation. Members Anton Yezhov
        (yezhov.near) Garvit Goel (Garvit Goel) Igor Gulamov (Igor Gulamov)
        Community Group This group provides an informal space to anyone
        interested in Zero Knowledge and its applications. This self-organized
        group is open to anyone and its not controlled by anyone but the people
        who are organizing it. It offers a great opportunity to connect with
        others to discuss ideas, share resources, and collaborate on projects.
      </div>
    </Scroll>
  </>
);
