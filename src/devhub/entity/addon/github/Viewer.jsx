const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
const { useQuery } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

useQuery || (useQuery = () => {});

href || (href = () => {});
const { kanbanBoards, handle, permissions } = props;

if (!kanbanBoards) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center gap-4"
      style={{ height: 384 }}
    >
      <h5 className="h5 d-inline-flex gap-2 m-0">
        Please add configuration for your board.
      </h5>
    </div>
  );
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
