const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

const { metadata, payload, handle, permissions } = props;
// TODO: Convert this viewer to display the provided data via metadata, payload

const CommunityBoardPage = ({ handle, permissions }) => {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.entity.addon.kanban.Configurator"
      props={{
        communityHandle: handle, // rather than fetching again via the handle
        link: href({
          widgetSrc: "${REPL_DEVHUB}/widget/app",
          params: { page: "community", handle },
        }),
        permissions,
      }}
    />
  );
};

return CommunityBoardPage(props);
