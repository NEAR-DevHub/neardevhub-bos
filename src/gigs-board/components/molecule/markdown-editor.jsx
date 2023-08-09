const content = props.content;
const onChange = props.onChange;

return (
  <Widget
    src="devhub.efiz.near/widget/SimpleMDE"
    props={{
      data: { content },
      onChange,
      toolbar: [
        "heading",
        "bold",
        "italic",
        "quote",
        "code",
        "link",
        "unordered-list",
        "ordered-list",
        "checklist",
        "mention",
        "reference",
      ],
      statusConfig: [],
    }}
  />
);
