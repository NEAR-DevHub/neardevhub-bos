const FormContainer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const {
  title,
  setTitle,
  subtitle,
  setSubtitle,
  options,
  category,
  setCategory,
  description,
  setDescription,
  debouncedUpdateState,
  author,
  setAuthor,
  date,
  setDate,
  content,
  setContent,
} = props;

const TitleInput = ({ title, setTitle }) => {
  return (
    <div>
      <h5>Title</h5>
      <div className="flex-grow-1">
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
          props={{
            className: "flex-grow-1",
            onChange: (e) => setTitle(e.target.value),
            value: title,
            placeholder: "Title",
          }}
        />
      </div>
    </div>
  );
};
const SubtitleInput = ({ subtitle, setSubtitle }) => {
  return (
    <div>
      <h5>Subtitle</h5>
      <div className="flex-grow-1">
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
          props={{
            className: "flex-grow-1",
            onChange: (e) => setSubtitle(e.target.value),
            value: subtitle,
            placeholder: "Subtitle",
          }}
        />
      </div>
    </div>
  );
};

const CategorySelect = ({ options, category, setCategory }) => {
  return (
    <div>
      <h5>Category</h5>
      <div className="flex-grow-1">
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Select"}
          props={{
            className: "flex-grow-1",
            options,
            value: category,
            onChange: (e) => setCategory(e.target.value),
            placeholder: "Select a category",
          }}
        />
      </div>
    </div>
  );
};

const DescriptionInput = ({ description, setDescription }) => {
  return (
    <div>
      <h5>Description</h5>
      <div className="flex-grow-1">
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
          props={{
            className: "flex-grow-1",
            onChange: (e) => setDescription(e.target.value),
            value: description,
            placeholder: "Description",
          }}
        />
      </div>
    </div>
  );
};

const AuthorInput = ({ author, setAuthor }) => {
  return (
    <div>
      <h5>Author</h5>
      <div className="flex-grow-1">
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
          props={{
            className: "flex-grow-1",
            onChange: (e) => setAuthor(e.target.value),
            value: author,
            placeholder: "Author",
          }}
        />
      </div>
    </div>
  );
};

const DateInput = ({ date, setDate }) => {
  return (
    <div>
      <h5>Date</h5>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
  );
};

const ContentEditor = ({ content, setContent }) => {
  return (
    <div>
      <h5>Content</h5>
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownEditor"
        props={{ data: { content }, onChange: setContent }}
      />
    </div>
  );
};

return (
  <FormContainer>
    <TitleInput title={title} setTitle={setTitle} />
    <SubtitleInput subtitle={subtitle} setSubtitle={setSubtitle} />
    <CategorySelect
      options={options}
      category={category}
      setCategory={setCategory}
    />
    <DescriptionInput
      description={description}
      setDescription={setDescription}
      debouncedUpdateState={debouncedUpdateState}
    />
    <AuthorInput author={author} setAuthor={setAuthor} />
    <DateInput date={date} setDate={setDate} />
    <ContentEditor content={content} setContent={setContent} />
  </FormContainer>
);
