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

  @media screen and (max-width: 768px) {
    padding: 20px 5px;
  }
`;

const css = fetch("https://floatui.com/tailwind.css").body;
if (!css) return "";
const Tailwind = styled.div`
  ${css}

  .bg-devhub-green {
    background-color: #00ec97;
  }

  .bg-devhub-green-light {
    background-color: rgba(212, 236, 227, 0.1);
  }

  .bg-devhub-green-dark {
    background-color: #04a46e;
  }

  .text-devhub-green {
    color: #00ec97;
  }

  .text-devhub-green-dark {
    color: #04a46e;
  }

  .text-devhub-green-light {
    color: rgba(212, 236, 227);
  }
`;

return (
  <Tailwind>
    <Tile className="p-3 bg-white min-vh-100">
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
  </Tailwind>
);
