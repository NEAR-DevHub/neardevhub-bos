const {
  BlogOverview,
  data: processedBlogData,
  Content,
  parametersData,
  onSubmit,
  BlogPostSettings,
} = props;

const [selectedItem, setSelectedItem] = useState(null);
const [showScreen, setShowScreen] = useState("overview"); // overview, editor, settings

const openBlogPostSettings = () => {
  setShowScreen(true);
};

const handleItemClick = (item) => {
  if (item) {
    setSelectedItem(item);
    setShowScreen("editor");
  } else {
    setSelectedItem(null);
  }
};

const goBack = () => {
  setSelectedItem(null);
  setShowScreen("overview");
};

const postHogHref = "https://eu.posthog.com/project/20896";

return (
  <div style={{ width: "100%", height: "100%" }}>
    {showScreen === "settings" ? (
      <BlogPostSettings onHideSettings={() => setShowScreen("overview")} />
    ) : (
      <>
        {showScreen === "editor" ? null : (
          <div className="flex items-center justify-between w-100 mb-4">
            <div className="">Blog Posts</div>
            <div className="flex items-end justify-end gap-x-1">
              <Link
                className="rounded-md bg-devhub-green-light px-3.5 py-2.5 text-sm font-semibold text-devhub-green hover:text-white shadow-sm hover:bg-indigo-100"
                href={postHogHref}
                target="_blank"
              >
                Analytics
              </Link>
              {/* <button
                onClick={() => setShowScreen("settings")}
                type="button"
                className="rounded-md bg-devhub-green-light px-3.5 py-2.5 text-sm font-semibold text-devhub-green hover:text-white shadow-sm hover:bg-indigo-100"
              >
                Settings
              </button> */}
              <Widget
                src={
                  "${REPL_DEVHUB}/widget/devhub.components.molecule.BlogControl"
                }
                props={{
                  title: "New Blog Post",
                  onClick: () => {
                    handleItemClick("new");
                    setShowScreen("editor");
                  },
                  testId: "new-blog-post-button",
                }}
              />
            </div>
          </div>
        )}
        <div
          className="template"
          style={{ display: "flex", width: "100%", height: "100%" }}
        >
          <div
            className="left-panel"
            style={{
              width: showScreen === "editor" ? "20%" : "100%",
            }}
          >
            <BlogOverview
              selectedItem={selectedItem}
              handleItemClick={handleItemClick}
              hideColumns={showScreen === "editor"}
            />
          </div>
          {showScreen === "editor" && (
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
