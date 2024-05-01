const { BlogOverview, Content, parametersData, onSubmit, BlogPostSettings } =
  props;

const [selectedItem, setSelectedItem] = useState(null);
const [showEditor, setShowEditor] = useState(false);
const [showBlogPostSettings, setBlogPostSettings] = useState(false);

const openBlogPostSettings = () => {
  setBlogPostSettings(true);
};

const handleItemClick = (item) => {
  if (item) {
    setSelectedItem(item);
    setShowEditor(true);
  } else {
    setSelectedItem(null);
  }
};

const goBack = () => {
  setSelectedItem(null);
  setShowEditor(false);
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

const postHogHref = "https://eu.posthog.com/project/20896";

return (
  <div style={{ width: "100%", height: "100%" }}>
    {showBlogPostSettings ? (
      <BlogPostSettings onHideSettings={() => setBlogPostSettings(false)} />
    ) : (
      <>
        {showEditor ? null : (
          <div className="d-flex gap-1 align-items-end justify-content-end w-100 mb-4">
            <Link className="btn btn-light" href={postHogHref} target="_blank">
              Analytics
            </Link>
            <button className="btn btn-light" onClick={openBlogPostSettings}>
              Settings
            </button>
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.BlogControl"
              }
              props={{
                title: "New Blog Post",
                onClick: () => {
                  handleItemClick("new");
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
              width: showEditor ? "20%" : "100%",
            }}
          >
            <BlogOverview
              selectedItem={selectedItem}
              handleItemClick={handleItemClick}
              hideColumns={showEditor}
            />
          </div>
          {showEditor && (
            <div
              className="right-panel"
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
