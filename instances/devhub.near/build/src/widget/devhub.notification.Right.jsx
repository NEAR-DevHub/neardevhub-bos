const { href } = VM.require("devhub.near/widget/core.lib.url") || (() => {});
return props.proposal === undefined ? (
  "Loading ..."
) : (
  <>
    <a
      className="btn btn-outline-dark"
      href={href({
        widgetSrc: "devhub.near/widget/app",
        params: {
          page: "proposal",
          id: props.proposal,
        },
      })}
    >
      View DevHub proposal
    </a>
  </>
);
