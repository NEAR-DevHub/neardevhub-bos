const Button = ({ adornment, className, label, ...restProps }) => (
  <button
    className={[
      "btn shadow d-inline-flex align-items-center gap-2",
      className ?? "",
    ].join(" ")}
    style={{ width: "fit-content" }}
    {...restProps}
  >
    {adornment}
    <span>{label}</span>
  </button>
);

return Button(props);
