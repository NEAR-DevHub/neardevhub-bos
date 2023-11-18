const Alert = ({ onClick, message }) =>
  message && (
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      {message}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClick}
      ></button>
    </div>
  );

return Alert(props);
