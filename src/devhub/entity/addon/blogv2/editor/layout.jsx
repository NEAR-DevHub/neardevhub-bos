const { Sidebar, Content, getData, editData } = props;

// console.log({ layoutEditData: editData });
const [selectedItem, setSelectedItem] = useState(editData);

// SHOW EDITOR
const handleItemClick = (item) => {
  if (item) {
    getData(item).then((item) => {
      setSelectedItem(item);
    });
  } else {
    setSelectedItem(null);
  }
};

return (
  <div
    className="template"
    style={{ display: "flex", width: "100%", height: "100%" }}
  >
    <div
      className="left-panel"
      style={{
        margin: "20px 20px 80px 20px",
        width: "100%",
      }}
    >
      <Sidebar selectedItem={selectedItem} handleItemClick={handleItemClick} />
    </div>
    {/* TODO: */}
    {selectedItem !== null && (
      <div
        className="right-panel"
        style={{ flex: 1, width: 0, overflow: "scroll" }}
        key={selectedItem.id}
      >
        <Content data={selectedItem} />
      </div>
    )}
  </div>
);
