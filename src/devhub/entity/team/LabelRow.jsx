/**
 * In the context of the contract, a group is essentially a member identified
 * by the prefix 'team:'; therefore, on the front end, we also employ 'team,'
 * with the user interface displaying 'group' for clarity.
 */

const { getAccessControlInfo, getRootMembers, removeMember } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAccessControlInfo || !getRootMembers || !removeMember) {
  return <p>Loading modules...</p>;
}

const accessControlInfo = getAccessControlInfo();
const rootMembers = getRootMembers();
const allTeamNames = Object.keys(rootMembers || {});

if (!accessControlInfo || !rootMembers) {
  return <p>Loading access control info...</p>;
}

const { teamName } = props;
const teamModerators = teamName == "team:moderators";
const label = Object.keys(rootMembers[teamName].permissions)[0] || "";
const metadata = accessControlInfo.members_list[teamName];
const editPost = rootMembers[teamName].permissions[label].includes("edit-post");
const useLabels =
  rootMembers[teamName].permissions[label].includes("use-labels");
const members = rootMembers[teamName].children || [];

const configuratorData = {
  teamName: teamName,
  label: label,
  members,
  editPost,
  useLabels,
};

const [editMode, setEditMode] = useState(false);
const [alertMessage, setAlertMessage] = useState("");

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
  label: lbl,
  editPost: edtpst,
  useLabels: uslbls,
  members: mmbrs,
}) {
  let txn = [];
  let numberOfChanges = 0;

  if (backwardsCompatibleTeam(teamName) !== tmnm) {
    numberOfChanges++;
    if (allTeamNames.includes(`team:${tmnm}`)) {
      return setAlertMessage("This team name already exists");
    }
  }

  console.log(label, lbl);
  if (label !== lbl) {
    const allLabels = Object.keys(accessControlInfo.rules_list);
    if (allLabels.includes(lbl)) {
      return setAlertMessage(
        "This label is already restricted by another team"
      );
    }
  }

  if (editPost !== edtpst || useLabels !== uslbls) {
    numberOfChanges++;
  }

  if (!arrayEq(members, mmbrs)) {
    numberOfChanges++;
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
          gas: Big(10).pow(14),
        });
      }
    });
  }

  if (numberOfChanges < 1) {
    return setAlertMessage("No changes found.");
  }

  Near.call([
    ...txn,
    {
      contractName: "${REPL_DEVHUB_CONTRACT}",
      methodName: "edit_member",
      args: {
        member: `team:${tmnm}`,
        metadata: {
          member_metadata_version: "V0",
          description: "",
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
      gas: Big(10).pow(14),
    },
  ]);
}

function deleteLabel() {
  // contract side this is called a team / member
  removeMember(teamName);
}

const backwardsCompatibleLabel = (oldLabel) => {
  if (typeof oldLabel === "string")
    return oldLabel.startsWith("starts-with:") ? oldLabel.slice(12) : oldLabel;
  else return "";
};
// Teams are saved in contract by their prefix 'team:'
// This function makes the teamName display friendly.
const backwardsCompatibleTeam = (oldTeam) =>
  oldTeam.startsWith("team:") ? oldTeam.slice(5) : oldTeam;

return (
  <>
    <tr>
      <th scope="row" class=" justify-content-center align-items-center p-3">
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
          props={{
            tag: backwardsCompatibleLabel(label),
          }}
        />
      </th>
      <td class=" justify-content-center align-items-center p-3">
        {(label || "").startsWith("starts-with:")
          ? "Multiple labels with common prefix"
          : "Single label"}
      </td>
      <td class=" justify-content-center align-items-center p-3">
        {metadata.children && (
          <div class="vstack">
            {metadata.children.length ? (
              metadata.children.map((child) => <p>{child}</p>)
            ) : (
              <div>No members in this group</div>
            )}
          </div>
        )}
      </td>
      <td class=" justify-content-center align-items-center p-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value={useLabels}
            id={`useLabelsCheckbox${identifier}`}
            checked={useLabels}
            onChange={() => setUseLabels(!useLabels)}
            disabled={disabled}
          />
        </div>
      </td>
      <td class=" justify-content-center align-items-center p-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value={editPost}
            id={`editPostCheckbox${identifier}`}
            checked={editPost}
            onChange={() => setEditPost(!editPost)}
            disabled={disabled}
          />
        </div>
      </td>
      <td class=" justify-content-center align-items-center p-3">
        {editMode ? (
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
            props={{
              classNames: { root: "btn-outline-danger" },
              icon: {
                type: "bootstrap_icon",
                variant: "bi-trash",
              },
              label: "Delete",
              onClick: deleteLabel,
            }}
          />
        ) : (
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
            props={{
              classNames: { root: "btn-outline-light text-dark" },
              icon: {
                type: "bootstrap_icon",
                variant: "bi-gear-wide-connected",
              },
              label: "Edit",
              onClick: () => setEditMode(true),
            }}
          />
        )}
      </td>
    </tr>
    {editMode && (
      <tr>
        <th scope="row" colspan="6">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.team.Configurator"}
            props={{
              data: configuratorData,
              onCancel: () => setEditMode(false),
              onSubmit: (params) => editTeam(params),
            }}
          />
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.atom.Alert"
            props={{
              onClose: () => setAlertMessage(""),
              message: alertMessage,
            }}
          />
        </th>
      </tr>
    )}
  </>
);
