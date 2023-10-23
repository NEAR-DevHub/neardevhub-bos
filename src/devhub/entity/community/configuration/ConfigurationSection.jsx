const {
  title,
  hasConfigurePermissions,
  Configurator,
  Preview,
  headerRight,
  forceEditActive,
} = props;

const [isEditActive, setEditActive] = useState(forceEditActive || false);

function SectionHeader() {
  return (
    <div
      className="d-flex align-items-center justify-content-between w-100 pb-3"
      style={{ minHeight: 30 }}
    >
      <h5 className="h5 d-inline-flex gap-2 m-0">
        <span>{title}</span>
      </h5>
      {headerRight ||
        (hasConfigurePermissions && (
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
            props={{
              classNames: { root: "btn-sm btn-secondary" },
              icon: {
                type: "bootstrap_icon",
                variant: isEditActive ? "bi-x-circle" : "bi-pen-fill",
              },
              label: isEditActive ? "Cancel" : "Edit",
              onClick: () => setEditActive(!isEditActive),
            }}
          />
        ))}
    </div>
  );
}

return (
  <div>
    <SectionHeader />
    <Configurator
      isActive={isEditActive}
      setIsActive={setEditActive}
      onCancel={() => setEditActive(!isEditActive)}
    />
  </div>
);
