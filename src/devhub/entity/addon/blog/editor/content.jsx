const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Card") ||
  (() => <></>);
const { Page } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Page") ||
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
];

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

const FormContainer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const { data, handle, onSubmit } = props;

const initialData = data; // TODO: Check Storage API

const [content, setContent] = useState(initialData.content || "");
const [title, setTitle] = useState(initialData.title || "");
const [subtitle, setSubtitle] = useState(initialData.subtitle || "");
const [description, setDescription] = useState(initialData.description || "");
const [author, setAuthor] = useState(initialData.author || "");
const [previewMode, setPreviewMode] = useState("card"); // "card" or "page"
const [date, setDate] = useState(
  (initialData.date && new Date(initialData.date)) || new Date()
);
const [category, setCategory] = useState("guide");

// Legacy State.init for IpfsUploader
State.init({
  image: {
    cid: "bafkreic4xgorjt6ha5z4s5e3hscjqrowe5ahd7hlfc5p4hb6kdfp6prgy4",
  },
});

let timeoutId;

const debounce = (func, delay) => {
  if (!delay) {
    delay = 300;
  }
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
`;

const cidToURL = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

const hasDataChanged = () => {
  return (
    content !== initialData.content ||
    title !== initialData.title ||
    author !== initialData.author
  );
};

const handlePublish = () => {
  onSubmit &&
    onSubmit(
      {
        id: data.id || undefined,
        title,
        subtitle,
        description,
        date,
        content,
        author,
        image: state.image.cid,
        tags: data.includeLabels,
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
            date,
            content,
            author,
            image: state.image,
            tags: data.includeLabels,
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
            date,
            content,
            author,
            image: state.image,
            tags: data.includeLabels,
            community: handle,
          }}
        />
      );
    }
  }
}

return (
  <Container>
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
        <FormContainer>
          <div style={{ height: 280 }}>
            <Banner
              alt="Blog background Preview"
              className="card-img-top d-flex flex-column justify-content-end align-items-end p-4"
              style={{
                background: `center / cover no-repeat url(${cidToURL(
                  state.image.cid
                )})`,
              }}
            >
              <IpfsImageUpload image={state.image} />
            </Banner>
          </div>
          <div>
            <h5>Title</h5>
            <div className="flex-grow-1">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
                props={{
                  className: "flex-grow-1",
                  onChange: debounce((e) => setTitle(e.target.value)),
                  value: title,
                  placeholder: "Title",
                }}
              />
            </div>
          </div>
          <div>
            <h5>Subtitle</h5>
            <div className="flex-grow-1">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
                props={{
                  className: "flex-grow-1",
                  onChange: debounce((e) => setSubtitle(e.target.value)),
                  value: subtitle,
                  placeholder: "Subtitle",
                }}
              />
            </div>
          </div>
          <div>
            <h5>Category</h5>
            <div className="flex-grow-1">
              <Widget
                src={"${REPL_NEAR}/widget/DIG.InputSelect"}
                props={{
                  groups: [
                    {
                      items: categories.map((it) => ({
                        label: it.label,
                        value: it.value,
                      })),
                    },
                  ],
                  rootProps: {
                    value: category,
                    placeholder: "Select a category",
                    onValueChange: (v) => setCategory(v),
                  },
                }}
              />
            </div>
          </div>
          <div>
            <h5>Description</h5>
            <div className="flex-grow-1">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
                props={{
                  className: "flex-grow-1",
                  onChange: debounce((e) => setDescription(e.target.value)),
                  value: description,
                  placeholder: "Description",
                }}
              />
            </div>
          </div>
          <div>
            <h5>Author</h5>
            <div className="flex-grow-1">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
                props={{
                  className: "flex-grow-1",
                  onChange: debounce((e) => setAuthor(e.target.value)),
                  value: author,
                  placeholder: "Author",
                }}
              />
            </div>
          </div>
          <div>
            <h5>Date</h5>
            <input
              type="date"
              value={date.toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <h5>Content</h5>
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownEditor"
              props={{ data: { content }, onChange: setContent }}
            />
          </div>
        </FormContainer>
        <div
          className={"d-flex align-items-center justify-content-end gap-3 mt-4"}
        >
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
            props={{
              classNames: { root: "btn-success" },
              disabled: !hasDataChanged(),
              icon: {
                type: "bootstrap_icon",
                variant: "bi-check-circle-fill",
              },
              label: "Publish",
              onClick: handlePublish,
            }}
          />
        </div>
      </div>
      <div
        className="tab-pane"
        id="preview"
        role="tabpanel"
        aria-labelledby="preview-tab"
        style={{ position: "relative" }}
      >
        <div style={{ position: "absolute", top: 10, right: 0 }}>
          <Widget
            // LEGACY
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.button-switch"
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
