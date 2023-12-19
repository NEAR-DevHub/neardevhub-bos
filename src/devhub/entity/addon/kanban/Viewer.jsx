const Struct = VM.require("${REPL_DEVHUB}/widget/core.lib.struct");
const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!Struct) {
  return <p>Loading modules...</p>;
}

href || (href = () => {});

const { data, handle, permissions } = props;

if (!data) {
  return <div>Loading...</div>;
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
