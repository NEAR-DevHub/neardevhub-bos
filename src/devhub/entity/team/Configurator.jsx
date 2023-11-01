const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

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

const EditableField = styled.input`
  flex: 1;
`;

const initialData = data.members || [];
const [newItem, setNewItem] = useState("");
const [teamName, setTeamName] = useState(data.teamName || "");
const [description, setDescription] = useState(data.description || "");
const [label, setLabel] = useState(data.label || "");
const [labelType, setLabelType] = useState(
  (data.label || "").startsWith("starts-with:") ? "starts-with" : ""
);
const [editPost, setEditPost] = useState(data.editPost || true);
const [useLabels, setUseLabels] = useState(data.useLabels || true);
const [members, setMembers] = useState(initialData || []);

const [showPreview, setShowPreview] = useState(data.showPreview || []);

const teamModerators = teamName == "team:moderators";
const moderatorsWarning = teamModerators && (
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    It's only possible to edit the description and members of team moderators
    through the UI.
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      onClick={() => State.update({ permissionError: "" })}
    ></button>
  </div>
);

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
  // TODO validate inputs

  onSubmit({
    teamName,
    label: labelType + label,
    editPost,
    useLabels,
    members: members.map((member) => member.trim()),
  });
};

return (
  <Tile className="p-3">
    <Container>
      <h3>{data.teamName ? "Edit" : "Create"} team</h3>
      {moderatorsWarning}
      {!teamModerators && (
        <div className="flex-grow-1">
          <span>Team name</span>
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
      )}
      <div className="flex-grow-1">
        <span>Team description</span>
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownEditor"
          props={{ data: { content: description }, onChange: setDescription }}
        />
      </div>
      {!teamModerators && (
        <div className="flex-grow-1">
          <div>
            Do you want this team to restrict a single label or restrict it with
            any label that starts with a similar convention?
          </div>
          <div className="col-lg-6 mb-2">
            <select
              onChange={(event) => setLabelType(event.target.value)}
              class="form-select"
              aria-label="Select type"
              value={labelType}
            >
              <option value="starts-with:">
                Restrict multiple labels with the same start
              </option>
              <option value="">Restrict a single label</option>
            </select>
            <div>What would you like the restricted label to be?</div>
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
              props={{
                className: "flex-grow-1",
                onChange: (e) => setLabel(e.target.value),
                value: label,
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
                editPost,
                setEditPost,
                useLabels,
                setUseLabels,
                disabled: false,
              }}
            />
          </div>
        </div>
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
          className="btn btn-success"
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
            disabled: initialData === members,
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
