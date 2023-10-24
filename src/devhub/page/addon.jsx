const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
`;

const SettingsButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;

  background-color: #fff;
  display: flex;
  padding: 14px 16px;
  align-items: center;
  gap: 16px;
  width: 50px;
  height: 50px;

  border-radius: 4px;
  border: 1px solid #00ec97;

  z-index: 10;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

const { addon, permissions, handle } = props;

const { getAvailableAddons, setCommunityAddon } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAvailableAddons || !setCommunityAddon) {
  return <p>Loading modules...</p>;
}

const availableAddons = getAvailableAddons();
const addonMatch = availableAddons.find((it) => it.id === addon.addon_id);

if (!addonMatch) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>Addon with id: "{addon.addon_id}" not found.</h2>
    </CenteredMessage>
  );
}

const config = JSON.parse(addon.parameters || "null");

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const [view, setView] = useState(props.view || "viewer");

const checkFullyRefactored = (addon_id) => {
  switch (addon_id) {
    case "kanban":
    case "github":
      return false;
    default:
      return true;
  }
};

const isFullyRefactored = checkFullyRefactored(addon.addon_id);

return (
  <Container>
    {isFullyRefactored && // Unfully refactored addons have the configurator built in.
      // So we hide the header
      permissions.can_configure && (
        <SettingsButton
          onClick={() => setView(view === "configure" ? "view" : "configure")}
        >
          {view === "configure" ? (
            <span className="bi bi-x"></span>
          ) : (
            <span className="bi bi-gear"></span>
          )}
        </SettingsButton>
      )}
    <Content>
      {/* We hide in order to prevent a reload when we switch between two views */}
      <div className={`${view !== "configure" ? "d-none" : ""}`}>
        <Widget
          src={addonMatch.configurator_widget}
          props={{
            data: config,
            onSubmit: (data) => {
              console.log("onSubmit", {
                handle,
                addon: {
                  ...config,
                  params: JSON.stringify(data),
                },
              });
              setCommunityAddon({
                handle,
                addon: {
                  ...addon,
                  parameters: JSON.stringify(data),
                },
              });
            },

            handle, // this is temporary prop drilling until kanban and github are migrated
            permissions,
          }}
        />
      </div>
      <div className={`${view === "configure" ? "d-none" : ""}`}>
        <Widget
          src={addonMatch.view_widget}
          props={{
            ...config,
            // temporary prop drilling
            handle,
            permissions,
          }}
        />
      </div>
    </Content>
  </Container>
);
