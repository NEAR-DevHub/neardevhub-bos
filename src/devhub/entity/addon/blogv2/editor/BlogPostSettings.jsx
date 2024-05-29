const { normalize } = VM.require("${REPL_DEVHUB}/widget/core.lib.stringUtils");
normalize || (normalize = () => {});

const { data: addonParametersJSON, onHideSettings, onSubmit } = props;

const data = JSON.parse(addonParametersJSON);

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
initState({
  labels: data.categories || [],
  categoriesArray: (data.categories || []).map((o) => o.category),
});
const [categoryRequired, setCategoryRequired] = useState(
  data.categoryRequired || "not_required" // required | not_required
);

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

const AuthorEnabledSwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
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

const CategoryRequiredSwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
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

const OrderBySwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
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

const SearchSwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
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

const CategoriesSwitchComponent = useMemo(() => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
      props={{
        currentValue: categoriesEnabled,
        key: "categories",
        onChange: (e) => setCategoriesEnabled(e.target.value),
        options: [
          { label: "Enabled", value: "enabled" },
          { label: "Disabled", value: "disabled" },
        ],

        title: "Categories",
      }}
    />
  );
}, [categoriesEnabled]);

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

const checkCategory = (category) => {
  console.log("checkCategory", category);
};

const setCategories = (labels) => {
  labels = labels.map((o) => ({
    category: o.category, // labelKey == category
    value: normalize(o.category),
  }));
  let categoriesArray = [];
  categoriesArray = labels.map((o) => o.label);
  State.update({ labels, categoriesArray });
};

const categoriesEditor = useMemo(() => {
  const examples = ["News", "Guide", "Reference"];
  const options = examples.map((category) => {
    return { category };
  });

  return (
    <Typeahead
      multiple
      labelKey="category"
      onInputChange={checkCategory}
      onChange={setCategories}
      options={options}
      placeholder="News, Guide, Reference, etc."
      selected={state.labels}
      positionFixed
      caseSensitive={true}
      allowNew={(results, props) => {
        // Don't allow more than 10 categories
        return props.selected.length < 10;
      }}
    />
  );
}, []);

const PostsPerPageComponent = useMemo(() => {
  return (
    <div className="col-lg-6 mb-2">
      <input
        className="block w-full rounded-md border-0 px-1 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        data-testid="post-per-page-input"
        type="number"
        value={parseInt(postPerPage) > 0 ? postPerPage : ""}
        min={0}
        onChange={(event) => {
          setPostPerPage(
            Number(event.target.value.toString().replace(/e/g, "")).toString()
          );
        }}
      />
    </div>
  );
}, []);

const FormContainer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

/**
 * If the settings are empty we use default values for blog settings
 * These default values should reflect in the configurator / viewer and settings page
 */
const handleOnSubmit = () => {
  if (v.categoriesEnabled === "enabled" && v.categories.length === 0) {
    return;
  }

  const cEnabled = v.categoriesEnabled || "disabled";
  // If categories are enabled there must be at least 1 category
  const cats =
    cEnabled == "enabled" && v.categories && v.categories.length > 0
      ? v.categories
      : [];
  // If categories are empty they can not be required
  const req = cats.length ? v.categoryRequired : "not_required";

  const structure = {
    title: v.title || "",
    subtitle: v.subtitle || "",
    authorEnabled: v.authorEnabled || "disabled", // 'enabled', 'disabled'
    searchEnabled: v.searchEnabled || "disabled", // 'enabled', 'disabled'
    orderBy: v.orderBy || "timedesc", // timedesc, timeasc, alpha
    categoriesEnabled: cEnabled, // 'enabled', 'disabled'
    categories: cats,
    categoryRequired: req,
  };

  onSubmit(structure);
};

const categoriesIsInvalid = () =>
  categoriesEnabled === "enabled" && categories.length === 0;

const submitDisabled = () => {
  return categoriesIsInvalid() || !title || !subtitle;
};

return (
  <div>
    <FormContainer>
      <div>
        <div className="d-flex justify-content-between">
          <div>
            <h2 className="text-xl font-bold leading-7 text-gray-900">
              Blog List Page
            </h2>
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
                onClick: handleOnSubmit,
                testId: "save-settings-button",
                disabled: submitDisabled(),
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
        description="Provide a brief subtitle for the blog"
      >
        {SubtitleComponent}
      </InputContainer>
      <InputContainer
        heading="Author visible"
        description="Show the author of the blog post."
      >
        {AuthorEnabledSwitchComponent}
      </InputContainer>
      <InputContainer
        heading="Search"
        description="Enable or disable the user to search for blog posts"
      >
        {SearchSwitchComponent}
      </InputContainer>
      <InputContainer
        heading="Order by"
        description="Blog post sorting order (e.g. Newest to oldest, Oldest to newest,
          Alphabetical) Note this based on the visible publish date"
      >
        {OrderBySwitchComponent}
      </InputContainer>
      <InputContainer
        heading="Number of blogs per page (Numbers Only)"
        description="Number of visible blog cards displayed per blog tab"
      >
        {PostsPerPageComponent}
      </InputContainer>
      <div>
        <h2 className="text-xl font-bold leading-7 text-gray-900">
          Blog Post Fields
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          The blog and the preview card both display the category if it is
          enabled.
        </p>
        <div className="w-100 border-b"></div>
      </div>
      <InputContainer
        heading="Enable categories"
        description="Enable or disable categories on blogs. You must have 1 category to enable this field."
      >
        {CategoriesSwitchComponent}
      </InputContainer>
      <InputContainer
        heading="Manage categories"
        description="Add/edit/delete up to 10 custom category options"
      >
        {categoriesEditor}
      </InputContainer>
      <InputContainer
        heading="Category Required"
        description="Decide if to make this field required for every blog post. You must have 1 category to require this field."
      >
        {CategoryRequiredSwitchComponent}
      </InputContainer>
    </FormContainer>

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
          onClick: handleOnSubmit,
          testId: "save-settings-button",
          disabled: submitDisabled(),
        }}
      />
    </div>
  </div>
);
