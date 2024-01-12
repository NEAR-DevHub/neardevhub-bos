const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

return (
  <Link
    to={href({
      widgetSrc: "${REPL_DEVHUB}/widget/app",
      params: {
        page: "proposal.index",
      },
    })}
  >
    Create proposal, go to View
  </Link>
);
