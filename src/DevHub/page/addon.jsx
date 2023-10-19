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

const { addon_id, config, view, canConfigure } = props;

const { getAvailableAddons } = VM.require(
  "${REPL_DEVHUB}/widget/DevHub.modules.contract-sdk"
);

if (!getAvailableAddons) {
  return <p>Loading modules...</p>;
}

const availableAddons = getAvailableAddons();
const addon = availableAddons.find((it) => it.id === addon_id);
const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const [showConfigure, setShowConfigure] = useState(
  view === "configure" || false
);

return (
  <Container>
    {/* Need to either isolate the button, or push everything down. I vote isolate the button. */}
    <Header>
      {canConfigure && (
        <Button onClick={() => setShowConfigure(!showConfigure)}>
          <SettingsIcon>
            <span className="bi bi-gear"></span>
          </SettingsIcon>
        </Button>
      )}
    </Header>
    <Content>
      {showConfigure ? (
        <Widget
          src={addon.configurator_widget}
          props={{
            data: config,
            onSubmit: (data) => {
              console.log("data", data);
            },
          }}
        />
      ) : (
        <Widget src={addon.view_widget} props={config} />
      )}
    </Content>
  </Container>
);
