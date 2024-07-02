function Tile({ id, children, className, minHeight, style }) {
  return (
    <div
      id={id}
      className={[
        "d-flex flex-column rounded-4 attractable w-100 border",
        className,
      ].join(" ")}
      style={{
        minHeight: minHeight ?? 180,
        height: "fit-content",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

return { Tile };
