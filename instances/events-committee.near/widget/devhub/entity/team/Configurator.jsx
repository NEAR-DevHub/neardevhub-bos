const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

if (!Tile) {
  return <div>Loading...</div>;
}

const { data, onSubmit, onCancel } = props;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Item = styled.div`
  padding: 10px;
  margin: 5px;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`;

const backwardsCompatibleLabel = (oldLabel) => {
  if (typeof oldLabel === "string")
    return oldLabel.startsWith("starts-with:") ? oldLabel.slice(12) : oldLabel;
  else return "";
};
const backwardsCompatibleTeam = (oldTeam) => {
  if (typeof oldTeam === "string")
    return oldTeam.startsWith("team:") ? oldTeam.slice(5) : oldTeam;
  else return "";
};

const initialData = data.members || [];
const [newItem, setNewItem] = useState("");
const [teamName, setTeamName] = useState(
  backwardsCompatibleTeam(data.teamName) || ""
);
const [label, setLabel] = useState(data.label || "");
const [labelType, setLabelType] = useState(
  (data.label || "").startsWith("starts-with:") ? "starts-with:" : ""
);
const [editPost, setEditPost] = useState(data.editPost || false);
const [useLabels, setUseLabels] = useState(data.useLabels || false);
const [members, setMembers] = useState(initialData || []);

const [showPreview, setShowPreview] = useState(data.showPreview || []);

const [warning, setWarning] = useState("");

const handleAddItem = () => {
  if (newItem) {
    setMembers([...members, newItem]);
    setNewItem("");
  }
};

const handleDeleteItem = (index) => {
  const updatedData = [...members];
  updatedData.splice(index, 1);
  setMembers(updatedData);
};

const handleSubmit = () => {
  if (newItem !== "") {
    return setWarning(
      "Don't forget to add the last member or clear the field to get rid of this warning."
    );
  }
  if (teamName && teamName.startsWith("team:")) {
    return setWarning("The team name can't start with 'team:'");
  }
  if (
    !backwardsCompatibleLabel(label) ||
    !label.trim() ||
    label === "starts-with:"
  ) {
    return setWarning("Invalid label, make sure it's not taken");
  }
  if (members.length < 1) {
    return setWarning("Add at least one member to the team");
  }

  onSubmit({
    teamName,
    label: labelType + backwardsCompatibleLabel(label),
    editPost,
    useLabels,
    members: members.map((member) => member.trim()),
  });
};

return (
  <Tile className="p-3">
    <Container>
      <h3>{data.teamName == "" ? "Edit label" : "Create label"}</h3>
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.atom.Alert"
        props={{
          onClose: () => setWarning(""),
          message: warning,
        }}
      />
      {/* Moderators is only editable through the CLI except for the members property */}
      {teamName !== "moderators" && (
        <>
          <div className="flex-grow-1">
            <span>Group name</span>
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
              props={{
                className: "flex-grow-1",
                skipPaddingGap: true,
                onChange: (e) => setTeamName(e.target.value),
                value: teamName,
                placeholder: "Team name",
              }}
            />
          </div>

          <div className="flex-grow-1">
            <div>
              Would you like this group to limit their restrictions to a single
              label, or would you prefer them to restrict it with any label that
              follows a similar convention?
            </div>
            <div className="col-lg-6 mb-2">
              <select
                onChange={(event) => setLabelType(event.target.value)}
                class="form-select"
                aria-label="Select type"
                value={labelType}
              >
                <option value="starts-with:">
                  Restrict multiple labels with a common prefix
                </option>
                <option value="">Restrict a single label</option>
              </select>
              <div>What would you like the restricted label to be?</div>
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
                props={{
                  className: "flex-grow-1",
                  onChange: (e) => setLabel(e.target.value),
                  value: backwardsCompatibleLabel(label),
                  skipPaddingGap: true,
                  placeholder: "label",
                  inputProps: {
                    prefix: labelType,
                  },
                }}
              />
              <div>Select label permissions</div>
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.team.LabelPermissions"
                props={{
                  identifier: data.teamName,
                  editPost,
                  setEditPost,
                  useLabels,
                  setUseLabels,
                  disabled: false,
                }}
              />
            </div>
          </div>
        </>
      )}
      {members.map((item, index) => (
        <Item key={index}>
          <div className="flex-grow-1">
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
              props={{
                className: "flex-grow-1",
                value: item,
                skipPaddingGap: true,
                placeholder: "member",
                inputProps: {
                  prefix: "member",
                  disabled: true,
                },
              }}
            />
          </div>
          <button
            className="btn btn-outline-danger"
            onClick={() => handleDeleteItem(index)}
          >
            <i className="bi bi-trash-fill" />
          </button>
        </Item>
      ))}
      <Item>
        <div className="flex-grow-1">
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
            props={{
              className: "flex-grow-1",
              skipPaddingGap: true,
              onChange: (e) => setNewItem(e.target.value),
              value: newItem,
              placeholder: "member",
              inputProps: {
                prefix: "member",
              },
            }}
          />
        </div>
        <button
          className="btn btn-success add-member"
          onClick={handleAddItem}
          disabled={newItem === ""}
        >
          <i className="bi bi-plus" />
        </button>
      </Item>
      <div
        className={"d-flex align-items-center justify-content-end gap-3 mt-4"}
      >
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-outline-danger shadow-none border-0" },
            label: "Cancel",
            onClick: () => onCancel(),
          }}
        />
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-success" },
            icon: {
              type: "bootstrap_icon",
              variant: "bi-check-circle-fill",
            },
            label: "Submit",
            onClick: handleSubmit,
          }}
        />
      </div>
    </Container>
  </Tile>
);
