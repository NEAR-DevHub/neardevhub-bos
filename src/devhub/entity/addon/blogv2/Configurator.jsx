const { data, handle, communityAddonId } = props;

const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

if (!Tile) {
  return <div>Loading...</div>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;

  @media screen and (max-width: 768px) {
    padding: 20px 5px;
  }
`;

return (
  <Tile className="p-3 bg-white">
    <Container>
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.editor.index"}
        props={{
          data,
          handle,
          communityAddonId,
        }}
      />
    </Container>
  </Tile>
);
