const {
  hasModerator,
  getFeaturedCommunities,
  getRootMembers,
  getAccessControlInfo,
  setFeaturedCommunities,
  getAllCommunitiesMetadata,
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
  !getAccessControlInfo ||
  !setFeaturedCommunities ||
  !getAllCommunitiesMetadata
) {
  return <p>Loading modules...</p>;
}

const fc = getFeaturedCommunities();
// The state will stay empty even after the data right data has been retrieved
if (!fc) {
  return <p>Loading featured communities...</p>;
}
const featuredCommunityList = fc || [];
const allMetadata = getAllCommunitiesMetadata();
const accessControlInfo = getAccessControlInfo();

if (!accessControlInfo.members_list) {
  return <p>Loading members list...</p>;
}

const rootMembers = getRootMembers();
const teamNames = Object.keys(rootMembers || {});

const isDevHubModerator = hasModerator({
  account_id: context.accountId,
});

const [alertMessage, setAlertMessage] = useState("");
const [communityMessage, setCommunityMessage] = useState("");
const [createTeam, setCreateTeam] = useState(false);
const [communityHandles, setCommunityHandles] = useState(
  featuredCommunityList.map(({ handle }) => handle)
);
const [previewConnect, setPreviewConnect] = useState(false);
const [editModerators, setEditModerators] = useState(false);
const [moderators, setModerators] = useState(
  accessControlInfo.members_list["team:moderators"].children || []
);

const handleResetItems = () => {
  setCommunityHandles(featuredCommunityList.map(({ handle }) => handle));
};

const handleAddItem = () => {
  if (!allMetadata.map(({ handle }) => handle).includes(newItem)) {
    // Community does not exist
    return setCommunityMessage(
      "This community handle does not exist, make sure you use an existing handle."
    );
  }
  if (newItem) {
    setCommunityHandles([...communityHandles, newItem]);
    setNewItem("");
  }
};

const handleDeleteItem = (index) => {
  const updatedData = [...communityHandles];
  updatedData.splice(index, 1);
  setCommunityHandles(updatedData);
};

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

function handleSubmit() {
  if (communityHandles.length < 4) {
    return setCommunityMessage("Can't set fewer than 4 communities");
  }
  setFeaturedCommunities({ handles: communityHandles });
}

