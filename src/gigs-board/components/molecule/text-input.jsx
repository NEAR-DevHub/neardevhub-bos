const TextInput = ({
  className,
  inputProps: { className: inputClassName, ...inputProps },
  key,
  label,
  multiline,
  onChange,
  placeholder,
  value,
}) => (
  <div
    className={[
      "d-flex flex-column flex-1 gap-1 align-items-start justify-content-evenly p-2",
      className ?? "",
    ].join(" ")}
  >
    <span className="text-wrap" id={key}>
      {label}
    </span>

    {!multiline ? (
      <input
        aria-describedby={key}
        aria-label={label}
        className={["form-control border border-2", inputClassName].join(" ")}
        type="text"
        {...{ onChange, placeholder, value, ...inputProps }}
      />
    ) : (
      <textarea
        aria-describedby={key}
        aria-label={label}
        className={["form-control border border-2", inputClassName].join(" ")}
        type="text"
        {...{ onChange, placeholder, value, ...inputProps }}
      />
    )}
  </div>
);

return TextInput(props);
