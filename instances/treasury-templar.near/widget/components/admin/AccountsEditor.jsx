const { data, setList, validate, invalidate } = props;

const [newItem, setNewItem] = useState("");

const handleAddItem = () => {
  if (validate(newItem)) {
    setList([...data.list, newItem]);
    setNewItem("");
  } else {
    return invalidate();
  }
};

const handleDeleteItem = (index) => {
  const updatedData = [...data.list];
  updatedData.splice(index, 1);
  setList(updatedData);
};

const Item = styled.div`
  padding: 10px;
  margin: 5px;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`;

return (
  <>
    {data.list.map((item, index) => (
      <Item key={index}>
        <div className="flex-grow-1">
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
            props={{
              className: "flex-grow-1",
              value: item,
              skipPaddingGap: true,
              placeholder: data.placeholder,
              inputProps: {
                prefix: data.prefix,
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
    {data.list.length < data.maxLength && (
      <Item>
        <div className="flex-grow-1">
          <Widget
            src={`${REPL_TREASURY_TEMPLAR}/widget/components.molecule.AccountInput`}
            props={{
              onUpdate: (value) => setNewItem(value),
              value: newItem,
              placeholder: data.placeholder,
            }}
          />
        </div>
        <button
          className="btn btn-success add-member"
          onClick={handleAddItem}
          disabled={newItem === ""}
          data-testid="add-to-list"
        >
          <i className="bi bi-plus" />
        </button>
      </Item>
    )}
  </>
);
