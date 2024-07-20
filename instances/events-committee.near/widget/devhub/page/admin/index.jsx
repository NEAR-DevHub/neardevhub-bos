const { hasModerator, getRootMembers, getAccessControlInfo } = VM.require(
  "${REPL_EVENTS}/widget/core.adapter.devhub-contract"
);

if (!hasModerator || !getRootMembers || !getAccessControlInfo) {
  return <p>Loading modules...</p>;
}

const accessControlInfo = getAccessControlInfo();

if (!accessControlInfo.members_list) {
  return <p>Loading members list...</p>;
}

const rootMembers = getRootMembers();
const teamNames = Object.keys(rootMembers || {});

const isDevHubModerator = hasModerator({
  account_id: context.accountId,
});

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

function createEditTeam({
  teamName,
  label,
  editPost,
  useLabels,
  members,
  contractCall, // typescript edit_member || add_member
}) {
  let txn = [];
  console.log("🚀 ~ file: index.jsx:48 ~ teamNames:", teamNames);
  if (teamNames.includes(`team:${teamName}`) && contractCall === "add_member") {
    return setAlertMessage("This team name already exists");
  }
  const allLabels = Object.keys(accessControlInfo.rules_list);
  if (allLabels.includes(label) && contractCall === "add_member") {
    return setAlertMessage("This label is already restricted by another team");
  }

  const membersAndTeams = Object.keys(accessControlInfo.members_list);
  members.forEach((member) => {
    // if Contract panic member does not exist in the members_list
    if (!membersAndTeams.includes(member)) {
      // Add member
      txn.push({
        contractName: "${REPL_EVENTS_CONTRACT}",
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
        gas: Big(10).pow(14),
      });
    }
  });

  // Check edit team
  Near.call([
    ...txn,
    {
      contractName: "${REPL_EVENTS_CONTRACT}",
      methodName: contractCall, // add_member || edit_member
      args: {
        member: `team:${teamName}`,
        metadata: {
          member_metadata_version: "V0",
          description: "",
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
      gas: Big(10).pow(14),
    },
  ]);
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
`;

const Tab = styled.button`
  color: rgb(0, 236, 151);
  &:hover {
    color: rgba(0, 236, 151, 0.5);
  }
`;

return (
  <Container>
    <div className="d-flex flex-column gap-4 p-4">
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <Widget
            src="${REPL_EVENTS}/widget/devhub.page.admin.moderatorsTab"
            props={{
              accessControlInfo,
              createEditTeam,
            }}
          />
        </div>
      </div>
    </div>
  </Container>
);
