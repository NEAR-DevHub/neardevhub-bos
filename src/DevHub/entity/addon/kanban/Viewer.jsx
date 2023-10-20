const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

const CommunityBoardPage = ({ handle, permissions }) => {

  return (
    <Widget
      src="${REPL_DEVHUB}/widget/gigs-board.entity.workspace.view.kanban.configurator"
      props={{
        communityHandle: handle,
        link: href({ gateway: "near.org", "${REPL_DEVHUB}/widget/app", params: { handle } }),
        permissions,
        nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
        nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB_CONTRACT}",
      }}
    />
  );
};

return CommunityBoardPage(props);