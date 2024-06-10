const Struct = VM.require("${REPL_DEVHUB}/widget/core.lib.struct");
const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!Struct) {
  return <p>Loading modules...</p>;
}

href || (href = () => {});

const { data, handle, permissions } = props;

if (!data || !data?.metadata) {
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

return (
  <Widget
    src={`${REPL_DEVHUB}/widget/devhub.entity.addon.${data.metadata.type}`}
    props={{
      ...data,
      isSynced: true,
      permissions,
    }}
  />
);
