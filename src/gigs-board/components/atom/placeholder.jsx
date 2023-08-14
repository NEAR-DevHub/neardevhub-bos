const Placeholder = ({ isLoading }) => (
  <div
    className={[
      "d-flex justify-content-center align-items-center gap-4 w-100 h-100",
      isLoading ? "" : "d-none",
    ].join(" ")}
  >
    <div class="spinner-grow text-info" role="status" />

    <div class="spinner-grow text-info" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>

    <div class="spinner-grow text-info" role="status" />
  </div>
);

return Placeholder(props);
