const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Card") ||
  (() => <></>);
const { Page } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Page") ||
  (() => <></>);

const categories = [
  {
    label: "Guide",
    value: "guide",
  },
  {
    label: "News",
    value: "news",
  },
  {
    label: "Reference",
    value: "reference",
  },
];

const selectOptions = useMemo(
  () =>
    categories.map((it) => ({
      label: it.label,
      value: it.value,
    })),
  [categories]
);

const Banner = styled.div`
  border-radius: var(--bs-border-radius-xl) !important;
  height: 100%;

  & > div :not(.btn) {
    position: absolute;
    display: none;
    margin: 0 !important;
    width: 0 !important;
    height: 0 !important;
  }

  .btn {
    padding: 0.5rem 0.75rem !important;
    min-height: 32;
    line-height: 1;

    border: none;
    border-radius: 50px;
    --bs-btn-color: #ffffff;
    --bs-btn-bg: #087990;
    --bs-btn-border-color: #087990;
    --bs-btn-hover-color: #ffffff;
    --bs-btn-hover-bg: #055160;
    --bs-btn-hover-border-color: #055160;
    --bs-btn-focus-shadow-rgb: 49, 132, 253;
    --bs-btn-active-color: #ffffff;
    --bs-btn-active-bg: #055160;
    --bs-btn-active-border-color: #055160;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
`;

const DropdownBtnContainer = styled.div`
  font-size: 13px;
  min-width: 150px;

  .custom-select {
    position: relative;
  }

  .select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    border-radius-top: 5px;
    cursor: pointer;
    background-color: #fff;
    border-radius: 5px;
  }

  .no-border {
    border: none !important;
  }

  .options-card {
    position: absolute;
    top: 100%;
    right: 0;
    width: 200%;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 0.5rem;
    z-index: 99;
    font-size: 13px;
    border-radius:0.375rem !important;
  }

  .left {
    right: 0 !important;
    left: auto !important;
  }

  @media screen and (max-width: 768px) {
    .options-card {
      right: 0 !important;
      left: auto !important;
    }
  }

  .option {
    margin-block: 5px;
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.3s ease;
    border-radius: 0.375rem !important;
  }

  .option:hover {
    background-color: #f0f0f0; /* Custom hover effect color */
  }

  .option:last-child {
    border-bottom: none;
  }

  .selected {
    background-color: #f0f0f0;
  }

  .disabled {
    background-color: #f4f4f4 !important;
    cursor: not-allowed !important;
    font-weight: 500;
    color: #b3b3b3;
  }

  .disabled .circle {
    opacity: 0.5;
  }

  .circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .grey {
    background-color: #818181;
  }

  .green {
    background-color: #04a46e;
  }

  a:hover {
    text-decoration: none;
  }

}
`;

const {
  data,
  handle,
  onSubmit,
  onCancel,
  onDelete,
  allBlogs: allBlogsOfThisInstance,
} = props;

const allBlogKeys =
  Social.keys(`${handle}.community.devhub.near/blog/*`, "final") || {};

const initialData = data;

const [initialBlogAmount, setInitialBlogAmount] = useState(
  Object.keys(allBlogKeys[`${handle}.community.devhub.near`]["blog"] || {})
    .length || 0
);

// Parse the date string to create a Date object
const publishedAtDate = new Date(initialData.publishedAt || new Date());
const year = publishedAtDate.getFullYear();
const month = (publishedAtDate.getMonth() + 1).toString().padStart(2, "0");
const day = publishedAtDate.getDate().toString().padStart(2, "0");
const initialFormattedDate = year + "-" + month + "-" + day;

const [content, setContent] = useState(initialData.content || "");
const [title, setTitle] = useState(initialData.title || "");
const [subtitle, setSubtitle] = useState(initialData.subtitle || "");
const [description, setDescription] = useState(initialData.description || "");
const [author, setAuthor] = useState(initialData.author || context.accountId);
const [previewMode, setPreviewMode] = useState("edit"); // "edit" or "card" or "page"
const [date, setDate] = useState(initialFormattedDate || new Date());
const [category, setCategory] = useState(initialData.category || "guide");
const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false);
const [isDraftBtnOpen, setDraftBtnOpen] = useState(false);
const [selectedStatus, setSelectedStatus] = useState(
  initialData.status || "DRAFT"
);

