const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  padding: 0 1rem;

  @media screen and (max-width: 960px) {
    padding: 0 1rem;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
`;

const SettingsButton = styled.button`
  position: absolute;
  top: -100px;
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

const { addon, permissions, handle, addonView, setAddonView } = props;

const { getAllAddons, setCommunityAddon } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAllAddons || !setCommunityAddon) {
  return <p>Loading modules...</p>;
}

const availableAddons = getAllAddons();

let addonMatch = null; // If availableAddons is not an array, set addonMatch to null
if (
  Array.isArray(availableAddons) &&
  availableAddons !== null &&
  availableAddons !== undefined
) {
  addonMatch = availableAddons.find((it) => it.id === addon.addon_id);
}

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

if ("${REPL_DEVHUB}" !== "devhub.near") {
  addonMatch.configurator_widget = addonMatch.configurator_widget.replace(
    "devhub.near/",
    "${REPL_DEVHUB}/"
  );
  addonMatch.view_widget = addonMatch.view_widget.replace(
    "devhub.near/",
    "${REPL_DEVHUB}/"
  );
}

return (
  <Container>
    {permissions.can_configure && addonMatch.configurator_widget !== "" && (
      <SettingsButton
        onClick={() =>
          setAddonView(addonView === "configure" ? "viewer" : "configure")
        }
        aria-label={
          addonView === "configure"
            ? "Close configuration"
            : "Open configuration"
        }
      >
        {addonView === "configure" ? (
          <span
            className="bi bi-x"
            data-testid="configure-addon-button-x"
          ></span>
        ) : (
          <span
            className="bi bi-gear"
            data-testid="configure-addon-button"
          ></span>
        )}
      </SettingsButton>
    )}
    <Content>
      {addonView === "configure" ? (
        <Widget
          src={addonMatch.configurator_widget}
          props={{
            ...config,
            data: config,
            onSubmit: (data) => {
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
            communityAddonId: addon.id,
          }}
        />
      ) : (
        <Widget
          src={addonMatch.view_widget}
          props={{
            ...config,
            data: config,
            handle,
            permissions,
            transactionHashes: props.transactionHashes,
            communityAddonId: addon.id,
            setAddonView,
          }}
        />
      )}
    </Content>
  </Container>
);
