const { href } = VM.require("${REPL_EVENTS}/widget/core.lib.url") || (() => {});

return props.post === undefined ? (
  "Loading ..."
) : (
  <>
    <a
      className="btn btn-outline-dark"
      href={href({
        widgetSrc: "${REPL_EVENTS}/widget/app",
        params: {
          page: "post",
          id: props.post,
        },
      })}
    >
      View DevHub post
    </a>
  </>
);
