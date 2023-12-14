const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

return props.post === undefined ? (
  "Loading ..."
) : (
  <>
    <a
      className="btn btn-outline-dark"
      href={href({
        widgetSrc: "${REPL_DEVHUB}/widget/dh.post",
        params: {
          id: props.post,
        },
      })}
    >
      View DevHub post
    </a>
  </>
);
