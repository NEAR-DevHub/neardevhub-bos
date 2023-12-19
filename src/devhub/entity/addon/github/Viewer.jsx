const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
const { useQuery } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

useQuery || (useQuery = () => {});

href || (href = () => {});
const { kanbanBoards, handle, permissions } = props;

if (!kanbanBoards) {
  return <div>Loading...</div>;
}

const data = Object.values(kanbanBoards)?.[0];

return (
  <Widget
    src={`${REPL_DEVHUB}/widget/devhub.entity.addon.${data.metadata.type}`}
    props={{
      ...data,
      isConfiguratorActive: false,
      isSynced: true,
      permissions,
    }}
  />
);
