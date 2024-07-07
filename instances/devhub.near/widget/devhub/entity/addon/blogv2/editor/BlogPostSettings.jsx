const { normalize } = VM.require("${REPL_DEVHUB}/widget/core.lib.stringUtils");
normalize || (normalize = () => {});

const { data, onHideSettings, onSubmit } = props;

const [isConfirmModalOpen, setModalVisible] = useState(false);

const [title, setTitle] = useState(data.title || "");
const [subtitle, setSubtitle] = useState(data.subtitle || "");
const [authorEnabled, setAuthorEnabled] = useState(
  data.authorEnabled || "disabled"
);
const [searchEnabled, setSearchEnabled] = useState(
  data.searchEnabled || "disabled" // 'enabled', 'disabled'
);
const [orderBy, setOrderBy] = useState(data.orderBy || "timedesc"); // timedesc, timeasc, alpha
const [postPerPage, setPostPerPage] = useState(data.postPerPage || 10);

const [categoriesEnabled, setCategoriesEnabled] = useState(
  data.categoriesEnabled || "disabled" // 'enabled', 'disabled'
);
const switchCategoryEnabled = (value) => {
  if (value === "disabled") {
    setSelected([]);
    setCategoryRequired("not_required");
  }
  setCategoriesEnabled(value);
};
const filteredCategories =
  (data.categories || []).filter((categories) => categories !== null) || [];

const [selected, setSelected] = useState(filteredCategories);
const [categoryRequired, setCategoryRequired] = useState(
  data.categoryRequired || "not_required" // required | not_required
);

const [loadingSaveSettings, setLoadingSaveSettings] = useState(false);

const InputContainer = ({ heading, description, children }) => {
  return (
    <div className="d-flex flex-column gap-1 gap-sm-2 w-2/3">
      <b className="h6 mb-0">{heading}</b>
      {description && (
        <div className="text-muted w-100 text-sm">{description}</div>
      )}
      {children}
    </div>
  );
};

const TitleComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
      props={{
        className: "flex-grow-1",
        value: title,
        placeholder: "Title",
        onChange: (e) => setTitle(e.target.value),
        skipPaddingGap: true,
        inputProps: {
          max: 40,
          required: true,
          name: "title",
          className:
            "block w-full rounded-md border-0 px-1 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        },
      }}
    />
  );
}, []);

const SubtitleComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
      props={{
        className: "flex-grow-1",
        value: subtitle,
        placeholder: "Subtitle",
        onChange: (e) => setSubtitle(e.target.value),
        skipPaddingGap: true,
        inputProps: {
          required: false,
          max: 80,
          name: "subtitle",
          className:
            "block w-full rounded-md border-0 px-1 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        },
      }}
    />
  );
}, []);

const AuthorEnabledSwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
        className: "w-32 shadow-none",
        currentValue: authorEnabled,
        key: "authorEnabled",
        onChange: (e) => setAuthorEnabled(e.target.value),
        options: [
          { label: "Enabled", value: "enabled" },
          { label: "Disabled", value: "disabled" },
        ],
        title: "Author Enabled",
      }}
    />
  );
}, [authorEnabled]);

const SearchSwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
        className: "w-32 shadow-none",

        currentValue: searchEnabled,
        key: "search",
        onChange: (e) => setSearchEnabled(e.target.value),
        options: [
          { label: "Enabled", value: "enabled" },
          { label: "Disabled", value: "disabled" },
        ],
        title: "Search",
      }}
    />
  );
}, [searchEnabled]);

const OrderBySwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
        className: "shadow-none",
        style: { width: "24rem" },
        currentValue: orderBy,
        key: "orderBy",
        onChange: (e) => setOrderBy(e.target.value),
        options: [
          { label: "Newest to oldest", value: "timedesc" },
          { label: "Oldest to newest", value: "timeasc" },
          { label: "Alphabetical", value: "alpha" },
        ],
        title: "Order by",
      }}
    />
  );
}, [orderBy]);