// Dont ask me again check when deleting
const [submittedBlogDeleted, setSubmittedBlogDeleted] = useState(null);
useEffect(() => {
  const checkForDeletedBlogInSocialDB = () => {
    const communityAccount = `${handle}.community.devhub.near`;
    Near.asyncView("${REPL_SOCIAL_CONTRACT}", "get", {
      keys: [`${communityAccount}/blog/**`],
      options: {
        return_deleted: true,
      },
    }).then((result) => {
      try {
        if (
          JSON.parse(result[communityAccount].blog[submittedBlogDeleted]) ===
          null
        ) {
          // Blog is deleted
          setSubmittedBlogDeleted(null);
        }
      } catch (e) {}
      setTimeout(() => checkForDeletedBlogInSocialDB(), 1000);
    });
  };
  if (submittedBlogDeleted) {
    checkForDeletedBlogInSocialDB();
  }
}, [submittedBlogDeleted]);

// Dont ask me again check when updating and creating blogs
const [submittedBlogData, setSubmittedBlogData] = useState(null);
useEffect(() => {
  const checkForNewOrUpdatedBlogInSocialDB = () => {
    const communityAccount = `${handle}.community.devhub.near`;
    Near.asyncView("${REPL_SOCIAL_CONTRACT}", "get", {
      keys: [`${communityAccount}/blog/**`],
    }).then((result) => {
      try {
        if (initialData.id) {
          // Update
          const updatedBlog =
            result[communityAccount]["blog"][initialData.id].metadata;
          updatedBlog.content =
            result[communityAccount]["blog"][initialData.id][""];

          let theyMatch = true;
          let keys = Object.keys(submittedBlogData);
          for (const key of keys) {
            // Get the full data of the new blog and compare it to socialDB
            if (updatedBlog[key] !== submittedBlogData[key]) {
              theyMatch = false;
              break;
            }
          }
          if (theyMatch) {
            setSubmittedBlogData(null);
          }
        } else {
          // Create
          // TODO PR
          console.log("initialBlogAmount + 1 === Object.keys(result).length");
          console.log(
            initialBlogAmount,
            initialBlogAmount + 1,
            Object.keys(result[communityAccount]["blog"]).length
          );
          if (initialBlogAmount + 1 === Object.keys(result).length) {
            setSubmittedBlogData(null);
          }
        }
      } catch (e) {
        console.log("Error in useEffect checkForNewOrUpdatedBlogInSocialDB", e);
      }
      setTimeout(() => checkForNewOrUpdatedBlogInSocialDB(), 1000);
    });
  };
  if (submittedBlogData) {
    checkForNewOrUpdatedBlogInSocialDB();
  }
}, [submittedBlogData]);

const LoadingButtonSpinner = (
  <span
    class="submit-blog-loading-indicator spinner-border spinner-border-sm"
    role="status"
    aria-hidden="true"
  ></span>
);

