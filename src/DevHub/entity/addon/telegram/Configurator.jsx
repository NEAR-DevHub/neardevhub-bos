const { data, onSubmit } = props;

// TODO: Convert into a nice tile, the ability to add and remove items, then calls submit

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
  gap: 10px;
`;

const EditableField = styled.input`
  flex: 1;
`;

const [handles, setHandles] = useState(data.telegram_handle || []);
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
  onSubmit(handles);
};

return (
  <Container>
    {handles.map((item, index) => (
      <Item key={index}>
        {item}
        <button onClick={() => handleDeleteItem(index)}>Delete</button>
      </Item>
    ))}
    <div>
      <EditableField
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={handleAddItem}>Add</button>
    </div>
    <button onClick={handleSubmit}>Submit</button>
  </Container>
);
