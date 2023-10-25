const { data, handle, onSubmit } = props;

const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
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
const [layout, setLayout] = useState(initialData.layout || "feed"); // "feed" or "grid"

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
    layout !== initialData.layout
  );
};

const handleSubmit = () => {
  onSubmit({ includeTags, excludeTags, layout });
};

return (
  <Tile className="p-3">
    <ul className="nav nav-tabs" id="blogConfiguratorTabs" role="tablist">
      <li className="nav-item" role="presentation">
        <button
          className="nav-link active"
          id="settings-tab"
          data-bs-toggle="tab"
          data-bs-target="#settings"
          type="button"
          role="tab"
          aria-controls="settings"
          aria-selected="true"
        >
          Settings
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="editor-tab"
          data-bs-toggle="tab"
          data-bs-target="#editor"
          type="button"
          role="tab"
          aria-controls="editor"
          aria-selected="false"
        >
          Editor
        </button>
      </li>
    </ul>

    <div className="tab-content" id="blogConfiguratorTabsContent">
      {/* Settings Tab */}
      <div
        className="tab-pane show active"
        id="settings"
        role="tabpanel"
        aria-labelledby="settings-tab"
      >
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
                  value: layout || "",
                  placeholder: "Select a Layout",
                  onValueChange: (value) => setLayout(value),
                },
              }}
            />
          </div>
          <div
            className={
              "d-flex align-items-center justify-content-end gap-3 mt-4"
            }
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
      </div>

      {/* Editor Tab */}
      <div
        className="tab-pane"
        id="editor"
        role="tabpanel"
        aria-labelledby="editor-tab"
      >
        <Container>
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Creator"}
            props={{
              data,
              handle,
            }}
          />
        </Container>
      </div>
    </div>
  </Tile>
);
