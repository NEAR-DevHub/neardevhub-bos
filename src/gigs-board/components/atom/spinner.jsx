const Spinner = ({ classNames, isHidden }) => (
  <div
    className={[
      "d-flex justify-content-center align-items-center gap-4 w-100 h-100",
      classNames?.root ?? "",
      isHidden ? "d-none" : "",
    ].join(" ")}
  >
    <div className="spinner-grow text-info" role="status" />

    <div
      className="spinner-grow text-info"
      role="status"
      style={{ animationDelay: "0.3s" }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>

    <div
      className="spinner-grow text-info"
      role="status"
      style={{ animationDelay: "0.6s" }}
    />
  </div>
);

return Spinner(props);
