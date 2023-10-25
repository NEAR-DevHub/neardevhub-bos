const { data, onSubmit } = props;

const initialData = data;
const [content, setContent] = useState(data.content || "");
const [title, setTitle] = useState(data.title || "");
const [description, setDescription] = useState(data.description || "");

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
`;

const hasDataChanged = () => {
  return (
    content !== initialData.content ||
    title !== initialData.title ||
    description !== initialData.description
  );
};

const handleSubmit = () => {
  onSubmit({ title, description, content });
};

return (
  <Container>
    <h5>Title</h5>
    <div className="flex-grow-1">
      <Widget
        // TODO: LEGACY.
        src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
        props={{
          className: "flex-grow-1",
          onChange: (e) => setTitle(e.target.value),
          value: title,
          placeholder: "Title",
        }}
      />
    </div>
    <h5>Description</h5>
    <div className="flex-grow-1">
      <Widget
        // TODO: LEGACY.
        src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
        props={{
          className: "flex-grow-1",
          onChange: (e) => setDescription(e.target.value),
          value: description,
          placeholder: "Description",
        }}
      />
    </div>
    <h5>Content</h5>
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownEditor"}
      props={{ data: { content }, onChange: setContent }}
    />
    <div class="card-footer">
      <h5>Preview:</h5>
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"
        props={{
          text: content,
        }}
      />
    </div>
    <div className={"d-flex align-items-center justify-content-end gap-3 mt-4"}>
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
        props={{
          classNames: { root: "btn-success" },
          disabled: !hasDataChanged(),
          icon: {
            type: "bootstrap_icon",
            variant: "bi-check-circle-fill",
          },
          label: "Submit",
          onClick: handleSubmit,
        }}
      />
    </div>
  </Container>
);