const PostsPerPageComponent = (
  <div className="col-lg-6 mb-2">
    <input
      className="block w-full rounded-md border-0 px-1 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      data-testid="post-per-page-input"
      type="number"
      value={parseInt(postPerPage) > 0 ? postPerPage : ""}
      min={0}
      onChange={(event) => {
        console.log("onChange", event.target.value.toString());
        setPostPerPage(event.target.value.toString().replace(/[a-zA-Z]/g, ""));
      }}
    />
  </div>
);

const CategoriesEnabledComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
        className: "w-32 shadow-none",
        currentValue: categoriesEnabled,
        key: "categories",
        onChange: (e) => switchCategoryEnabled(e.target.value),
        options: [
          { label: "Enabled", value: "enabled" },
          { label: "Disabled", value: "disabled" },
        ],

        title: "Categories",
      }}
    />
  );
}, [categoriesEnabled]);

const CategoryRequiredSwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
        className: "shadow-none",
        style: { width: "12rem" },
        currentValue: categoryRequired,
        key: "categoryRequired",
        onChange: (e) => setCategoryRequired(e.target.value),
        options: [
          { label: "Required", value: "required" },
          { label: "Not Required", value: "not_required" },
        ],
        title: "Category Required",
      }}
    />
  );
}, [categoryRequired]);

const onChangeCategories = (_labels) => {
  _labels = _labels.map((o) => ({
    category: o.category, // labelKey == category
    value: normalize(o.category),
  }));
  // This is for the Typeahead
  setSelected(_labels);
};

const CategoriesEditor = useMemo(() => {
  const examples = ["News", "Guide", "Reference"];
  const options = examples
    .map((category) => {
      return { category };
    })
    .filter((o) => !selected.includes(o.category));

  return (
    <Typeahead
      multiple
      labelKey="category"
      onChange={onChangeCategories}
      options={options}
      placeholder="News, Guide, Reference, etc."
      selected={selected}
      positionFixed
      caseSensitive={true}
      allowNew={(results, props) => {
        // Don't allow more than 10 categories
        return props.selected.length < 10;
      }}
    />
  );
}, [selected]);

const FormContainer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

const handleUpdate = () => {
  if (
    filteredCategories.some(
      (category) => !selected.map((e) => e.value).includes(category.value)
    )
  ) {
    setModalVisible(true);
    return;
  }
  handleOnSubmit();
};

/**
 * If the settings are empty we use default values for blog settings
 * These default values should reflect in the configurator / viewer and settings page
 */
const handleOnSubmit = () => {
  setLoadingSaveSettings(true);
  if (categoriesEnabled === "enabled" && categories.length === 0) {
    return setLoadingSaveSettings(false);
  }

  const cEnabled = categoriesEnabled || "disabled";
  // If categories are enabled there must be at least 1 category
  const cats =
    cEnabled == "enabled" && selected && selected.length > 0 ? selected : [];
  // If categories are empty they can not be required
  const req = cats.length ? categoryRequired : "not_required";

  onSubmit({
    title: title || "",
    subtitle: subtitle || "",
    authorEnabled: authorEnabled || "disabled", // 'enabled', 'disabled'
    searchEnabled: searchEnabled || "disabled", // 'enabled', 'disabled'
    orderBy: orderBy || "timedesc", // timedesc, timeasc, alpha
    categoriesEnabled: cEnabled, // 'enabled', 'disabled'
    categories: cats,
    categoryRequired: req,
    // minimum of 5 posts per page
    postPerPage: postPerPage < 5 ? 5 : postPerPage,
  });
  setTimeout(() => {
    setLoadingSaveSettings(false);
  }, 2000);
};

const categoriesIsInvalid = () =>
  categoriesEnabled === "enabled" && categories.length === 0;

const submitDisabled = () => {
  return categoriesIsInvalid() || !title || !subtitle || loadingSaveSettings;
};

