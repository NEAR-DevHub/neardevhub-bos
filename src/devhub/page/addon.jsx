const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  z-index: 10;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
`;

const Button = styled.button`
  background-color: #fff;
  display: flex;
  padding: 14px 16px;
  align-items: center;
  gap: 16px;

  border-radius: 4px;
  border: 1px solid #00ec97;
`;

const SettingsIcon = styled.div`
  cursor: pointer;
`;

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

const { addon_id, config, permissions, handle } = props;

const { getAvailableAddons } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAvailableAddons) {
  return <p>Loading modules...</p>;
}

const availableAddons = getAvailableAddons();
const addon = availableAddons.find((it) => it.id === addon_id);

if (!addon) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>Addon with id: "{addon_id}" not found.</h2>
    </CenteredMessage>
  );
}

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const [view, setView] = useState(props.view || "viewer");

const checkFullyRefactored = (addon_id) => {
  switch (addon_id) {
    case "kanban":
    case "github":
    case "blog":
      return false;
    default:
      return true;
  }
};

const isFullyRefactored = checkFullyRefactored(addon_id);

return (
  <Container>
    {isFullyRefactored && ( // Unfully refactored addons have the configurator built in.
      // So we hide the header
      <Header>
        {permissions.can_configure && (
          <Button onClick={() => setView("configure")}>
            <SettingsIcon>
              <span className="bi bi-gear"></span>
            </SettingsIcon>
          </Button>
        )}
      </Header>
    )}
    <Content>
      {view === "configure" ? (
        <Widget
          src={addon.configurator_widget}
          props={{
            data: config,
            onSubmit: (data) => {
              // TODO: Method from new contract to update a specific addon's config
              console.log("data", data);
            },

            handle, // this is temporary prop drilling until kanban and github are migrated
          }}
        />
      ) : (
        <Widget
          src={addon.view_widget}
          props={{
            ...config,
            // temporary prop drilling
            handle,
            permissions,
          }}
        />
      )}
    </Content>
  </Container>
);
