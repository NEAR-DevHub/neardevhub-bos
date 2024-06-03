const {
  BlogOverview,
  data: processedBlogData,
  Content,
  onSubmit,
  BlogPostSettings,
  selectedBlog,
} = props;

const [selectedItem, setSelectedItem] = useState(
  selectedBlog ? selectedBlog : null
);
const [selectedItemChanged, setSelectedItemChanged] = useState(false);

const [showScreen, setShowScreen] = useState(
  selectedBlog ? "editor" : "overview"
); // overview, editor, settings

const openBlogPostSettings = () => {
  setShowScreen(true);
};

const [isSwitchBlogModalOpen, setIsSwitchBlogModalOpen] = useState(false);

// This function checks for unsaved changes and shows a modal if there are any
const checkForUnsavedChanges = (item) => {
  const unsavedChanges = selectedItemChanged;
  // If the user has edited show the confirm modal otherwise just switch
  if (unsavedChanges) {
    setIsSwitchBlogModalOpen(item);
  } else {
    handleItemClick(item);
  }
};

// This function
const handleItemClick = (item) => {
  if (item) {
    setSelectedItem(item);
    setShowScreen("editor");
  } else {
    setSelectedItem(null);
  }
  setSelectedItemChanged(false);
};

const goBack = () => {
  setSelectedItem(null);
  setShowScreen("overview");
  setSelectedItemChanged(false);
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
            <div className="text-xl font-bold">Blog Posts</div>
            <div className="flex items-end justify-end gap-x-3">
              <Link
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
                href={postHogHref}
                target="_blank"
                style={{ backgroundColor: "rgb(104, 112, 118)" }}
              >
                Analytics
              </Link>

              <Widget
                src={
                  "${REPL_DEVHUB}/widget/devhub.components.molecule.BlogControl"
                }
                props={{
                  title: "Settings",
                  onClick: () => setShowScreen("settings"),
                  testId: "settings-button",
                  icon: "bi-gear-fill",
                }}
              />
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
                  icon: "bi-plus-circle-fill",
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
              handleItemClick={checkForUnsavedChanges}
              hideColumns={showScreen === "editor"}
            />
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.ConfirmModal"
              }
              props={{
                isOpen: isSwitchBlogModalOpen,
                onCancelClick: () => setIsSwitchBlogModalOpen(false),
                onConfirmClick: () => {
                  handleItemClick(isSwitchBlogModalOpen);
                  setIsSwitchBlogModalOpen(false);
                },
                title: "Are you sure you want to continue?",
                content: "Unsaved changes will be lost.",
                confirmLabel: "Continue",
                cancelLabel: "Cancel",
                buttonRoot: "btn-danger",
              }}
            />
          </div>
          {showScreen === "editor" && (
            <div
              className="right-panel"
              style={{ flex: 1, width: 0, overflow: "scroll" }}
              key={selectedItem.id}
            >
              <Content
                data={selectedItem}
                onCancel={goBack}
                setSelectedItemChanged={setSelectedItemChanged}
              />
            </div>
          )}
        </div>
      </>
    )}
  </div>
);
