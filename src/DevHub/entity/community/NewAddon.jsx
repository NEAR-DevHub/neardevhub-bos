const { availableAddons, onSubmit } = props;

const [selectedAddon, setSelectedAddon] = useState(null);

return (
  <>
    {selectedAddon && (
      <Widget
        src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile"}
        props={{
          className: "p-3",
          children: (
            <Widget
              src={"${REPL_DEVHUB}/widget/DevHub.entity.community.ConfigurationSection"}
              props={{
                title: "New " + selectedAddon.title,
                headerRight: (
                  <Widget
                    src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
                    props={{
                      classNames: { root: "btn-sm btn-secondary" },
                      icon: {
                        type: "bootstrap_icon",
                        variant: "bi-x-circle",
                      },
                      label: "Cancel",
                      onClick: () => setSelectedAddon(null),
                    }}
                  />
                ),
                forceEditActive: true,
                hasConfigurePermissions: true,
                Configurator: () => (
                  <Widget
                    src={"${REPL_DEVHUB}/widget/DevHub.entity.community.AddonConfigurator"}
                    props={{
                      addon: selectedAddon,
                      onSubmit,
                    }}
                  />
                ),
              }}
            />
          ),
        }}
      />
    )}
    {availableAddons && (
      <Widget
        src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile"}
        props={{
          className: "p-3",
          children: (
            <>
              <div
                className="d-flex align-items-center justify-content-between w-100 "
                style={{ minHeight: 30 }}
              >
                <h5 className="h5 d-inline-flex gap-2 m-0">
                  <span>Add new addon</span>
                </h5>
              </div>
              <Widget
                src={"${REPL_DEVHUB_CONTRACT}/widget/DIG.InputSelect"} // if mainnet, replace discom.testnet with "near"
                props={{
                  groups: [
                    {
                      items: (availableAddons || []).map((it) => ({
                        label: it.title,
                        value: it.id,
                      })),
                    },
                  ],
                  rootProps: {
                    value: state.selectedAddon.id ?? null,
                    onValueChange: (value) =>
                      setSelectedAddon(
                        (availableAddons || []).find((it) => it.id === value)
                      ),
                  },
                }}
              />
            </>
          ),
        }}
      />
    )}
  </>
);
