const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

const { data, onSubmit } = props;

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
const initialData = data.handles;
const [handles, setHandles] = useState(initialData || []);
const [newItem, setNewItem] = useState("");

const handleAddItem = () => {
  if (newItem) {
    setHandles([...handles, newItem]);
    setNewItem("");
  }
};

const handleDeleteItem = (index) => {
  const updatedData = [...handles];
  updatedData.splice(index, 1);
  setHandles(updatedData);
};

const handleSubmit = () => {
  onSubmit({ handles: handles.map((handle) => handle.trim()) });
};

return (
  <Tile className="p-3">
    <Container>
      {handles.map((item, index) => (
        <Item key={index}>
          <div className="flex-grow-1">
            <Widget
              // TODO: LEGACY.
              src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
              props={{
                className: "flex-grow-1",
                value: item,
                placeholder: "Telegram Handle",
                inputProps: {
                  prefix: "https://t.me/",
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
            // TODO: LEGACY.
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
            props={{
              className: "flex-grow-1",
              onChange: (e) => setNewItem(e.target.value),
              value: newItem,
              placeholder: "Telegram Handle",
              inputProps: {
                prefix: "https://t.me/",
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
            classNames: { root: "btn-success" },
            disabled: initialData === handles,
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
