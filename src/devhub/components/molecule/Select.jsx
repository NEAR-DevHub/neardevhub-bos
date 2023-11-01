const SelectInput = ({
  className,
  key,
  label,
  onChange,
  options,
  placeholder,
  value,
  style,
  ...otherProps
}) => {
  const renderedLabels =
    [(label?.length ?? 0) > 0 && <span>{label}</span>] || [];

  return (
    <div
      className={[
        "d-flex flex-column flex-1 align-items-start justify-content-evenly",
        className,
      ].join(" ")}
      style={style}
      {...otherProps}
    >
      {renderedLabels.length > 0 && (
        <span className="d-flex justify-content-between align-items-center gap-3 w-100">
          {renderedLabels}
        </span>
      )}

      <div className="input-group">
        <select
          className="form-select border border-2"
          value={value}
          onChange={onChange}
          aria-label={label}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

return SelectInput(props);
