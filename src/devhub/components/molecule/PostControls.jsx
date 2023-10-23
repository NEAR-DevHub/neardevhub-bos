const { className, title, icon, href, onClick } = props;

const buttonStyle = {
  backgroundColor: "#0C7283",
  color: "#f3f3f3",
};

return (
  <div className={`d-flex flex-row-reverse ${props.className}`}>
    {props.href ? (
      <a className="btn btn-light" style={buttonStyle} href={props.href}>
        <i
          className={props.icon ? props.icon : "bi bi-plus-circle-fill"}
        ></i>
        {props.title}
      </a>
    ) : (
      <button className="btn btn-light" style={buttonStyle} onClick={props.onClick}>
        <i
          className={props.icon ? props.icon : "bi bi-plus-circle-fill"}
        ></i>
        {props.title || "Post"}
      </button>
    )}
  </div>
);
