const TextInput = ({
  className,
  format,
  inputProps: { className: inputClassName, ...inputProps },
  key,
  label,
  multiline,
  onChange,
  placeholder,
  type,
  value,
  skipPaddingGap,
  style,
  ...otherProps
}) => {
  const typeAttribute =
    type === "text" || type === "password" || type === "number" ? type : "text";

  const renderedLabels = [
    (label?.length ?? 0) > 0 ? (
      <span className="d-inline-flex gap-1 text-wrap">
        <span>{label}</span>

        {inputProps.required ? <span className="text-danger">*</span> : null}
      </span>
    ) : null,

    format === "markdown" ? (
      <i class="bi bi-markdown text-muted" title="Markdown" />
    ) : null,

    format === "comma-separated" ? (
      <span
        className="d-inline-flex align-items-center text-muted"
        style={{ fontSize: 12 }}
      >
        {format}
      </span>
    ) : null,

    (inputProps.max ?? null) !== null ? (
      <span className="d-inline-flex text-muted" style={{ fontSize: 12 }}>{`${
        value?.length ?? 0
      } / ${inputProps.max}`}</span>
    ) : null,
  ].filter((label) => label !== null);

  return (
    <div
      className={[
        "d-flex flex-column flex-1 align-items-start justify-content-evenly",
        skipPaddingGap ? "" : "gap-1 p-2",
        className ?? "",
      ].join(" ")}
      style={style}
      {...otherProps}
    >
      {renderedLabels.length > 0 ? (
        <span
          className="d-flex justify-content-between align-items-center gap-3 w-100"
          id={key}
        >
          {renderedLabels.map((label) => label)}
        </span>
      ) : null}

      {!multiline ? (
        <div className="input-group">
          {inputProps.prefix && (
            <span className="input-group-text">{inputProps.prefix}</span>
          )}
          <input
            aria-describedby={key}
            aria-label={label}
            className={["form-control border border-2", inputClassName].join(
              " "
            )}
            type={typeAttribute}
            {...{ onChange, placeholder, value, ...inputProps }}
          />
        </div>
      ) : (
        <textarea
          aria-describedby={key}
          aria-label={label}
          className={["form-control border border-2", inputClassName].join(" ")}
          placeholder={
            placeholder + (inputProps.required ? " ( required )" : "")
          }
          style={{ resize: inputProps.resize ?? "vertical" }}
          type={typeAttribute}
          {...{ onChange, placeholder, value, ...inputProps }}
        />
      )}
    </div>
  );
};

return TextInput(props);
