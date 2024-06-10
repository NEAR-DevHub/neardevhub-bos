const { data, handle, communityAddonId, selectedBlog, permissions } = props;

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
    background-color: rgb(4, 164, 110);
  }

  .bg-devhub-green-light {
    background-color: rgba(212, 236, 227, 0.2);
  }

  .text-devhub-green {
    color: rgb(4, 164, 110);
  }

  .text-devhub-gray {
    color: #6c757d;
  }

  .hover\:bg-devhub-green-transparent:hover {
    background-color: rgba(4, 164, 110, 0.8) !important;
  }

  .w-40 {
    width: 10rem;
  }

  .hover-bg-slate-300:hover {
    background-color: rgb(244, 244, 244);
  }
`;

if (permissions.can_configure !== true) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center gap-4"
      style={{ height: 384 }}
    >
      <h5 className="h5 d-inline-flex gap-2 m-0">
        You don't have permission to configure this blog.
      </h5>
    </div>
  );
}

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
            selectedBlog: props.selectedBlog,
          }}
        />
      </Container>
    </Tile>
  </Tailwind>
);
