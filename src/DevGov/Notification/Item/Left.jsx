const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

if (!props.type) {
  return "Loading ...";
}

const type = props.type.split("/")[1];
return props.type ? (
  <>
    {type == "like"
      ? "liked your"
      : type == "reply"
      ? "replied to your"
      : type == "edit"
      ? "edited your"
      : type == "mention"
      ? "mentioned you in their"
      : "???"}{" "}
    <a
      className="fw-bold text-muted"
      href={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: {
          page: "post",
          id: props.post,
        },
      })}
    >
      DevHub post
    </a>
  </>
) : (
  "Loading ..."
);
