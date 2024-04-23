const { Sidebar, Content, editData, onSubmit } = props;

// Selected Item is the property "parameters" of the community addon (blog)
const [selectedItem, setSelectedItem] = useState(editData);
const [showEditor, setShowEditor] = useState(false);
const [showBlogPostSettings, setBlogPostSettings] = useState(false);
// SHOW EDITOR
const handleItemClick = (item) => {
  if (item) {
    setSelectedItem(item);
    setShowEditor(true);
  } else {
    setSelectedItem(null);
  }
};

const goBack = () => {
  setShowEditor(false);
  setSelectedItem(null);
};

const openBlogPostSettings = () => {
  // TODO 599
  setBlogPostSettings(true);
};

const saveBlogPostSettings = () => {
  // TODO 599 move to provider
  console.log("Implement saving blog settings issue 599");
};

const handlePublish = (status) => {
  onSubmit &&
    onSubmit(
      {
        id: data.id || undefined,
        title,
        subtitle,
        description,
        date,
        status,
        content,
        author,
        category,
        community: handle,
      },
      data.id !== undefined
    );
};

const openAnalytics = () => {
  window.open("https://eu.posthog.com/project/20896", "_blank");
};

return (
  <div style={{ width: "100%", height: "100%" }}>
    {showBlogPostSettings ? (
      <div className="d-flex gap-1 align-items-end">
        <button
          className="btn btn-primary"
          onClick={() => setBlogPostSettings(false)}
        >
          Cancel
        </button>
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.BlogControl"}
          props={{
            title: "Save Settings",
            onClick: saveBlogPostSettings,
          }}
        />
        <p>Category Option selection</p>
      </div>
    ) : (
      <>
        {showEditor ? null : (
          <div className="d-flex gap-1 align-items-end">
            {/* TODO PETER */}
            <input type="text" placeholder="Search blog posts" />
            <button className="btn btn-secondary">Filter</button>
            {/* END PETER */}
            <button className="btn btn-primary" onClick={openAnalytics}>
              Analytics
            </button>
            <button className="btn btn-primary" onClick={openBlogPostSettings}>
              Settings
            </button>
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.BlogControl"
              }
              props={{
                title: "New Blog Post",
                onClick: () => {
                  handleItemClick(null);
                  setShowEditor(true);
                },
              }}
            />
          </div>
        )}
        <div
          className="template"
          style={{ display: "flex", width: "100%", height: "100%" }}
        >
          <div
            className="left-panel"
            style={{
              // margin: "20px 20px 80px 20px",
              width: showEditor ? "20%" : "100%",
            }}
          >
            <Sidebar
              selectedItem={selectedItem}
              handleItemClick={handleItemClick}
              hideColumns={showEditor}
            />
          </div>
          {/* TODO: */}
          {showEditor && (
            <div
              className="right-panel mt-3"
              style={{ flex: 1, width: 0, overflow: "scroll" }}
              key={selectedItem.id}
            >
              <Content data={selectedItem} onCancel={goBack} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
);
