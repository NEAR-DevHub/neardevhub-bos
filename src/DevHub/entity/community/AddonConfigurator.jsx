const { addon, config, onSubmit, nearDevGovGigsWidgetsAccountId } = props;

const [name, setName] = useState(config.name || "");
const [enabled, setEnabled] = useState(config.enabled || true);

function handleOnSubmit(v) {
  onSubmit({
    ...config,
    name,
    enabled,
    parameters: JSON.stringify(v),
  });
}

return (
  <div>
    {/* TODO: Replace with Input from library */}
    <input
      className="form-control border border-2"
      type="text"
      placeholder="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.atom.Toggle`}
      props={{
        label: "Enabled",
        value: enabled,
        onChange: setEnabled,
      }}
    />
    <Widget
      src={addon.configurator}
      props={{
        data: JSON.parse(config.parameters),
        onSubmit: handleOnSubmit,
        nearDevGovGigsWidgetsAccountId,
      }}
    />
  </div>
);
