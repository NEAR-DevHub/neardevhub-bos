/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${linkPropsQuery ? "?" : ""
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

if (!props.label) {
  return (
    <div class="alert alert-danger" role="alert">
      Error: label is required
    </div>
  );
}

const community = communities[props.label];

const overviewPost = Near.view(nearDevGovGigsContractAccountId, "get_post", {
  post_id: community.overviewId,
});
if (!overviewPost) {
  return <div>Loading ...</div>;
}

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

const Overview = (
  <div>
    <Markdown
      class="card-text"
      text={overviewPost.snapshot.description}
      onMention={onMention}
    ></Markdown>
  </div>
);

const SocialMediaIcons = (
  <div className="mb-2 d-flex gap-2 flex-wrap">
    <a
      className="btn btn-outline-secondary border-0"
      href="#/mob.near/widget/ProfilePage?accountId=self.social.near"
    >
      <i className="bi bi-person-circle"></i>
    </a>
    <a
      className="btn btn-outline-secondary border-0"
      href="https://t.me/NearSocial"
    >
      <i className="bi bi-telegram"></i>
    </a>
    <a
      className="btn btn-outline-secondary border-0"
      href="https://github.com/NearSocial"
    >
      <i className="bi bi-github"></i>
    </a>
    <a
      className="btn btn-outline-secondary border-0"
      href="https://twitter.com/NearSocial_"
    >
      <i className="bi bi-twitter"></i>
    </a>
    <a
      className="btn btn-outline-secondary border-0"
      href="https://thewiki.near.page/near.social"
    >
      <i className="bi bi-wikipedia"></i>
    </a>
  </div>
);

const CommunitySummary = (
  <div>
    {/* Use short description from communities data */}
    <Markdown text={community.desc} onMention={onMention} />
    {SocialMediaIcons}
    <div className="d-flex justify-content-between align-items-center">
    </div>
  </div>
);

// const CommunityOverview = (
//   <Card
//     // Use title from communities data
//     title={community.title + " Overview"}
//     content={CommunitySummary}
//   />
// );

/* Card components */
const CardContainer = styled.div`
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    `;

const CardTitle = styled.h3`
    margin-bottom: 8px;
    `;

const CardContent = styled.p`
    margin-bottom: 8px;
    `;

const Card = ({ title, content }) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardContent>{content}</CardContent>

    </CardContainer>
  );
};

const CommunityOverview = (
  <Card
    content={CommunitySummary}
    title={community.title}>
  </Card>
);
const mockTeamMembers = [
  {
    id: "code_king.near",
    role: "Admin",
    avatar: "https://avatars.dicebear.com/api/avataaars/code_king.svg",
  },
  {
    id: "java_jester.near",
    role: "Moderator",
    avatar: "https://avatars.dicebear.com/api/avataaars/java_jester.svg",
  },
  {
    id: "css_queen.near",
    role: "Owner",
    avatar: "https://avatars.dicebear.com/api/avataaars/css_queen.svg",
  },
  {
    id: "js_joker.near",
    role: "Member",
    avatar: "https://avatars.dicebear.com/api/avataaars/js_joker.svg",
  },
  {
    id: "python_princess.near",
    role: "Admin",
    avatar: "https://avatars.dicebear.com/api/avataaars/python_princess.svg",
  }
];

// Define a role ranking map
const roleRanking = {
  "Owner": 1,
  "Admin": 2,
  "Moderator": 3,
  "Member": 4,
};

// Function to sort members by role
const sortMembersByRole = (a, b) => {
  return roleRanking[a.role] - roleRanking[b.role];
};

const sortedTeamMembers = mockTeamMembers.sort(sortMembersByRole);

const TeamMember = ({ member }) => (
  <div className="d-flex align-items-center mb-3 justify-content-between">
    <div className="d-flex align-items-center">
      <img
        src={member.avatar}
        alt={member.id}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        className="mr-3"
      />
      <strong>{member.id}</strong>
    </div>
    <span>{member.role}</span>
  </div>
);s

// Team Members List
const TeamMembersList = mockTeamMembers.map((member) => (
  <TeamMember key={member.id} member={member} />
));

// More Info Button
const MoreInfoButton = (
  <div className="row justify-content-center">
    <button type="button" class="btn btn-link">More Info</button>
  </div>
);

// Team Card
const TeamsCard = (
  <Card title={"Team Members"} content={<div>{TeamMembersList}{MoreInfoButton}</div>}></Card>
);

return (
  <div className="row">
    <div className="col-xs-12 col-md-8">
      {widget("components.community.Layout", {
        label: props.label,
        tab: "Overview",
        children: Overview,
      })}
    </div>
    <div className="col-xs-12 col-md-4">
      {CommunityOverview}
      <br></br>
      {TeamsCard}
    </div>
  </div>
);
