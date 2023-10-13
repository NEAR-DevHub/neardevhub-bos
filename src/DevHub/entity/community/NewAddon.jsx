const { availableAddons, nearDevGovGigsWidgetsAccountId, onSubmit } = props;

const [selectedAddon, setSelectedAddon] = useState(null);

return (
  <>
    {selectedAddon && (
      <Widget
        src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Tile`}
        props={{
          className: "p-3",
          children: (
            <Widget
              src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.ConfigurationSection`}
              props={{
                title: "New " + selectedAddon.title,
                headerRight: (
                  <Widget
                    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Button`}
                    props={{
                      classNames: { root: "btn-sm btn-secondary" },
                      icon: {
                        type: "bootstrap_icon",
                        variant: "bi-x-circle",
                      },
                      label: "Cancel",
                      onClick: () => setSelectedAddon(null),
                      nearDevGovGigsWidgetsAccountId,
                    }}
                  />
                ),
                forceEditActive: true,
                hasConfigurePermissions: true,
                nearDevGovGigsWidgetsAccountId,
                Configurator: () => (
                  <Widget
                    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.AddonConfigurator`}
                    props={{
                      addon: selectedAddon,
                      onSubmit,
                      nearDevGovGigsWidgetsAccountId,
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
        src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Tile`}
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
                src={`${
                  context.networkId === "mainnet" ? "near" : "discom.testnet"
                }/widget/DIG.InputSelect`} // if mainnet, replace discom.testnet with "near"
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
