const { data, onSubmit } = props;

const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

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

const initialData = data;
const [includeTags, setIncludeTags] = useState(initialData.includeTags || []);
const [excludeTags, setExcludeTags] = useState(initialData.excludeTags || []);
const [newIncludeTag, setNewIncludeTag] = useState("");
const [newExcludeTag, setNewExcludeTag] = useState("");
const [displayType, setDisplayType] = useState(
  initialData.displayType || "feed"
); // "feed" or "grid"

const handleAddIncludeTag = () => {
  if (newIncludeTag) {
    setIncludeTags([...includeTags, newIncludeTag]);
    setNewIncludeTag("");
  }
};

const handleDeleteIncludeTag = (index) => {
  const updatedIncludeTags = [...includeTags];
  updatedIncludeTags.splice(index, 1);
  setIncludeTags(updatedIncludeTags);
};

const handleAddExcludeTag = () => {
  if (newExcludeTag) {
    setExcludeTags([...excludeTags, newExcludeTag]);
    setNewExcludeTag("");
  }
};

const handleDeleteExcludeTag = (index) => {
  const updatedExcludeTags = [...excludeTags];
  updatedExcludeTags.splice(index, 1);
  setExcludeTags(updatedExcludeTags);
};

const hasDataChanged = () => {
  return (
    JSON.stringify(includeTags) !== JSON.stringify(initialData.includeTags) ||
    JSON.stringify(excludeTags) !== JSON.stringify(initialData.excludeTags) ||
    displayType !== initialData.displayType
  );
};

const handleSubmit = () => {
  onSubmit({ includeTags, excludeTags, displayType });
};

return (
  <Tile className="p-3">
    <Container>
      <h3>Include Tags</h3>
      {includeTags.map((item, index) => (
        <Item key={index}>
          <div className="flex-grow-1">
            <Widget
              // TODO: LEGACY.
              src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
              props={{
                className: "flex-grow-1",
                value: item,
                placeholder: "",
                inputProps: {
                  disabled: true,
                },
              }}
            />
          </div>
          <button
            className="btn btn-outline-danger"
            onClick={() => handleDeleteIncludeTag(index)}
          >
            <i className="bi bi-trash-fill" />
          </button>
        </Item>
      ))}
      <Item>
        <div className="flex-grow-1">
          <Widget
            // TODO: LEGACY.
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
            props={{
              className: "flex-grow-1",
              onChange: (e) => setNewIncludeTag(e.target.value),
              value: newIncludeTag,
              placeholder: "tag",
            }}
          />
        </div>
        <button
          className="btn btn-success"
          onClick={() => handleAddIncludeTag()}
          disabled={newIncludeTag === ""}
        >
          <i className="bi bi-plus" />
        </button>
      </Item>
      <h3>Exclude Tags</h3>
      {excludeTags.map((item, index) => (
        <Item key={index}>
          <div className="flex-grow-1">
            <Widget
              // TODO: LEGACY.
              src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
              props={{
                className: "flex-grow-1",
                value: item,
                placeholder: "",
                inputProps: {
                  disabled: true,
                },
              }}
            />
          </div>
          <button
            className="btn btn-outline-danger"
            onClick={() => handleDeleteExcludeTag(index)}
          >
            <i className="bi bi-trash-fill" />
          </button>
        </Item>
      ))}
      <Item>
        <div className="flex-grow-1">
          <Widget
            // TODO: LEGACY.
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
            props={{
              className: "flex-grow-1",
              onChange: (e) => setNewExcludeTag(e.target.value),
              value: newExcludeTag,
              placeholder: "tag",
            }}
          />
        </div>
        <button
          className="btn btn-success"
          onClick={() => handleAddExcludeTag()}
          disabled={newExcludeTag === ""}
        >
          <i className="bi bi-plus" />
        </button>
      </Item>
      <h3>Layout</h3>
      <div className="flex-grow-1">
        <Widget
          src={"${REPL_NEAR}/widget/DIG.InputSelect"}
          props={{
            groups: [
              {
                items: [
                  {
                    label: "Grid",
                    value: "grid",
                  },
                  {
                    label: "Feed",
                    value: "feed",
                  },
                ],
              },
            ],
            rootProps: {
              value: displayType || "",
              placeholder: "Select an Display Type",
              onValueChange: (value) => setDisplayType(value),
            },
          }}
        />
      </div>
      <div
        className={"d-flex align-items-center justify-content-end gap-3 mt-4"}
      >
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-success" },
            disabled: !hasDataChanged(),
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