const SubmitBtn = () => {
  const btnOptions = [
    {
      iconColor: "grey",
      label: "Save Draft",
      description:
        "The author can still edit the blog before sharing it with the community.",
      value: "DRAFT",
    },
    {
      iconColor: "green",
      label: "Publish",
      description:
        "The blog will be shared with the community and can be viewed by everyone.",
      value: "PUBLISH",
    },
  ];

  const handleOptionClick = (option) => {
    setDraftBtnOpen(false);
    setSelectedStatus(option.value);
  };

  const toggleDropdown = () => {
    setDraftBtnOpen(!isDraftBtnOpen);
  };

  const handleSubmit = () => {
    // Set the title for dont ask me again check
    setSubmittedBlogData({
      title,
      subtitle,
      description,
      author,
      date,
      content,
      category,
      community: handle,
      publishedAt,
      status: selectedStatus,
    });
    handlePublish(selectedStatus);
  };

  const selectedOption = btnOptions.find((i) => i.value === selectedStatus);

  return (
    <DropdownBtnContainer>
      <div className="custom-select" tabIndex="0">
        <div
          data-testid="parent-submit-blog-button"
          className={
            "select-header d-flex gap-1 align-items-center submit-draft-button " +
            (shouldBeDisabled() && "disabled")
          }
        >
          <div
            onClick={() => !shouldBeDisabled() && handleSubmit()}
            className="p-2 d-flex gap-2 align-items-center "
            data-testid="submit-blog-button"
          >
            {submittedBlogData ? (
              LoadingButtonSpinner
            ) : (
              <div className={"circle " + selectedOption.iconColor}></div>
            )}
            <div className={`selected-option`}>{selectedOption.label}</div>
          </div>
          <div
            className="h-100 p-2"
            style={{ borderLeft: "1px solid #ccc" }}
            onClick={toggleDropdown}
          >
            <i
              data-testid="toggle-dropdown"
              class={`bi bi-chevron-${isDraftBtnOpen ? "up" : "down"}`}
            ></i>
          </div>
        </div>

        {isDraftBtnOpen && (
          <div className="options-card">
            {btnOptions.map((option) => (
              <div
                key={option.value}
                className={`option ${
                  selectedOption.value === option.value ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
                data-testid={"submit-button-option-" + option.value}
              >
                <div className={`d-flex gap-2 align-items-center`}>
                  <div className={"circle " + option.iconColor}></div>
                  <div className="fw-bold">{option.label}</div>
                </div>
                <div className="text-muted text-xs">{option.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DropdownBtnContainer>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: left;
`;

const shouldBeDisabled = () => {
  if (data.id) {
    // means it's an existing blog post
    return !hasDataChanged() || hasEmptyFields() || submittedBlogData;
  }

  return hasEmptyFields() || submittedBlogData;
};

const hasDataChanged = () => {
  return (
    content !== initialData.content ||
    title !== initialData.title ||
    subtitle !== initialData.subtitle ||
    description !== initialData.description ||
    author !== initialData.author ||
    date !== initialFormattedDate ||
    category !== initialData.category
  );
};

const hasEmptyFields = () => {
  return (
    content.trim() === "" ||
    title.trim() === "" ||
    subtitle.trim() === "" ||
    description.trim() === "" ||
    author.trim() === "" ||
    date === "NaN-NaN-NaN" ||
    category.trim() === ""
  );
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
        content,
        status,
        author,
        category,
        community: handle,
      },
      data.id !== undefined
    );
};

const handleDelete = () => {
  setSubmittedBlogDeleted(initialData.id);
  onDelete(data.id);
};

function Preview() {
  switch (previewMode) {
    case "card": {
      return (
        <Card
          data={{
            title,
            subtitle,
            description,
            publishedAt: date,
            content,
            author,
            category,
            community: handle,
          }}
        />
      );
    }
    case "page": {
      return (
        <Page
          data={{
            title,
            subtitle,
            description,
            publishedAt: date,
            content,
            author,
            category,
            community: handle,
          }}
        />
      );
    }
  }
}

const tabs = [
  { name: "Edit", value: "edit" },
  { name: "Preview Card", value: "card" },
  { name: "Preview Page", value: "page" },
];

function classNames() {
  const classes = Array.from(arguments);
  return classes.filter(Boolean).join(" ");
}

return (
  <Container>
    <div className="flex gap-1 justify-between w-100 mb-4">
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={tabs.find((tab) => tab.value === previewMode).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name} onClick={() => setPreviewMode(tab.value)}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="-mb-px flex gap-1" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                onClick={() => setPreviewMode(tab.value)}
                className={`rounded-md px-3.5 py-2.5 text-sm cursor-pointer font-semibold text-devhub-green hover:text-white shadow-sm hover:bg-indigo-100 ${
                  tab.value === previewMode
                    ? " bg-devhub-green text-white"
                    : " bg-devhub-green-light text-devhub-green"
                }`}
                aria-current={tab.value === previewMode ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          className="rounded-md bg-white px-2.5 py-1.5 text-sm h-9 font-semibold text-gray-900 border ring-1 ring-inset ring-gray-300 hover:bg-gray-600 hover:border-1"
          onClick={onCancel}
        >
          Cancel
        </button>
        <SubmitBtn />
      </div>
    </div>

    <div>
      {previewMode === "edit" && (
        <div className="tab-pane show active p-4" id="edit">
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.form"
            props={{
              title,
              setTitle,
              subtitle,
              setSubtitle,
              options: selectOptions,
              category,
              setCategory,
              description,
              setDescription,
              author,
              setAuthor,
              date,
              setDate,
              content,
              setContent,
            }}
          />
          {/* Show delete button */}
          {data.id ? (
            <div
              className={
                "d-flex align-items-center justify-content-start gap-3 mt-4"
              }
            >
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
                props={{
                  classNames: { root: "btn-danger" },
                  icon: {
                    type: "bootstrap_icon",
                    variant: "bi-trash",
                  },
                  label: "Delete",
                  testId: "delete-blog-button",
                  disabled: submittedBlogDeleted,
                  loading: submittedBlogDeleted,
                  onClick: handleDelete,
                }}
              />
            </div>
          ) : null}
        </div>
      )}
      {(previewMode === "page" || previewMode === "card") && (
        <div
          className="w-100 h-100 p-4"
          id="preview"
          style={{ position: "relative" }}
        >
          <Preview />
        </div>
      )}
    </div>
  </Container>
);
