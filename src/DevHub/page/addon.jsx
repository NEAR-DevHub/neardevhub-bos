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

const addons = [
  {
    id: "wiki",
    title: "Wiki",
    description: "Create a wiki for your community",
    view_widget: "devhub.testnet/widget/DevHub.entity.addon.wiki.Viewer",
    configurator_widget:
      "devhub.testnet/widget/DevHub.entity.addon.wiki.Configurator",
  },
  {
    id: "telegram",
    title: "Telegram",
    description: "Connect your telegram",
    view_widget: "devhub.testnet/widget/DevHub.entity.addon.telegram.Viewer",
    configurator_widget:
      "devhub.testnet/widget/DevHub.entity.addon.telegram.Configurator",
  },
  {
    id: "github",
    title: "Github",
    description: "Connect your github",
    view_widget: "devhub.testnet/widget/DevHub.entity.addon.github.Viewer",
    configurator_widget:
      "devhub.testnet/widget/DevHub.entity.addon.github.Configurator",
  },
  {
    id: "kanban",
    title: "Kanban",
    description: "Connect your github kanban board",
    view_widget: "devhub.testnet/widget/DevHub.entity.addon.kanban.Viewer",
    configurator_widget:
      "devhub.testnet/widget/DevHub.entity.addon.kanban.Configurator",
  },
  {
    id: "blog",
    title: "Blog",
    description: "Create a blog for your community",
    view_widget: "devhub.testnet/widget/DevHub.entity.addon.blog.Viewer",
    configurator_widget:
      "devhub.testnet/widget/DevHub.entity.addon.blog.Configurator",
  },
];

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const [selectedAddon, setSelectedAddon] = useState(null);

const handleAddonClick = (addon) => {
  setSelectedAddon(addon);
};

// const [view, setView] = useState(props.view || "viewer");

// const addon = {
//   id: "wiki", // this could be determined by the Type
//   title: "Wiki",
//   description: "Add a wiki to your community.",
//   icon: "bi bi-book",
//   widgets: {
//     viewer: "${REPL_DEVHUB}/widget/DevHub.entity.addon.wiki.Viewer",
//     configurator: "${REPL_DEVHUB}/widget/DevHub.entity.addon.wiki.Configurator",
//   },
// };

const [showConfigure, setShowConfigure] = useState(false);

const parameters = (config.parameters && JSON.parse(config.parameters)) || {};

console.log(config.parameters);
const [tempParameters, setTempParameters] = useState(parameters); // this is just for demonstrative purposes

return (
  <Container>
    {/* Need to check permissions */}
    <Header>
      <ButtonRow>
        {addons.map((addon) => (
          <Button
            key={addon.id}
            isSelected={selectedAddon === addon}
            onClick={() => handleAddonClick(addon)}
          >
            {addon.title}
          </Button>
        ))}
      </ButtonRow>
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
            src={selectedAddon.configurator_widget}
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
          <Widget src={selectedAddon.view_widget} props={tempParameters} />
        </div>
      )}
    </Content>
  </Container>
);
