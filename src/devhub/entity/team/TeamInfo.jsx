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

const configuratorData = {
  teamName: teamName,
  description: metadata.description, //
  label: label,
  members: rootMembers[teamName].children || [],
  editPost,
  useLabels,
};

const [editMode, setEditMode] = useState(false);

function editTeam() {
  // TODO
}

return editMode ? (
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.entity.team.Configurator"}
    props={{
      data: configuratorData,
      onCancel: () => setCreateTeam(false),
      onSubmit: () => editTeam(),
    }}
  />
) : (
  <div className="card my-2 attractable">
    <div className="card-body">
      <div class="d-flex justify-content-between">
        <h3>{teamName.slice(5)}</h3>
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
          editPost,
          useLabels,
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
