const Breadcrumbs = ({ path }) =>
  (path ?? null) === null ? (
    <></>
  ) : (
    <div
      aria-label="breadcrumb"
      className="px-4 text-white"
      style={{ backgroundColor: "#181818" }}
    >
      <ol className="breadcrumb">
        {(path ?? []).map(({ label, link }) => {
          <li className="breadcrumb-item active" aria-current="page">
            <a href={link}>{label}</a>
          </li>;
        })}
      </ol>
    </div>
  );

return Breadcrumbs(props);
