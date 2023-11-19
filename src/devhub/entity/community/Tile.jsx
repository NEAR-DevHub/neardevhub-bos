const Tile = ({
  children,
  className,
  fullWidth,
  headerSlotRight,
  heading,
  headingAdornment,
  id,
  isHidden,
  noFrame,
  minHeight,
  style,
}) => (
  <div
    className={[
      "d-flex flex-column gap-3",
      className,
      fullWidth ? "w-100" : "",
      !noFrame ? "p-3" : "",
      isHidden ? "d-none" : "",
      "attractable",
    ].join(" ")}
    style={{
      maxWidth: fullWidth ? "100%" : null,
      minHeight: minHeight ?? 180,
      height: "fit-content",
      overflowX: "auto",
      borderRadius: 16,
      border: "1px solid rgba(129, 129, 129, 0.30)",
      background: "#FFFEFE",
      marginBottom: "1rem",
      ...style,
    }}
    {...{ id }}
  >
    {
      <div
        className={[
          "d-flex align-items-center justify-content-between gap-3",

          noFrame || (!heading && !headingAdornment && !headerSlotRight)
            ? "d-none"
            : "",
        ].join(" ")}
        style={{ minHeight: 30 }}
      >
        <h5 className="h5 d-inline-flex gap-2 m-0">
          {headingAdornment}
          <span>{heading}</span>
        </h5>

        {headerSlotRight}
      </div>
    }

    {children}
  </div>
);

return Tile(props);
