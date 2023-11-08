const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

const { metadata, payload, handle, permissions } = props;
// TODO: Convert this viewer to display the provided data via metadata, payload

const CommunityBoardPage = ({ handle, permissions }) => {
  return (
    <Widget
      // TODO: LEGACY.
      src="${REPL_DEVHUB_LEGACY}/widget/gigs-board.entity.workspace.view.kanban.configurator"
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
};

return CommunityBoardPage(props);
