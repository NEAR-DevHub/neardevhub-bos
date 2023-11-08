const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

const { kanbanBoards, handle, permissions } = props;
// TODO: Convert this viewer to display the provided data via kanbanBoards

return (
  <Widget
    // TODO: LEGACY.
    src="${REPL_DEVHUB_LEGACY}/widget/gigs-board.entity.workspace.view.github.configurator"
    props={{
      communityHandle: handle, // rather than fetching again via the handle
      link: href({
        // do we need a link?
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: { page: "community", handle },
      }),
      permissions,
      // TODO: REMOVE AFTER MIGRATION.
      nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
      nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB_CONTRACT}",
    }}
  />
);
