const { href } =
  VM.require("${alias_REPL_DEVHUB}/widget/core.lib.url") || (() => {});

return props.proposal === undefined ? (
  "Loading ..."
) : (
  <>
    <a
      className="btn btn-outline-dark"
      href={href({
        widgetSrc: "${alias_REPL_DEVHUB}/widget/app",
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
