const { normalize } = VM.require("${REPL_DEVHUB}/widget/core.lib.stringUtils");
normalize || (normalize = () => {});

const { data: addonParametersJSON, onHideSettings, onSubmit } = props;

const data = JSON.parse(addonParametersJSON);

const [categoriesEnabled, setCategoriesEnabled] = useState(
  data.categoriesEnabled || "disabled" // 'enabled', 'disabled'
);
const [searchEnabled, setSearchEnabled] = useState(
  data.searchEnabled || "disabled" // 'enabled', 'disabled'
);
const [orderBy, setOrderBy] = useState(data.orderBy || "timedesc"); // timedesc, timeasc, alpha
const [categoryRequired, setCategoryRequired] = useState(
  data.categoryRequired || "not_required" // required | not_required
);
const [title, setTitle] = useState(data.title || "Latest Blog Posts");
const [subtitle, setSubtitle] = useState(
  data.subtitle || "Creating blogs for the community" // TODO change default
);

const [postPerPage, setPostPerPage] = useState(data.postPerPage || 10);

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

initState({
  labels,
  labelStringsArray: [],
  newOption: "",
});

const checkLabel = (label) => {};

const setLabels = (labels) => {
  labels = labels.map((o) => {
    o.category = normalize(o.category);
    return o;
  });
  if (labels.length < state.labels.length) {
    let oldLabels = new Set(state.labels.map((label) => label.category));
    for (let label of labels) {
      oldLabels.delete(label.category);
    }
  } else {
    let labelStringsArray = labels.map((o) => {
      return o.category;
    });
    State.update({ labels, labelStringsArray });
  }
};

const categoriesEditor = useMemo(() => {
  const examples = ["News", "Guide", "Reference", "Tutorial", "Other"];
  const options = examples.map((category) => {
    return { category };
  });

  return (
    <Typeahead
      multiple
      labelKey="category"
      onInputChange={checkLabel}
      onChange={setLabels}
      options={options}
      placeholder="News, Guide, Reference, etc."
      selected={state.labels}
      positionFixed
      allowNew={(results, props) => {
        console.log({
          results,
          props,
          labels: state.labels,
          labelStringsArray,
          size: new Set(state.labels).size,
          length: state.labels.length,
        });
        // Don't allow double and no more than 10 labels
        return (
          !new Set(labelStringsArray).has(props.text) &&
          props.options.length < 3
        );
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
    margin-bottom: 1rem;
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

  const structure = {
    title: v.title || "Latest Blog Posts",
    subtitle: v.subtitle || "Creating blogs for the community",
    searchEnabled: v.searchEnabled || "disabled", // 'enabled', 'disabled'
    orderBy: v.orderBy || "timedesc", // timedesc, timeasc, alpha
    categoriesEnabled: v.categoriesEnabled || "disabled", // 'enabled', 'disabled'
    categories: v.categories || [],
  };

  onSubmit({
    title,
    subtitle,
    searchEnabled,
    orderBy,
    categoriesEnabled,
    categories,
    categoryRequired,
  });
};

const categoriesIsInvalid = () =>
  categoriesEnabled === "enabled" && categories.length === 0;

const submitDisabled = () => {
  return categoriesIsInvalid() || !title || !subtitle;
};

return (
  <div>
    <div className="d-flex gap-1 align-items-end justify-content-end">
      <button
        onClick={onHideSettings}
        type="button"
        className="rounded-md bg-devhub-green-light px-3.5 py-2.5 text-sm font-semibold text-devhub-green hover:text-white shadow-sm hover:bg-indigo-100"
      >
        Cancel
      </button>
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

    <FormContainer>
      <h2 className="text-xl font-bold leading-7 text-gray-900">
        Blog List Page
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        This information will be displayed publicly so be careful what you
        share.
      </p>
      <div className="w-100 border-b"></div>

      <InputContainer
        heading="Title"
        description="Highlight the essence of your blog in a few words. This will appear on the top of your blog page. Default: Latest Blog Posts"
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
    </FormContainer>
    <FormContainer>
      <h2 className="text-xl font-bold leading-7 text-gray-900">
        Blog Post Fields
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        This information will be displayed publicly so be careful what you
        share.
      </p>
      <div className="w-100 border-b"></div>
      <InputContainer
        heading="Enable categories"
        description="Enable or disable categories on blogs"
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
        description="Decide if to make this field required for every blog post"
      >
        {CategoryRequiredSwitchComponent}
      </InputContainer>
    </FormContainer>
  </div>
);
