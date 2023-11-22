const {
  hasModerator,
  getFeaturedCommunities,
  getRootMembers,
  getAccessControlInfo,
} = VM.require("${REPL_DEVHUB}/widget/core.adapter.devhub-contract");

const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (
  !getFeaturedCommunities ||
  !hasModerator ||
  !getRootMembers ||
  !href ||
  !getAccessControlInfo
) {
  return <p>Loading modules...</p>;
}

const AdministrationSettings = {
  communities: {
    maxFeatured: 4,
  },
};

const CommunityFeaturingSchema = {
  handle: {
    label: "Community handle",

    hints: {
      disabled: `You can only add ${AdministrationSettings.communities.maxFeatured} communities at a time`,
    },

    inputProps: { min: 3, max: 40, required: true },
  },
};

const featuredCommunityList = getFeaturedCommunities();

const isDevHubModerator = hasModerator({
  account_id: context.accountId,
});

const rootMembers = getRootMembers();
const accessControlInfo = getAccessControlInfo();

const teamNames = Object.keys(rootMembers || {});
const [alertMessage, setAlertMessage] = useState("");

const noPermissionBanner = (
  <div
    className="d-flex flex-column justify-content-center align-items-center"
    style={{ height: 384 }}
  >
    <h2 className="alert alert-danger">
      Your account does not have administration permissions.
    </h2>
  </div>
);

if (!isDevHubModerator) {
  return noPermissionBanner;
}

const featuredCommunityHandles = featuredCommunityList.map(
  ({ handle }) => handle
);

const addFeaturedCommunity = ({ handle }) =>
  Near.call(devHubAccountId, "set_featured_communities", {
    handles: Array.from(new Set(featuredCommunityHandles).add(handle).values()),
  });

const removeFeaturedCommunity = ({ handle: input }) =>
  Near.call(devHubAccountId, "set_featured_communities", {
    handles: featuredCommunityHandles.filter((handle) => handle !== input),
  });

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
`;

function createNewTeam({
  teamName,
  description,
  label,
  editPost,
  useLabels,
  members,
}) {
  let txn = [];

  if (rootMembers.includes(`team:${teamName}`)) {
    return setAlertMessage("This team name already exists");
  }
  const allLabels = Object.keys(accessControlInfo.rules_list);
  if (allLabels.includes(label)) {
    return setAlertMessage("This label is already restricted by another team");
  }

  let membersAndTeams = Object.keys(accessControlInfo.members_list);
  members.forEach((member) => {
    // if Contract panic member does not exist in the members_list
    if (!membersAndTeams.includes(member)) {
      // Add member
      txn.push({
        contractName: "${REPL_DEVHUB_CONTRACT}",
        methodName: "add_member",
        args: {
          member: member,
          metadata: {
            member_metadata_version: "V0",
            description: "",
            permissions: {},
            children: [],
            parents: [],
          },
        },
        deposit: Big(0).pow(21),
        gas: Big(10).pow(12).mul(100),
      });
    }
  });

  // Check edit team
  Near.call([
    ...txn,
    {
      contractName: "${REPL_DEVHUB_CONTRACT}",
      methodName: "add_member",
      args: {
        member: `team:${teamName}`,
        metadata: {
          member_metadata_version: "V0",
          description: description,
          permissions: {
            [label]: [
              ...(editPost ? ["edit-post"] : []),
              ...(useLabels ? ["use-labels"] : []),
            ],
          },
          children: members,
          parents: [],
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

const [createTeam, setCreateTeam] = useState(false);

return (
  <Container>
    <div className="d-flex flex-column gap-4 p-4">
      <h1>Moderators</h1>
      {teamNames.includes("team:moderators") && (
        <>
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.team.TeamInfo"}
            props={{
              teamName: "team:moderators",
            }}
          />
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.atom.Alert"
            props={{
              onClose: () => setAlertMessage(""),
              message: alertMessage,
            }}
          />
        </>
      )}
      <h1>Restricted Labels</h1>
      <h5>
        Create special labels and control who can use and edit posts with those
        labels.
      </h5>
      {!createTeam ? (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"}
          props={{
            onClick: () => setCreateTeam(true),
            title: "Create label",
          }}
        />
      ) : (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.entity.team.Configurator"}
          props={{
            onCancel: () => setCreateTeam(false),
            onSubmit: (params) => createNewTeam(params),
          }}
        />
      )}
      {(teamNames || []).sort().map((teamName) => {
        if (teamName === "team:moderators") return;
        return (
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.team.TeamInfo"}
            props={{
              teamName,
            }}
          />
        );
      })}
    </div>
  </Container>
);
