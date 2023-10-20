const { handle, Children } = props;

const {
  getAccountCommunityPermissions,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  getCommunity,
  setCommunityAddons,
} = VM.require("${REPL_DEVHUB}/widget/DevHub.modules.contract-sdk");

if (
  !getCommunity ||
  !getAccountCommunityPermissions ||
  !createCommunity ||
  !updateCommunity ||
  !deleteCommunity ||
  !setCommunityAddons
) {
  return <p>Loading modules...</p>;
}

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
// const [community, setCommunity] = useState(null);

// TODO: This doesn't work as expected, it does not catch the error
const community = Near.view("${REPL_DEVHUB_CONTRACT}", "get_community", {
  handle: handle,
});

const permissions = getAccountCommunityPermissions({
  account_id: context.accountId,
  community_handle: handle,
}) || {
  can_configure: false,
  can_delete: false,
};

if (isLoading) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>Loading...</h2>
    </CenteredMessage>
  );
} else if (!community) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>{`Community with handle "${handle}" not found.`}</h2>
    </CenteredMessage>
  );
}

function handleUpdateCommunity(v) {
  updateCommunity(v);
}

community.addons = [
  {
    // id: `${handle}-wiki-1`,
    addon_id: "wiki",
    display_name: "Screams and Whispers",
    enabled: true,
    parameters: JSON.stringify({
      title: "Screams and Whispers",
      description: "The Haunted Hack House Wiki",
      content:
        "🎃 **Hack-o-ween is Upon Us!** 🎃 Prepare to be spooked and code in the dark shadows. As the moon rises on this haunted month, Boo's Horror House Wiki welcomes you to join us for the sinister celebration of Hacktoberfest and Hack-o-ween. 🦇 **Hacktoberfest Tombstone** 🦇 Don't be scared, contribute to our open-source projects during this eerie month. Dive into the world of code and contribute your terrifyingly awesome enhancements, bug fixes, and features. Each pull request brings you one step closer to the grand prize. Who knows what dark secrets and hidden gems you'll unearth in our haunted repositories? 🕸️ **Hack-o-ween: Unmask the Coder Within** 🕸️ Halloween is a time for costumes and masks, but this Hacktoberfest, it's all about unmasking the coder within you. Join our ghoulish coding challenges, hackathons, and themed coding nights. Share your code horrors and achievements in our spooky community. 🌙 **The Boo's Horror House Wiki** 🌙 *Screams and Whispers* beckon you to explore our wiki of the supernatural and macabre. Unlock the mysteries of coding in the dark and discover eerie coding tricks and tales from the crypt. Contribute to our spine-chilling articles and be a part of this horror-themed knowledge repository. It's a month filled with frights, delights, and code that bites! Join us for Hacktoberfest and Hack-o-ween, if you dare... 🧛‍♂️💻🦉",
    }),
  },
  {
    // id: `${handle}-wiki-1`,
    addon_id: "github",
    display_name: "Github",
    enabled: true,
    parameters:
      '{"kanbanBoards":{"188c61da228--3e692fec--f183358-2f9b5409--353480a7":{"metadata":{"id":"188c61da228--3e692fec--f183358-2f9b5409--353480a7","type":"github.kanban_board","ticket":{"type":"github.kanban_ticket","features":{"id":true,"author":true,"labels":true,"type":true}}},"columns":{"188c6222856--1dccd5a2-67865a7e-2a528517-6e0d3f3a":{"description":"NEPs that need a moderator review or author revision","labelSearchTerms":["WG-protocol","S-draft"],"title":"NEW","id":"188c6222856--1dccd5a2-67865a7e-2a528517-6e0d3f3a"},"1890d1c390f-481c2ad2--5c4133a8--57c1c17a--1219b635":{"description":"NEPS that need a review by Subject Matter Experts","labelSearchTerms":["WG-protocol","S-review"],"title":"REVIEW","id":"1890d1c390f-481c2ad2--5c4133a8--57c1c17a--1219b635"},"1890d1d0d1f--64e8a5b6-2b2971b--24f4037c-2fff41ec":{"description":"NEPS in the final review stage that need the work group voting indications","labelSearchTerms":["WG-protocol","S-voting"],"title":"VOTING","id":"1890d1d0d1f--64e8a5b6-2b2971b--24f4037c-2fff41ec"},"1890d1d73d9-17f53408--6140ba2c--4f09e18e-785b6aab":{"description":"NEPS that were reviewed and approved by a work group","labelSearchTerms":["WG-protocol","S-approved"],"title":"APPROVED","id":"1890d1d73d9-17f53408--6140ba2c--4f09e18e-785b6aab"},"1890d1e444f-35d79874--108dd3c1--379d71dc--6bd6029b":{"description":"NEPs that were reviewed and rejected by a work group","labelSearchTerms":["WG-protocol","S-rejected"],"title":"REJECTED","id":"1890d1e444f-35d79874--108dd3c1--379d71dc--6bd6029b"}},"dataTypesIncluded":{"Issue":true,"PullRequest":true},"description":"Current status of NEARCORE repo where majority of protocol developments are happening","repoURL":"https://github.com/near/NEPs","ticketState":"all","title":"NEAR Protocol NEPs ( test )"}}}',
  },
  {
    // id: `${handle}-wiki-1`,
    addon_id: "kanban",
    display_name: "Kanban",
    enabled: true,
    parameters:
      '{"metadata":{"id":"18a874aa9b0-726a67cc-3d853c5-15a1ae1--59a78eb7","type":"kanban.post_board","title":"Test board","description":"test?","ticket":{"type":"kanban.post_ticket","features":{"author_avatar":false,"like_count":true,"reply_count":false,"sponsorship_request_indicator":false,"requested_grant_value":false,"requested_sponsor":false,"approved_grant_value":true,"sponsorship_supervisor":true,"tags":true,"type":true,"funding_marker":false,"funding_supervisor":true,"funds_amount":true,"likes_amount":true,"replies_amount":false,"requested_funding_sponsor":false,"requested_funds_amount":false}},"kind":"kanban-view"},"payload":{"columns":{"18a01230c6a--65c2eba2-54271c50--15895ce4-7f4b44de":{"tag":"devhub-test","title":"New column","description":"test description","id":"18a01230c6a--65c2eba2-54271c50--15895ce4-7f4b44de"}},"tags":{"excluded":[],"required":["devhub-test"]},"ticket_kind":"post-ticket","ticket":{"features":{"author":false,"replyCount":true,"tags":false,"title":true,"type":false}}}}',
  },
  {
    // id: `${handle}-wiki-1`,
    addon_id: "telegram",
    display_name: "Telegram",
    enabled: true,
    parameters: '{"telegram_handle": ["NEAR_Tools_Community_Group"]}',
  },
  {
    // id: `${handle}-wiki-1`,
    addon_id: "blog",
    display_name: "Blog",
    enabled: true,
    parameters: '{"telegram_handle": ["NEAR_Tools_Community_Group"]}',
  },
];

return (
  <Children
    permissions={permissions}
    community={community}
    setCommunityAddons={setCommunityAddons}
    createCommunity={createCommunity}
    updateCommunity={handleUpdateCommunity}
    deleteCommunity={deleteCommunity}
  />
);
