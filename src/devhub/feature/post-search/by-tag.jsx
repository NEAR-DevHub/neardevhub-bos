const { getAllLabels } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAllLabels) {
  return <p>Loading modules...</p>;
}

const selectedTags = props.tag ? [{ name: props.tag }] : [];

const tags = getAllLabels();

if (tags === null) {
  return <div>Loading ...</div>;
}

const onChange = (selectedTags) => props.onTagSearch?.(selectedTags[0]?.name);

return (
  <Typeahead
    clearButton
    id="basic-typeahead-single"
    labelKey="name"
    options={tags.map((tag) => ({ name: tag }))}
    placeholder="Search by tag"
    selected={selectedTags}
    {...{ onChange }}
  />
);
