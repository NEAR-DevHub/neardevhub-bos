const { parametersData, onSubmitSettings, onHideSettings } = props;

const data = JSON.parse(parametersData);

const [categoriesEnabled, setCategoriesEnabled] = useState(
  data.categoriesEnabled || "disabled"
);
const [searchEnabled, setSearchEnabled] = useState(
  data.searchEnabled || "disabled"
);
const [orderBy, setOrderBy] = useState(data.orderBy || "timedesc");
const [categoryRequired, setCategoryRequired] = useState(
  data.categoryRequired ?? false
);
const [title, setTitle] = useState(data.title || "Latest Blog Posts");
const [subtitle, setSubtitle] = useState(data.subtitle || " ");

const InputContainer = ({ heading, description, children }) => {
  return (
    <div className="d-flex flex-column gap-1 gap-sm-2 w-100">
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
          { label: "Required", value: true },
          { label: "Not Required", value: false },
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

const PostsPerPageComponent = useMemo(() => {
  return <>TODO</>;
}, []);

const FormContainer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const handleOnSubmit = () => {
  onSubmitSettings({
    title,
    subtitle,
    searchEnabled,
    orderBy,
    categoriesEnabled,
    categories, // TODO 599
    categoryRequired,
  });
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
        }}
      />
    </div>
    <FormContainer>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Blog List Page
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        This information will be displayed publicly so be careful what you
        share.
      </p>
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
        heading="Number of posts per page"
        description="Number of posts displayed per page use number input"
      >
        {PostsPerPageComponent}
      </InputContainer>
    </FormContainer>
    <FormContainer>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Blog Post Fields
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        This information will be displayed publicly so be careful what you
        share.
      </p>
      {/* TODO borders */}
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
        <>
          Add / Edit / Delete - same like labels on proposals in events
          committee
        </>
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
