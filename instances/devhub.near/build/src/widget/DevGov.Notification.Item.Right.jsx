const { href } = VM.require("devhub.near/widget/core.lib.url") || (() => {});
return props.post === undefined ? (
  "Loading ..."
) : (
  <>
    <a
      className="btn btn-outline-dark"
      href={href({
        widgetSrc: "devhub.near/widget/app",
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
