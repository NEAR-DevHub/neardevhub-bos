const { Sidebar, Content, getData, editData } = props;

const [selectedItem, setSelectedItem] = useState(editData);

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
      }}
    >
      <Sidebar selectedItem={selectedItem} handleItemClick={handleItemClick} />
    </div>
    <div
      className="right-panel"
      style={{ flex: 1, width: 0, overflow: "scroll" }}
      key={selectedItem.id}
    >
      <Content data={selectedItem} />
    </div>
  </div>
);
