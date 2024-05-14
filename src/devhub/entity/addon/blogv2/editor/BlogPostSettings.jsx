// TODO issue 599
const { parametersData, onSubmitSettings, onHideSettings } = props;

// Show something lik

return (
  <div className="d-flex gap-1 align-items-end justify-content-end">
    <button className="btn btn-light" onClick={onHideSettings}>
      Cancel
    </button>
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.components.molecule.BlogControl"}
      props={{
        title: "Save Settings",
        onClick: () => onSubmitSettings(),
        testId: "save-settings-button",
      }}
    />
    {/* TODO 599 content + form */}
  </div>
);
