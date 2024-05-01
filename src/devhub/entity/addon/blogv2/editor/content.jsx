const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Card") ||
  (() => <></>);
const { Page } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Page") ||
  (() => <></>);

// TODO 599 change with settings
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

const { data, handle, onSubmit, onCancel, onDelete } = props;

const initialData = data;

// Parse the date string to create a Date object
const publishedAtDate = new Date(initialData.publishedAt);
const year = publishedAtDate.getFullYear();
const month = (publishedAtDate.getMonth() + 1).toString().padStart(2, "0");
const day = publishedAtDate.getDate().toString().padStart(2, "0");
const initialFormattedDate = year + "-" + month + "-" + day;

const [content, setContent] = useState(initialData.content || "");
const [title, setTitle] = useState(initialData.title || "");
const [subtitle, setSubtitle] = useState(initialData.subtitle || "");
const [description, setDescription] = useState(initialData.description || "");
const [author, setAuthor] = useState(initialData.author || "");
const [previewMode, setPreviewMode] = useState("card"); // "card" or "page"
const [date, setDate] = useState(initialFormattedDate || new Date());
// TODO 599 configurable by settings in addon parameters
const [category, setCategory] = useState(initialData.category || "guide");
const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false);
const [isDraftBtnOpen, setDraftBtnOpen] = useState(false);
const [selectedStatus, setSelectedStatus] = useState(
  initialData.status || "DRAFT"
);

const LoadingButtonSpinner = (
  <span
    class="submit-proposal-draft-loading-indicator spinner-border spinner-border-sm"
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
    handlePublish(selectedStatus);
  };

  const selectedOption = btnOptions.find((i) => i.value === selectedStatus);

  return (
    <DropdownBtnContainer>
      <div
        className="custom-select"
        tabIndex="0"
        onBlur={() => setDraftBtnOpen(false)}
      >
        <div
          className={
            "select-header d-flex gap-1 align-items-center submit-draft-button " +
            (!hasDataChanged() && "disabled")
          }
        >
          <div
            onClick={() => hasDataChanged() && handleSubmit()}
            className="p-2 d-flex gap-2 align-items-center "
            data-testid="submit-blog-button"
          >
            {/* {isTxnCreated ? (
              LoadingButtonSpinner
            ) : ( */}
            <div className={"circle " + selectedOption.iconColor}></div>
            {/* )} */}
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

const hasDataChanged = () => {
  return (
    content !== initialData.content ||
    title !== initialData.title ||
    subtitle !== initialData.subtitle ||
    description !== initialData.description ||
    author !== initialData.author ||
    date !== initialData.publishedAt ||
    category !== initialData.category
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

return (
  <Container>
    <div className="d-flex gap-1 justify-content-end w-100 mb-4">
      <button className="btn btn-light" onClick={onCancel}>
        Cancel
      </button>
      <SubmitBtn />
    </div>

    <ul className="nav nav-tabs" id="editPreviewTabs" role="tablist">
      <li className="nav-item" role="presentation">
        <button
          className="nav-link active"
          id="edit-tab"
          data-bs-toggle="tab"
          data-bs-target="#edit"
          type="button"
          role="tab"
          aria-controls="edit"
          aria-selected="true"
        >
          Edit
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="preview-tab"
          data-bs-toggle="tab"
          data-bs-target="#preview"
          type="button"
          role="tab"
          aria-controls="preview"
          aria-selected="false"
        >
          Preview
        </button>
      </li>
    </ul>
    <div className="tab-content" id="editPreviewTabsContent">
      <div
        className="tab-pane show active p-4"
        id="edit"
        role="tabpanel"
        aria-labelledby="edit-tab"
      >
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
                disabled: !hasDataChanged(),
                icon: {
                  type: "bootstrap_icon",
                  variant: "bi-trash",
                },
                label: "Delete",
                onClick: () => onDelete(data.id),
              }}
            />
          </div>
        ) : null}
      </div>
      <div
        className="tab-pane"
        id="preview"
        role="tabpanel"
        aria-labelledby="preview-tab"
        style={{ position: "relative" }}
      >
        <div style={{ position: "absolute", top: 10, right: 0, zIndex: 9999 }}>
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.molecule.Switch"
            props={{
              currentValue: previewMode,
              key: "previewMode",
              onChange: (e) => setPreviewMode(e.target.value),
              options: [
                { label: "Card", value: "card" },
                { label: "Page", value: "page" },
              ],

              title: "Preview mode selection",
            }}
          />
        </div>
        <div className="w-100 h-100 p-4">
          <Preview />
        </div>
      </div>
    </div>
  </Container>
);