return (
  <div>
    <FormContainer>
      <div>
        <div className="d-flex justify-content-between">
          <div>
            <h2 className="text-xl leading-7 text-gray-600">Blog List Page</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              This information will be displayed publicly.
            </p>
          </div>
          <div className="d-flex gap-1 align-items-center justify-content-end">
            <Widget
              src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
              props={{
                classNames: {
                  root: "d-flex text-muted fw-bold btn-outline shadow-none border-0 btn-sm",
                },
                label: "Cancel",
                onClick: onHideSettings,
              }}
            />
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.BlogControl"
              }
              props={{
                title: "Save Settings",
                onClick: handleUpdate,
                testId: "save-settings-button",
                disabled: submitDisabled(),
                loading: loadingSaveSettings,
                icon: "bi-plus-circle-fill",
              }}
            />
          </div>
        </div>
        <div className="w-100 border-b"></div>
      </div>

      <InputContainer
        heading="Title"
        description="Highlight the essence of your blog in a few words. This will appear on the top of your blog page."
      >
        {TitleComponent}
      </InputContainer>
      <InputContainer
        heading="Subtitle"
        description="Provide a brief subtitle for the blog."
      >
        {SubtitleComponent}
      </InputContainer>
      <InputContainer
        heading="Author visible"
        description="Show the author of each blog post."
      >
        {AuthorEnabledSwitchComponent}
      </InputContainer>
      <InputContainer
        heading="Search"
        description="Enable or disable the user to search for blog posts."
      >
        {SearchSwitchComponent}
      </InputContainer>
      <InputContainer
        heading="Order by"
        description="Blog post sorting order (e.g. Newest to oldest, Oldest to newest,
          Alphabetical). Note: Time sorting is based on the visible publish date."
      >
        {OrderBySwitchComponent}
      </InputContainer>
      <InputContainer
        heading="Number of blogs per page (Numbers Only)"
        description="Number of visible blog cards displayed per blog tab. Minimum of 5 posts per page. It is recommended to be a multiple of 3."
      >
        {PostsPerPageComponent}
      </InputContainer>
      <div>
        <h2 className="text-xl leading-7 text-gray-600">Blog Post Fields</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          The blog and preview card, both display the category when it is
          enabled.
        </p>
        <div className="w-100 border-b"></div>
      </div>
      <InputContainer
        heading="Enable categories"
        description="Enable or disable categories on blogs. You must have 1 category to enable this field."
      >
        {CategoriesEnabledComponent}
      </InputContainer>
      {categoriesEnabled === "disabled" ? (
        <></>
      ) : (
        <>
          <InputContainer
            heading="Manage categories"
            description="Add/edit/delete up to 10 custom category options."
          >
            {CategoriesEditor}
          </InputContainer>
          <InputContainer
            heading="Category Required"
            description="Decide if to make this field required for every blog post. You must have 1 category to require this field."
          >
            {CategoryRequiredSwitchComponent}
          </InputContainer>
        </>
      )}
    </FormContainer>
    <Widget
      src={
        "${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.ConfirmModal"
      }
      props={{
        isOpen: isConfirmModalOpen,
        onCancelClick: () => setModalVisible(false),
        onConfirmClick: () => {
          setModalVisible(false);
          handleOnSubmit();
        },
        title: "Are you sure you want to make changes to categories?",
        content: "All previous blogs with removed categories will be effected.",
        confirmLabel: "I understand",
        cancelLabel: "Cancel",
      }}
    />
    <div className="d-flex gap-1 align-items-center justify-content-end mt-3">
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
        props={{
          classNames: {
            root: "d-flex text-muted fw-bold btn-outline shadow-none border-0 btn-sm",
          },
          label: "Cancel",
          onClick: onHideSettings,
        }}
      />
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.BlogControl"}
        props={{
          title: "Save Settings",
          onClick: handleUpdate,
          testId: "save-settings-button",
          disabled: submitDisabled(),
          icon: "bi-plus-circle-fill",
          loading: loadingSaveSettings,
        }}
      />
    </div>
  </div>
);
