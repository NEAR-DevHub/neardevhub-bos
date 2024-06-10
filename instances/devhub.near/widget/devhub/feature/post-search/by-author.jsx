const { getAllAuthors } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAllAuthors) {
  return <p>Loading modules...</p>;
}

const selectedAuthors = props.author ? [{ name: props.author }] : [];

const authors = getAllAuthors();

if (authors === null) {
  return <div>Loading ...</div>;
}

const onChange = (selectedAuthors) =>
  props.onAuthorSearch(selectedAuthors[0]?.name);

return (
  <Typeahead
    clearButton
    id="basic-typeahead-single"
    labelKey="name"
    options={authors.map((author) => ({ name: author }))}
    placeholder="Search by author"
    selected={selectedAuthors}
    {...{ onChange }}
  />
);
