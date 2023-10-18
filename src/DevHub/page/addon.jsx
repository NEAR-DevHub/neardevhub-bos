const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const { addon_id, config } = props;



const [view, setView] = useState(props.view || "viewer");

const addon = {
  id: "wiki", // this could be determined by the Type
  title: "Wiki",
  description: "Add a wiki to your community.",
  icon: "bi bi-book",
  widgets: {
    viewer: "${REPL_DEVHUB}/widget/DevHub.entity.addon.wiki.Viewer",
    configurator: "${REPL_DEVHUB}/widget/DevHub.entity.addon.wiki.Configurator",
  },
};


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

const SettingsIcon = styled.div`
  cursor: pointer;
`;

const [showConfigure, setShowConfigure] = useState(false);

const parameters = (config.parameters && JSON.parse(config.parameters)) || {};

const [tempParameters, setTempParameters] = useState(parameters); // this is just for demonstrative purposes

return (
  <Container>
    <Header>
      <h1>Addon: {addon.title}</h1>
      <SettingsIcon onClick={() => setShowConfigure(!showConfigure)}>
        <span className="bi bi-gear"></span>
      </SettingsIcon>
    </Header>
    <Content>
      {showConfigure ? (
        <div>
          <h2>Settings Configuration</h2>
          {/* This may want to point to a new configuration "page", this can have it's own provider */}
          <Widget
            src={addon.widgets.configurator}
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
          <Widget src={addon.widgets.viewer} props={tempParameters} />
        </div>
      )}
    </Content>
  </Container>
);
