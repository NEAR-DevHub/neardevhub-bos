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

/* INCLUDE: "communities.jsx" */
const communities = {
  "zero-knowledge": {
    overviewId: 397,
    eventsId: 401,
    icon: "https://ipfs.near.social/ipfs/bafkreiajwq6ep3n7veddozji2djv5vviyisabhycbweslvpwhsoyuzcwi4",
    cover:
      "https://ipfs.near.social/ipfs/bafkreihgxg5kwts2juldaeasveyuddkm6tcabmrat2aaq5u6uyljtyt7lu",
    title: "Zero Knowledge",
    desc: "Building a zero knowledge ecosystem on NEAR.",
  },
  protocol: {
    overviewId: 412,
    eventsId: 413,
    icon: "https://ipfs.near.social/ipfs/bafkreidpitdafcnhkp4uyomacypdgqvxr35jtfnbxa5s6crby7qjk2nv5a",
    cover:
      "https://ipfs.near.social/ipfs/bafkreicg4svzfz5nvllomsahndgm7u62za4sib4mmbygxzhpcl4htqwr4a",
    title: "Protocol",
    desc: "Supporting the ongoing innovation of the NEAR Protocol.",
  },
  tooling: {
    overviewId: 416,
    eventsId: 417,
    icon: "https://ipfs.near.social/ipfs/bafkreie2eaj5czmpfe6pe53kojzcspgozebdsonffwvbxtpuipnwahybvi",
    cover:
      "https://ipfs.near.social/ipfs/bafkreiehzr7z2fhoqqmkt3z667wubccbch6sqtsnvd6msodyzpnf72cszy",
    title: "Tooling",
    desc: "Supporting the ongoing innovation of tooling.",
  },
  "contract-standards": {
    overviewId: 414,
    eventsId: 415,
    icon: "https://ipfs.near.social/ipfs/bafkreiepgdnu7soc6xgbyd4adicbf3eyxiiwqawn6tguaix6aklfpir634",
    cover:
      "https://ipfs.near.social/ipfs/bafkreiaowjqxds24fwcliyriintjd4ucciprii2rdxjmxgi7f5dmzuscey",
    title: "Contract Standards",
    desc: "Coordinating the contribution to the NEAR dapp standards.",
  },
};
/* END_INCLUDE: "communities.jsx" */

/* INCLUDE: "mockcommunity.jsx" */
const socialLinks = [
  {
    href: "#/mob.near/widget/ProfilePage?accountId=self.social.near",
    iconClass: "bi bi-globe",
    label: community.title,
  },

  {
    href: "https://github.com/NearSocial",
    iconClass: "bi bi-github",
    label: community.title,
  },
  {
    href: "https://twitter.com/NearSocial_",
    iconClass: "bi bi-twitter",
    label: community.title,
  },
  {
    href: "https://t.me/NearSocial",
    iconClass: "bi bi-telegram",
    label: community.title,
  },
];

const mockTeamMembers = [
  // {
  //   id: "${community.member}",
  //   role: "${community.role}",
  //   avatar: "${community.profileImage}",
  //   wallet: "${community.accountId}",
  // },

  {
    id: "css_queen",
    role: "Owner",
    avatar:
      "https://paras.id/_next/image?url=https%3A%2F%2Fparas-cdn.imgix.net%2F219f4d987a6c8e3c5af385c0a7c892477f870941%3Fw%3D400&w=828&q=75",
    wallet: "@css_queen.near",
  },
  {
    id: "js_joker",
    role: "Moderator",
    avatar:
      "https://paras.id/_next/image?url=https%3A%2F%2Fparas-cdn.imgix.net%2F6196b861da8a91415f23e551a5e88c0ac0671c0d%3Fw%3D400&w=1080&q=75",
    wallet: "@js_joker.near",
  },
  {
    id: "python_princess",
    role: "Admin",
    avatar:
      "https://paras.id/_next/image?url=https%3A%2F%2Fparas-cdn.imgix.net%2Fca017da093f9b4b0ee8fae85bb3ef57477590674%3Fw%3D400&w=2048&q=75",
    wallet: "@python_princess.near",
  },
];
/* END_INCLUDE: "mockcommunity.jsx" */
if (!props.label) {
  return (
    <div class="alert alert-danger" role="alert">
      Error: label is required
    </div>
  );
}

const label = props.label;

const discussionRequiredPosts =
  Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
    label,
  }) ?? [];

const community = communities[props.label];

