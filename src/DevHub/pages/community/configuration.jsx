// Pulls community data
// Cycles through the addons
// Creates a tile
// Supplies the onSubmit and data

const {
  nearDevGovGigsWidgetsAccountId,
  permissions,
  handle,
  community,
  communityAddonConfigs,
  availableAddons,
  deleteCommunity,
  updateCommunity,
} = props;

const handleUpdateCommunityAddonConfig = (v) => console.log(v);
const [selectedAddon, setSelectedAddon] = useState(null);

function CommunityAddonConfigurator({ addonConfig }) {
  // TODO: Simplify this. Tile should be module.
  const match = availableAddons.find((it) => it.id === addonConfig.addon_id);
  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Tile`}
      props={{
        className: "p-3",
        children: (
          <Widget
            src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.ConfigurationSection`}
            props={{
              title: addonConfig.name,
              hasConfigurePermissions: permissions.can_configure,
              nearDevGovGigsWidgetsAccountId,
              Configurator: () =>
                match ? (
                  <Widget
                    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.AddonConfigurator`}
                    props={{
                      addon: match,
                      data: addonConfig,
                      onSubmit: (value) =>
                        handleUpdateCommunityAddonConfig(value),
                      nearDevGovGigsWidgetsAccountId,
                    }}
                  />
                ) : (
                  <p>{"Unknown addon with addon ID: " + addon.id}</p>
                ),
            }}
          />
        ),
      }}
    />
  );
}

function handleCreateAddon(addonId, value) {
  console.log(value);
  // const uuid = UUID.generate("xxxxxxx");
  // addCommunityAddon({
  //   handle,
  //   config: {
  //     name: "Wiki",
  //     config_id: uuid,
  //     addon_id: addonId,
  //     parameters: JSON.stringify(value),
  //     enabled: true,
  //   },
  // });
}

return (
  <div
    className="d-flex flex-column align-items-center gap-4 w-100 p-4"
    style={{ maxWidth: 960 }}
  >
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Tile`}
      props={{
        children: (
          <Widget
            src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.BrandingConfigurator`}
            props={{
              onSubmit: (v) => console.log(v),
              data: community,
              hasConfigurePermissions: permissions.can_configure,
              link: `/${nearDevGovGigsWidgetsAccountId}/widget/DevHub.App?page=community&handle=${handle}`,
            }}
          />
        ),
      }}
    />
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Tile`}
      props={{
        className: "p-3",
        children: (
          <Widget
            src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.ConfigurationSection`}
            props={{
              title: "Community Information",
              hasConfigurePermissions: permissions.can_configure,
              nearDevGovGigsWidgetsAccountId,
              Configurator: () => (
                <Widget
                  src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.InformationConfigurator`}
                  props={{
                    data: community,
                    onSubmit: (v) => console.log(v),
                    nearDevGovGigsWidgetsAccountId,
                  }}
                />
              ),
            }}
          />
        ),
      }}
    />
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Tile`}
      props={{
        className: "p-3",
        children: (
          <Widget
            src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.ConfigurationSection`}
            props={{
              title: "About",
              hasConfigurePermissions: permissions.can_configure,
              nearDevGovGigsWidgetsAccountId,
              Configurator: () => (
                <Widget
                  src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.AboutConfigurator`}
                  props={{
                    data: community,
                    onSubmit: (v) => console.log(v),
                    nearDevGovGigsWidgetsAccountId,
                  }}
                />
              ),
            }}
          />
        ),
      }}
    />
    {(communityAddonConfigs || []).map((addonConfig) => (
      <CommunityAddonConfigurator addonConfig={addonConfig} />
    ))}
    {permissions.can_configure && (
      <Widget
        src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.NewAddon`}
        props={{
          availableAddons,
          onSubmit: handleCreateAddon,
          nearDevGovGigsWidgetsAccountId,
        }}
      />
    )}
    {permissions.can_delete && (
      <div
        className="d-flex justify-content-center gap-4 p-4 w-100"
        style={{ maxWidth: 896 }}
      >
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Button`}
          props={{
            classNames: { root: "btn-lg btn-outline-danger border-none" },
            label: "Delete community",
            onClick: () => deleteCommunity({ handle }),
          }}
        />
      </div>
    )}
    {permissions.can_configure && ( // TODO: Check if community has changed
      <div
        className="position-fixed end-0 bottom-0 bg-transparent pe-4 pb-4"
        style={{ borderTopLeftRadius: "100%" }}
      >
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Button`}
          props={{
            classNames: { root: "btn-lg btn-success" },
            icon: { type: "svg_icon", variant: "floppy_drive" },
            label: "Save",
            onClick: () => updateCommunity({ handle, community }), // TODO : Track changes in State
            nearDevGovGigsWidgetsAccountId,
          }}
        />
      </div>
    )}
  </div>
);
