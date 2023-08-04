const ProjectConfigurator = ({ metadata, permissions }) => {
  State.init({
    isConfiguratorActive: false,
  });

  const configuratorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isConfiguratorActive: forcedState ?? !lastKnownState.isConfiguratorActive,
    }));

  return (
    <div className="d-flex justify-content-between gap-3 w-100">
      <div className="d-flex flex-column gap-2">
        <h1 className="m-0">{metadata.name}</h1>
        <p className="m-0">{metadata.description}</p>
      </div>

      <div className="d-flex flex-column gap-3 justify-content-between align-items-end h-100">
        <span
          class="badge bg-primary rounded-4 text-decoration-none"
          style={{ cursor: "default" }}
          title="DevHub tag"
        >
          {metadata.tag}
        </span>

        {permissions.can_configure ? (
          <div className="d-flex gap-3">
            {widget("components.atom.button", {
              classNames: {
                root: [
                  "btn-danger",
                  !state.isConfiguratorActive ? "hidden" : "",
                ].join(" "),
              },

              label: "Cancel",
            })}

            {widget("components.atom.button", {
              classNames: {
                root: state.isConfiguratorActive ? "hidden" : "",
                adornment: "bi bi-gear-fill",
              },

              label: "Configure project",
              onClick: () => configuratorToggle(true),
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

return ProjectConfigurator(props);
