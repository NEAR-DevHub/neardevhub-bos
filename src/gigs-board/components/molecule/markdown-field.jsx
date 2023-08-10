const MarkdownEditor = ({
  key,
  label,
  placeholder,
  className,
  onChange,
  value,
  inputProps: { className: inputClassName, ...inputProps },
}) => {
  return (
    <div
      className={[
        "d-flex flex-column flex-1 gap-1 align-items-start justify-content-evenly p-2",
        className ?? "",
      ].join(" ")}
    >
      <span
        className="d-flex justify-content-between align-items-center gap-3 w-100"
        id={key}
      >
        <span className="d-inline-flex gap-1 text-wrap">
          <span>{label}</span>
          {inputProps.required ? <span className="text-danger">*</span> : null}
        </span>

        <i class="bi bi-markdown text-muted" title="Markdown" />

        {(inputProps.max ?? null) !== null ? (
          <span
            className="d-inline-flex text-muted"
            style={{ fontSize: 12 }}
          >{`${value?.length ?? 0} / ${inputProps.max}`}</span>
        ) : null}
      </span>
      <Widget
        src="devhub.efiz.near/widget/SimpleMDE"
        props={{
          data: { content },
          placeholder,
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
    </div>
  );
};

return MarkdownEditor(props);
