const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px;
`;

const Content = styled.div`
  flex: 1;
  background-color: #f0f0f0;
  padding: 20px;
  overflow: auto;
`;

const Button = styled.button`
  background: ${({ isSelected }) =>
    isSelected ? "blue" : "rgba(129, 129, 129, 0)"};
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

const { addon_id, config } = props;

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

const [showConfigure, setShowConfigure] = useState(false);

const parameters = (config.parameters && JSON.parse(config.parameters)) || {};

const [tempParameters, setTempParameters] = useState(parameters); // this is just for demonstrative purposes

return (
  <Container>
    {/* Need to check permissions */}
    <Header>
      <Button>
        <SettingsIcon onClick={() => setShowConfigure(!showConfigure)}>
          <span className="bi bi-gear"></span>
        </SettingsIcon>
      </Button>
    </Header>
    <Content>
      {showConfigure ? (
        <div>
          <h2>Settings Configuration</h2>
          {/* This may want to point to a new configuration "page", this can have it's own provider */}
          <Widget
            src={addon.configurator_widget}
            props={{
              data: parameters,
              onSubmit: (data) => {
                console.log("data", data);
                setTempParameters(data);
              },
            }}
          />
        </div>
      ) : (
        <div>
          <h2>View Content</h2>
          <Widget src={addon.view_widget} props={tempParameters} />
        </div>
      )}
    </Content>
  </Container>
);
