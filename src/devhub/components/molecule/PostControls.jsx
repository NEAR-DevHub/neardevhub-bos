const { className, title, icon, href, onClick } = props;

const buttonStyle = {
  backgroundColor: "#0C7283",
  color: "#f3f3f3",
};

return (
  <div class="d-flex flex-row-reverse" className={props.className}>
    {props.href ? (
      <a class="btn btn-light" style={buttonStyle} href={props.href}>
        <i
          class="bi"
          className={props.icon ? props.icon : "bi-plus-circle-fill"}
        ></i>
        {props.title}
      </a>
    ) : (
      <button class="btn btn-light" style={buttonStyle} onClick={props.onClick}>
        <i
          class="bi"
          className={props.icon ? props.icon : "bi-plus-circle-fill"}
        ></i>
        {props.title || "Post"}
      </button>
    )}
  </div>
);
