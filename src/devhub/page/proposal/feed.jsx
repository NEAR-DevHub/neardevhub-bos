const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

return (
  <Link
    to={href({
      widgetSrc: "${REPL_DEVHUB}/widget/app",
      params: {
        page: "proposal.create",
      },
    })}
  >
    Feed, go to Create proposal
  </Link>
);
