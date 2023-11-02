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

const { data, handle, onSubmit } = props;

const initialData = data; // TODO: Check Storage API

const [content, setContent] = useState(initialData.content || "");
const [title, setTitle] = useState(initialData.title || "");
const [subtitle, setSubtitle] = useState(initialData.subtitle || "");
const [description, setDescription] = useState(initialData.description || "");
const [author, setAuthor] = useState(initialData.author || "");
const [previewMode, setPreviewMode] = useState("card"); // "card" or "page"
const [date, setDate] = useState(initialData.date || new Date());
const [category, setCategory] = useState("guide");

// Legacy State.init for IpfsUploader
State.init({
  image: {
    cid: "bafkreic4xgorjt6ha5z4s5e3hscjqrowe5ahd7hlfc5p4hb6kdfp6prgy4",
  },
});

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
    author !== initialData.author ||
    subtitle !== initialData.subtitle ||
    description !== initialData.description ||
    date !== initialData.date ||
    category !== initialData.category
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
            category,
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
            category,
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
        <div style={{ height: 280, marginBottom: "1rem" }}>
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
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.entity.addon.blog.editor.form"
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