const onMention = (accountId) => (
  <span key={accountId} className="d-inline-flex" style={{ fontWeight: 500 }}>
    <Widget
      src="neardevgov.near/widget/ProfileLine"
      props={{
        accountId: accountId.toLowerCase(),
        hideAccountId: true,
        tooltip: true,
      }}
    />
  </span>
);

// START OF SIDEBAR
// Social Links Master Styling
const SocialLink = ({ link, index }) => (
  <a
    className={`btn btn-outline-secondary border-0 d-flex align-items-center`}
    href={link.href}
    style={{ marginLeft: index !== 0 ? "0px" : "0px" }}
  >
    <i className={link.iconClass}></i>
    <span className="ms-1">{link.label || community.title}</span>
  </a>
);

// Social Media Icons
const SocialMediaIcons = (
  <div
    className="mb-1 d-flex gap-2 flex-wrap flex-column"
    style={{ padding: "0px" }}
  >
    {socialLinks.map((link, index) => (
      <SocialLink key={index} link={link} index={index} />
    ))}
  </div>
);

const CommunitySummary = (
  <div style={{ top: "0", left: "0" }}>
    <Markdown text={community.desc} onMention={onMention} />
    <h3 className="mt-2 mb-2">{community.label}</h3>
    <div className="row mb-2 align-items-center d-flex justify-content-between">
      <div className="col-auto">
        <div className="d-flex align-items-center">
          <a href={href("Feed", { label })} key={label}>
            <span
              className="badge text-bg-grey ms-1"
              style={{
                color: "rgba(0, 0, 0, 0.7)",
                fontSize: "1em",
                fontWeight: "normal",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                padding: "0.2em 0.5em",
              }}
            >
              <div>{label}</div>
            </span>
          </a>
        </div>
      </div>
    </div>
    <br></br>
    <br></br>
    {socialLinks.map((link, index) => (
      <SocialLink key={index} link={link} index={index} />
    ))}
  </div>
);

const Card = ({ content }) => (
  <div
    className="card"
    style={{
      border: "none",
    }}
  >
    <div className="card-body">
      <p className="card-text">{content}</p>
    </div>
  </div>
);

const CommunityOverview = (
  <Card title={`${community.title} Overview`} content={CommunitySummary}></Card>
);

const TeamMember = ({ member }) => (
  <div className="d-flex align-items-start mb-1 justify-content-start">
    <img
      src={member.avatar}
      alt={member.id}
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        marginRight: "10px",
      }}
    />
    <div style={{ paddingTop: "7px" }}>
      <h6 style={{ fontSize: "110%", fontWeight: "bold", marginBottom: "0" }}>
        {member.id}
      </h6>
      <p style={{ fontSize: "100%" }}>{member.wallet}</p>
    </div>
  </div>
);

// Team Members List
const TeamMembersList = mockTeamMembers.map((member) => (
  <TeamMember key={member.id} member={member} />
));

// More Info Button
const MoreInfoButton = (
  <div className="d-flex justify-content-start">
    <button
      type="button"
      class="btn"
      style={{
        color: "black",
        fontSize: "0.8rem",
        fontWeight: "bold",
      }}
      href="#"
    >
      See More
    </button>
  </div>
);

// Team Card
const TeamsCard = (
  <div style={{ width: "100%" }}>
    <Card
      title={"Team Members"}
      content={
        <div>
          <h5
            style={{
              fontSize: "1.3rem",
              fontWeight: "800",
              marginBottom: "20px",
            }}
          >
            Group Moderators
          </h5>
          {TeamMembersList}
          {MoreInfoButton}
        </div>
      }
    ></Card>
  </div>
);

// Define the Sidebar component
const Sidebar = () => (
  <div class="col-md-12 d-flex flex-column align-items-end">
    {CommunityOverview}
    <hr style={{ width: "100%", borderTop: "4px solid #00000033" }} />
    {TeamsCard}
  </div>
);

// Define the layout for the page
const PageLayout = () => (
  <div class="container">
    <div class="row">
      <Sidebar />
    </div>
  </div>
);

return <PageLayout />;
// END OF SIDEBAR

// USAGE
// copy and paste this into the return function of a page you want the sidebar on
// make sure to add `col-mb-9` to the class of the div you want to
// take up 2/3 of the screen to the left

// then make sure to add `col-mb-3` to the class of the div you want to
// take up 1/3 of the screen to the

{
  /* <div class="col-4 container-fluid">
  <Widget
    src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.community.Sidebar`}
    props={{
      metadata: metadata,
      accountId: accountId,
      widgetName: widgetName,
      label: props.label,
    }}
  />
</div> */
}
