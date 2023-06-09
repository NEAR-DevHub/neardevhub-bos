const Tile = ({ children, headerSlotRight, heading, headingAdornment }) => (
  <div
    className="d-flex flex-column gap-3 shadow border rounded-2 p-3 w-100"
    style={{ maxWidth: 896, minHeight: 240 }}
  >
    <div
      className="d-flex align-items-center justify-content-between gap-3"
      style={{ minHeight: 30 }}
    >
      <h5 className="h5 d-inline-flex gap-2 m-0">
        {headingAdornment}
        <span>{heading}</span>
      </h5>

      {headerSlotRight}
    </div>

    {children}
  </div>
);

return Tile(props);
