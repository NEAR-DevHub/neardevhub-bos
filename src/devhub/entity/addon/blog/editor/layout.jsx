const { Sidebar, Content, getData } = props;

const [selectedItem, setSelectedItem] = useState(initialProject);

const handleItemClick = (item) => {
  const data = getData(item);
  setSelectedItem(data);
};

return (
  <div
    className="template"
    style={{ display: "flex", width: "100%", height: "100%" }}
  >
    <div
      className="left-panel"
      style={{
        flex: 1,
        maxWidth: "300px",
        width: "100%",
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
