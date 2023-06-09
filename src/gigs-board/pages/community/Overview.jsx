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
const SocialMediaIcons = (
  <div className="mb-2 d-flex gap-2 flex-wrap flex-column">
    <a
      className="btn btn-outline-secondary border-0 d-flex align-items-center"
      href="#/mob.near/widget/ProfilePage?accountId=self.social.near"
    >
      <i className="bi bi-person-circle"></i>
      <span className="ms-2">Person Circle</span>
    </a>
    <a
      className="btn btn-outline-secondary border-0 d-flex align-items-center"
      href="https://t.me/NearSocial"
    >
      <i className="bi bi-telegram"></i>
      <span className="ms-2">Telegram</span>
    </a>
    <a
      className="btn btn-outline-secondary border-0 d-flex align-items-center"
      href="https://github.com/NearSocial"
    >
      <i className="bi bi-github"></i>
      <span className="ms-2">GitHub</span>
    </a>
    <a
      className="btn btn-outline-secondary border-0 d-flex align-items-center"
      href="https://twitter.com/NearSocial_"
    >
      <i className="bi bi-twitter"></i>
      <span className="ms-2">Twitter</span>
    </a>
    <a
      className="btn btn-outline-secondary border-0 d-flex align-items-center"
      href="https://thewiki.near.page/near.social"
    >
      <i className="bi bi-wikipedia"></i>
      <span className="ms-2">Wikipedia</span>
    </a>
  </div>
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
];
/* END_INCLUDE: "mockcommunity.jsx" */

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

const SocialMediaIconsWithLabel = community.socials ? (
  <div className="d-flex flex-column">
    {Object.entries(community.socials).map(([key, value]) => (
      <div className="d-flex align-items-center mb-2">
        <Icon name={key} class="mr-2" />
        <a href={value} target="_blank" rel="noopener noreferrer">
          {key}
        </a>
      </div>
    ))}
  </div>
) : null;

const Overview = (
  <div>
    <Markdown
      class="card-text"
      text={overviewPost.snapshot.description}
      onMention={onMention}
    ></Markdown>
  </div>
);

const CommunitySummary = (
  <div>
    <Markdown text={community.desc} onMention={onMention} />
    {LabelsDisplay}
    {SocialMediaIcons}
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
  border: none;
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
  <Card content={CommunitySummary} title={community.title}></Card>
);

// Define a role ranking map
const roleRanking = {
  Owner: 1,
  Admin: 2,
  Moderator: 3,
  Member: 4,
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
);
s;

// Team Members List
const TeamMembersList = mockTeamMembers.map((member) => (
  <TeamMember key={member.id} member={member} />
));

// More Info Button
const MoreInfoButton = (
  <div className="row justify-content-center">
    <button type="button" class="btn btn-link">
      More Info
    </button>
  </div>
);

// Team Card
const TeamsCard = (
  <Card
    title={"Team Members"}
    content={
      <div>
        {TeamMembersList}
        {MoreInfoButton}
      </div>
    }
  ></Card>
);

return (
  <div className="container">
    <div className="row">
      <div className="col-xs-12">
        {widget("components.community.Layout", {
          label: props.label,
          tab: "Overview",
        })}
      </div>
    </div>
    <div className="row">
      <div className="col-xs-12 col-lg-8">{Overview}</div>
      <div className="col-xs-12 col-lg-4">
        {CommunityOverview}
        <br></br>
        {TeamsCard}
      </div>
    </div>
  </div>
);
