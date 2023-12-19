const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

if (!props.type) {
  return "Loading ...";
}

/**
 *  props.post_type = "comment" | "idea" | "solution" | "attestation" | "sponsorship" | "blog"
 */
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
      : props.post_type}
    <a
      className="fw-bold text-muted"
      href={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: {
          page: props.post_type == "blog" ? "blog" : "post",
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
