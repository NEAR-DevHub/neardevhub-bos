/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */

const Tile = ({
  children,
  borderRadius,
  className,
  fullWidth,
  headerSlotRight,
  heading,
  headingAdornment,
  id,
  isHidden,
  noBorder,
  noFrame,
  minHeight,
  style,
}) => (
  <AttractableDiv
    className={[
      "d-flex flex-column gap-3",
      className,
      fullWidth ? "w-100" : "",
      !borderRadius ? "rounded-4" : borderRadius,
      !noBorder ? "border" : "shadow-none",
      !noFrame ? "p-4" : "",
      isHidden ? "d-none" : "",
    ].join(" ")}
    style={{
      maxWidth: fullWidth ? "100%" : null,
      minHeight: minHeight ?? 180,
      height: "fit-content",
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
  </AttractableDiv>
);

return Tile(props);
