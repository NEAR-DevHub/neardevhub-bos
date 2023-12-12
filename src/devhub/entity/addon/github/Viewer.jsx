const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

href || (href = () => {});

const { kanbanBoards, handle, permissions } = props;
// TODO: Convert this viewer to display the provided data via kanbanBoards

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.entity.addon.github.Configurator"
    props={{
      communityHandle: handle, // rather than fetching again via the handle
      link: href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: { page: "community", handle },
      }),
      permissions,
      data: kanbanBoards,
    }}
  />
);
