const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

const { getAccessControlInfo, getRootMembers } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAccessControlInfo || !getRootMembers) {
  return <p>Loading modules...</p>;
}

const accessControlInfo = getAccessControlInfo();
const rootMembers = getRootMembers();

if (!accessControlInfo || !rootMembers) {
  return <p>Loading access control info...</p>;
}

const { teamName } = props;
const label = Object.keys(rootMembers[teamName].permissions)[0] || "";
const metadata = accessControlInfo.members_list[teamName];
const editPost = rootMembers[teamName].permissions[label].includes("edit-post");
const useLabels =
  rootMembers[teamName].permissions[label].includes("use-labels");
const members = rootMembers[teamName].children || [];

const configuratorData = {
  teamName: teamName,
  description: metadata.description, //
  label: label,
  members,
  editPost,
  useLabels,
};

const [editMode, setEditMode] = useState(false);

function arrayEq(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

function editTeam({
  teamName: tmnm,
  description: dscrptn,
  label: lbl,
  editPost: edtpst,
  useLabels: uslbls,
  members: mmbrs,
}) {
  let txn = [];
  let numberOfChanges = 0;

  if (
    teamName !== tmnm ||
    description !== dscrptn ||
    label !== lbl ||
    editPost !== edtpst ||
    useLabels !== uslbls
  ) {
    numberOfChanges++;
  }

  if (!arrayEq(members, mmbrs)) {
    numberOfChanges++;
    // If members don't work create multiple transactions to add them first in the same call

    let membersAndTeams = Object.keys(accessControlInfo.members_list);

    mmbrs.forEach((member) => {
      if (!membersAndTeams.includes(member)) {
        // Contract panic member does not exist in the members_list yet.
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
  }

  if (numberOfChanges < 1) {
    // TODO error
    return "";
  }
  // TODO check dit later
  // If team name changed check if already exists.
  // Team does not exist green light

  // If label changed check if already exists.
  // Label must not exist green light

  // Deploy contract on testnet and test what happens with members that do not exist
  // Deploy preview also / check Elliot his message for Peter in telegram how to and read the contribution README

  // Once tested with if the members work
  // Green light add preview to issue

  Near.call([
    ...txn,
    {
      contractName: "${REPL_DEVHUB_CONTRACT}",
      methodName: "edit_member",
      args: {
        member: `team:${tmnm}`,
        metadata: {
          member_metadata_version: "V0",
          description: dscrptn,
          permissions: {
            [lbl]: [
              ...(edtpst ? ["edit-post"] : []),
              ...(uslbls ? ["use-labels"] : []),
            ],
          },
          children: mmbrs,
          parents: [],
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}
const backwardsCompatibleTeam = (oldTeam) =>
  oldTeam.startsWith("team:") ? oldTeam.slice(5) : oldTeam;
return editMode ? (
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.entity.team.Configurator"}
    props={{
      data: configuratorData,
      onCancel: () => setEditMode(false),
      onSubmit: (params) => editTeam(params),
    }}
  />
) : (
  <div className="card my-2 attractable">
    <div className="card-body">
      <div class="d-flex justify-content-between">
        <h3>{backwardsCompatibleTeam(teamName)}</h3>
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-outline-light text-dark" },
            icon: {
              type: "bootstrap_icon",
              variant: "bi-gear-wide-connected",
            },
            label: "Edit team",
            onClick: () => setEditMode(true),
          }}
        />
      </div>
    </div>

    <div className="card-body">
      {
        <p class="card-text" key="description">
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"
            }
            props={{
              text: metadata.description,
            }}
          />
        </p>
      }
      <span>
        Restricted label:{" "}
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
          props={{
            tag: label,
          }}
        />
      </span>

      <div>Permissions associated with that label</div>

      <Widget
        src="${REPL_DEVHUB}/widget/devhub.entity.team.LabelPermissions"
        props={{
          identifier: teamName,
          editPost,
          useLabels,
          setEditPost: console.log,
          setUseLabels: console.log,
          disabled: true,
        }}
      />

      <div>Members</div>

      {metadata.children && (
        <div class="vstack">
          {metadata.children.length ? (
            metadata.children.map((child) => (
              <Tile className="w-25 p-3 m-1" minHeight={10}>
                <Widget
                  src={`neardevgov.near/widget/ProfileLine`}
                  props={{ accountId: child }}
                />
              </Tile>
            ))
          ) : (
            <div>No members in this team</div>
          )}
        </div>
      )}
    </div>
  </div>
);
