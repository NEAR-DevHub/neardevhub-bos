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
} = props;

const handleUpdateCommunityAddonConfig = (v) => console.log(v);

{/* <Widget
src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Button`}
props={{
  classNames: { root: "btn-sm btn-secondary" },
  icon: {
    kind: "bootstrap-icon",
    variant: state.isEditActive ? "bi-x-circle" : "bi-pen-fill",
  },
  label: state.isEditActive ? "Cancel" : "Edit",
  onClick: () => setEditActive(!isEditActive),
  nearDevGovGigsWidgetsAccountId,
}}
/> */}

function CommunityAddonConfigurator({ addonConfig }) {
  const match = availableAddons.find((it) => it.id === addonConfig.addon_id);
  if (match) {
    return (
      <Widget
        src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.Tile`}
        props={{
          children: (
            <>
              <div
                className="d-flex align-items-center justify-content-between w-100"
                style={{ minHeight: 30 }}
              >
                <h5 className="h5 d-inline-flex gap-2 m-0">
                  <span>{addonConfig.name}</span>
                </h5>
              </div>
              {/* TODO: We want an edit button. This should be moved to it's own stateful widget. "ConfigurationSection"? */}
              <Widget
                src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.community.AddonConfigurator`}
                props={{
                  addon: match,
                  data: addonConfig,
                  onSubmit: (value) => handleUpdateCommunityAddonConfig(value),
                  nearDevGovGigsWidgetsAccountId,
                }}
              />
            </>
          ),
        }}
      />
    );
  } else {
    return widget("components.molecule.tile", {
      children: "Unknown addon with addon ID: " + addon.id,
    });
  }
}

return (
  <div
    className="d-flex flex-column align-items-center gap-4 w-100"
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
              link: `/${nearDevGovGigsWidgetsAccountId}/widget/DevHub.App?page=community&handle=${handle}`
            }}
          />
        ),
      }}
    />
    {(communityAddonConfigs || []).map((addonConfig) => (
      <CommunityAddonConfigurator addonConfig={addonConfig} />
    ))}
  </div>
);

{
  /*           

          {widget("components.organism.configurator", {
            heading: "Community information",
            externalState: state.communityData,
            fullWidth: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: sectionSubmit,
            schema: CommunityInformationSchema,
            submitLabel: "Accept",
          })}

          {widget("components.organism.configurator", {
            heading: "About",
            externalState: state.communityData,
            fullWidth: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: sectionSubmit,
            schema: CommunityAboutSchema,
            submitLabel: "Accept",
          })}

          {widget("components.organism.configurator", {
            heading: "Access control",
            externalState: state.communityData,
            fullWidth: true,
            formatter: communityAccessControlFormatter,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: sectionSubmit,
            schema: CommunityAccessControlSchema,
            submitLabel: "Accept",
          })}

          {widget("components.organism.configurator", {
            heading: "Wiki page 1",
            externalState: state.communityData?.wiki1,
            fullWidth: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: (value) => sectionSubmit({ wiki1: value }),
            submitLabel: "Accept",
            schema: CommunityWikiPageSchema,
          })}

          {widget("components.organism.configurator", {
            heading: "Wiki page 2",
            externalState: state.communityData?.wiki2,
            fullWidth: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: (value) => sectionSubmit({ wiki2: value }),
            submitLabel: "Accept",
            schema: CommunityWikiPageSchema,
          })} */
}
{
  /* 
          {permissions.can_delete ? (
            <div
              className="d-flex justify-content-center gap-4 p-4 w-100"
              style={{ maxWidth: 896 }}
            >
              {widget("components.molecule.button", {
                classNames: { root: "btn-lg btn-outline-danger border-none" },
                label: "Delete community",
                onClick: onDelete,
              })}
            </div>
          ) : null}

          {permissions.can_configure && state.hasUnsavedChanges && (
            <div
              className="position-fixed end-0 bottom-0 bg-transparent pe-4 pb-4"
              style={{ borderTopLeftRadius: "100%" }}
            >
              {widget("components.molecule.button", {
                classNames: { root: "btn-lg btn-success" },
                icon: { type: "svg_icon", variant: "floppy_drive" },
                label: "Save",
                onClick: changesSave,
              })}
            </div>
          )} */
}
