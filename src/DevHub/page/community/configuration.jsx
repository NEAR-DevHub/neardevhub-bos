const {
  permissions,
  handle,
  community,
  setCommunityAddons,
  deleteCommunity,
  updateCommunity,

} = props;

const [communityData, setCommunityData] = useState(community);
const [selectedAddon, setSelectedAddon] = useState(null);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

const sectionSubmit = (sectionData) => {
  console.log(sectionData);
  const updatedCommunityData = {
    ...Object.entries(sectionData).reduce(
      (update, [propertyKey, propertyValue]) => ({
        ...update,

        [propertyKey]:
          typeof propertyValue !== "string" || (propertyValue?.length ?? 0) > 0
            ? propertyValue ?? null
            : null,
      }),

      communityData
    ),
  };
  setCommunityData(updatedCommunityData);
  setHasUnsavedChanges(true);
};

const hasConfigurePermissions = true;
// permissions.can_configure
const hasDeletePermissions = true;
// permissions.can_delete

function CommunityAddonConfigurator({ addonConfig }) {
  // TODO: Simplify this. Tile should be module.
  const match = availableAddons.find((it) => it.id === addonConfig.addon_id);
  return (
    <Widget
      src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile"}
      props={{
        className: "p-3",
        children: (
          <Widget
            src={
              "${REPL_DEVHUB}/widget/DevHub.entity.community.ConfigurationSection"
            }
            props={{
              title: addonConfig.name,
              hasConfigurePermissions: hasConfigurePermissions,
              Configurator: () =>
                match ? (
                  <Widget
                    src={
                      "${REPL_DEVHUB}/widget/DevHub.entity.community.AddonConfigurator"
                    }
                    props={{
                      addon: match,
                      data: addonConfig,
                      onSubmit: (v) => console.log(v),
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

return (
  <div
    className="d-flex flex-column align-items-center gap-4 w-100 p-4"
    style={{ maxWidth: 960 }}
  >
    <Widget
      src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile"}
      props={{
        children: (
          <Widget
            src={
              "${REPL_DEVHUB}/widget/DevHub.entity.community.BrandingConfigurator"
            }
            props={{
              onSubmit: sectionSubmit,
              data: communityData,
              hasConfigurePermissions,
              link: "${REPL_DEVHUB}/widget/DevHub.App?page=community&handle=${handle}",
            }}
          />
        ),
      }}
    />
    <Widget
      src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile"}
      props={{
        className: "p-3",
        children: (
          <Widget
            src={
              "${REPL_DEVHUB}/widget/DevHub.entity.community.ConfigurationSection"
            }
            props={{
              title: "Community Information",
              hasConfigurePermissions,
              Configurator: (p) => (
                <Widget
                  src={
                    "${REPL_DEVHUB}/widget/DevHub.entity.community.InformationConfigurator"
                  }
                  props={{
                    data: communityData,
                    onSubmit: sectionSubmit,
                    ...p,
                  }}
                />
              ),
            }}
          />
        ),
      }}
    />
    <Widget
      src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile"}
      props={{
        className: "p-3",
        children: (
          <Widget
            src={
              "${REPL_DEVHUB}/widget/DevHub.entity.community.ConfigurationSection"
            }
            props={{
              title: "About",
              hasConfigurePermissions,
              Configurator: (p) => (
                <Widget
                  src={
                    "${REPL_DEVHUB}/widget/DevHub.entity.community.AboutConfigurator"
                  }
                  props={{
                    data: communityData,
                    onSubmit: sectionSubmit,
                    ...p,
                  }}
                />
              ),
            }}
          />
        ),
      }}
    />
    <Widget
      src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile"}
      props={{
        className: "p-3",
        children: (
          <Widget
            src={
              "${REPL_DEVHUB}/widget/DevHub.entity.community.ConfigurationSection"
            }
            props={{
              title: "Access Control",
              hasConfigurePermissions,
              Configurator: (p) => (
                <Widget
                  src={
                    "${REPL_DEVHUB}/widget/DevHub.entity.community.AccessControlConfigurator"
                  }
                  props={{
                    data: communityData,
                    onSubmit: sectionSubmit,
                    ...p,
                  }}
                />
              ),
            }}
          />
        ),
      }}
    />
    <Widget
      src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile"}
      props={{
        className: "p-3",
        children: (
          <Widget
            src={"${REPL_DEVHUB}/widget/DevHub.entity.community.Addons"}
            props={{
              data: communityData.addons || [],
              onSubmit: (v) => setCommunityAddons({ handle, addons: v }),
            }}
          />
        ),
      }}
    />
    {/*
     {(communityAddonConfigs || []).map((addonConfig) => (
    //   <CommunityAddonConfigurator addonConfig={addonConfig} />
    // ))}
    {/* {hasConfigurePermissions && (
      <Widget
        src={"${REPL_DEVHUB}/widget/DevHub.entity.community.NewAddon`}
        props={{
          availableAddons,
          onSubmit: handleCreateAddon,
          nearDevGovGigsWidgetsAccountId,
        }}
      />
    )} */}
    {hasDeletePermissions && (
      <div
        className="d-flex justify-content-center gap-4 p-4 w-100"
        style={{ maxWidth: 896 }}
      >
        <Widget
          src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-lg btn-outline-danger border-none" },
            label: "Delete community",
            onClick: () => deleteCommunity({ handle }),
          }}
        />
      </div>
    )}
    {hasConfigurePermissions && hasUnsavedChanges && (
      <div
        className="position-fixed end-0 bottom-0 bg-transparent pe-4 pb-4"
        style={{ borderTopLeftRadius: "100%" }}
      >
        <Widget
          src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-lg btn-success" },
            icon: { type: "svg_icon", variant: "floppy_drive" },
            label: "Save",
            onClick: () =>
              updateCommunity({ handle, community: communityData }), // TODO : Track changes in State
          }}
        />
      </div>
    )}
  </div>
);
