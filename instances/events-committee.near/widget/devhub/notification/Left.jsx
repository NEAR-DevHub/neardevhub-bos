const { href } = VM.require("${REPL_EVENTS}/widget/core.lib.url") || (() => {});

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
      : type}
    <a
      className="fw-bold text-muted"
      href={href({
        widgetSrc: "${REPL_EVENTS}/widget/app",
        params: {
          page: "proposal",
          id: props.proposal,
        },
      })}
    >
      DevHub proposal
    </a>
  </>
) : (
  "Loading ..."
);
