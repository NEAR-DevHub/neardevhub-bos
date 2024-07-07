const { title, onClick, icon, color, loading } = props;

return (
  <button
    type="button"
    data-testid={props.testId ? props.testId : ""}
    className="btn btn-primary inline-flex items-center gap-x-1.5 rounded-md bg-devhub-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-devhub-green-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    style={{ backgroundColor: color }}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    <i className={`-ml-0.5 h-5 w-5 bi ${props.icon}`} aria-hidden="true"></i>
    {loading ? "Loading..." : props.title || "New Blog Post"}
  </button>
);