function createEditTeam({
  teamName,
  description,
  label,
  editPost,
  useLabels,
  members,
  contractCall, // TODO typescript edit_member || add_member
}) {
  let txn = [];

  if (
    rootMembers.includes(`team:${teamName}`) &&
    contractCall === "add_member"
  ) {
    return setAlertMessage("This team name already exists");
  }
  const allLabels = Object.keys(accessControlInfo.rules_list);
  if (allLabels.includes(label) && contractCall === "add_member") {
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
      methodName: contractCall, // add_member || edit_member
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

const handleEditModerators = () => {
  createEditTeam({
    teamName: "team:moderators",
    description:
      "The moderator group has permissions to edit any posts and apply all labels, including restricted ones.",
    label: "any",
    editPost: true,
    useLabels: true,
    members: moderators,
    contractCall: "edit_member",
  });
};

const Item = styled.div`
  padding: 10px;
  margin: 5px;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
`;

const CardGrid = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;

  @media screen and (max-width: 1000px) {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
`;

return (
  <Container>
    <div className="d-flex flex-column gap-4 p-4">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home"
            type="button"
            role="tab"
            aria-controls="home"
            aria-selected="true"
          >
            Home page settings
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile"
            type="button"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >
            Moderators
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#contact"
            type="button"
            role="tab"
            aria-controls="contact"
            aria-selected="false"
          >
            Restricted labels
          </button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.atom.Alert"
            props={{
              onClose: () => setCommunityMessage(""),
              message: communityMessage,
            }}
          />
          <Tile className="p-3 mb-3">
            <h3> Manage featured communities</h3>
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.molecule.ListEditor"
              props={{
                data: {
                  maxLength: 5,
                  placeholder: "Community handle",
                  prefix: "Community handle",
                  list: communityHandles,
                },
                setList: setCommunityHandles,

                validate: (newItem) =>
                  !allMetadata.map(({ handle }) => handle).includes(newItem),
                invalidate: () =>
                  setCommunityMessage(
                    "This community handle does not exist, make sure you use an existing handle."
                  ),
              }}
            />
            <div
              className={
                "d-flex align-items-center justify-content-end gap-3 mt-4"
              }
            >
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
                props={{
                  classNames: {
                    root: "btn-outline-danger shadow-none border-0",
                  },
                  label: "Cancel",
                  onClick: () => {
                    handleResetItems();
                  },
                }}
              />
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
                props={{
                  classNames: { root: "btn" },
                  icon: {
                    type: "bootstrap_icon",
                    variant: "bi-check-circle-fill",
                  },
                  label: "Submit",
                  onClick: () => handleSubmit(),
                }}
              />
            </div>
          </Tile>
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"
            }
            props={{
              onClick: () => setPreviewConnect(!previewConnect),
              icon: previewConnect ? "bi bi-toggle-on" : "bi bi-toggle-off",
              title: "Preview homepage",
              testId: "preview-homepage",
            }}
          />
          <div class="mt-3">
            {previewConnect && (
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.components.island.connect"
                props={{ ...props }}
              />
            )}
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <h1>Moderators</h1>
          <div className="card-body">
            <h5>
              The moderator group has permissions to edit any posts and apply
              all labels, including restricted ones.
            </h5>
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"
              }
              props={{
                icon: "bi bi-gear-wide-connected",
                className: "mb-3",

                title: "Edit members",
                onClick: () => setEditModerators(!editModerators),
                testId: "edit-members",
              }}
            />
          </div>
          <Tile className="p-3">
            {editModerators ? (
              <>
                <Widget
                  src="${REPL_DEVHUB}/widget/devhub.components.molecule.ListEditor"
                  props={{
                    data: {
                      maxLength: 100,
                      placeholder: "member.near",
                      prefix: "member",
                      list: moderators,
                    },
                    setList: setModerators,

                    validate: (newItem) => true,
                    invalidate: () => null, // TODO check if id exists on near
                  }}
                />
                <div
                  className={
                    "d-flex align-items-center justify-content-end gap-3 mt-4"
                  }
                >
                  <Widget
                    src={
                      "${REPL_DEVHUB}/widget/devhub.components.molecule.Button"
                    }
                    props={{
                      classNames: {
                        root: "btn-outline-danger shadow-none border-0",
                      },
                      label: "Cancel",
                      onClick: () => {
                        handleResetItems();
                      },
                    }}
                  />
                  <Widget
                    src={
                      "${REPL_DEVHUB}/widget/devhub.components.molecule.Button"
                    }
                    props={{
                      classNames: { root: "btn" },
                      icon: {
                        type: "bootstrap_icon",
                        variant: "bi-check-circle-fill",
                      },
                      label: "Submit",
                      onClick: handleEditModerators,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div class="pt-4">Members</div>

                {moderators && (
                  <div class="vstack">
                    {moderators.length ? (
                      moderators.map((child) => (
                        <Tile className="w-25 p-3 m-1" minHeight={10}>
                          <Widget
                            src={`neardevgov.near/widget/ProfileLine`}
                            props={{ accountId: child }}
                          />
                        </Tile>
                      ))
                    ) : (
                      <div>No moderators</div>
                    )}
                  </div>
                )}
              </>
            )}
          </Tile>
        </div>
        <div
          class="tab-pane fade"
          id="contact"
          role="tabpanel"
          aria-labelledby="contact-tab"
        >
          <h1>Restricted Labels</h1>
          <h5>
            Create special labels and control who can use and edit posts with
            those labels.
          </h5>
          {!createTeam ? (
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"
              }
              props={{
                onClick: () => setCreateTeam(true),
                title: "Create label",
                testId: "create-team",
              }}
            />
          ) : (
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.team.Configurator"}
              props={{
                onCancel: () => setCreateTeam(false),
                onSubmit: (params) =>
                  createEditTeam({ ...params, contractCall: "add_member" }),
              }}
            />
          )}

          <div class="table-responsive mt-3">
            <table class="table table-hover table-sm table-bordered table-striped">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">label name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Members</th>
                  <th scope="col">Only allow members to use label</th>
                  <th scope="col">Allow members to edit any post with label</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {(teamNames || []).sort().map((teamName) => {
                  if (teamName === "team:moderators") return;
                  return (
                    <Widget
                      src={"${REPL_DEVHUB}/widget/devhub.entity.team.LabelRow"}
                      props={{
                        teamName,
                      }}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
