const EmbeddCSS = `
  .CodeMirror {
   margin-inline:10px;
   border-radius:5px;
  }

  .editor-toolbar {
    border: none !important;
  }
`;

const Wrapper = styled.div`
  .nav-link {
    color: inherit !important;
  }

  .card-header {
    padding-bottom: 0px !important;
  }
`;

const Compose = ({
  data,
  onChange,
  autocompleteEnabled,
  placeholder,
  height,
  embeddCSS,
  showProposalIdAutoComplete,
}) => {
  State.init({
    data: data,
    selectedTab: "editor",
  });

  useEffect(() => {
    onChange(state.data);
  }, [state.data]);

  useEffect(() => {
    if (data !== state.data) {
      State.update({ data: data, handler: "autocompleteSelected" });
    }
  }, [data]);

  return (
    <Wrapper>
      <div className="card">
        <div className="card-header" style={{ position: "relative" }}>
          <div>
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <button
                  class={`nav-link ${
                    state.selectedTab === "editor" ? "active" : ""
                  }`}
                  onClick={() => State.update({ selectedTab: "editor" })}
                >
                  Write
                </button>
              </li>
              <li class="nav-item">
                <button
                  class={`nav-link ${
                    state.selectedTab === "preview" ? "active" : ""
                  }`}
                  onClick={() => State.update({ selectedTab: "preview" })}
                >
                  Preview
                </button>
              </li>
            </ul>
          </div>
        </div>

        {state.selectedTab === "editor" ? (
          <>
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDE"}
              props={{
                data: { handler: state.handler, content: state.data },
                onChange: (content) => {
                  State.update({ data: content, handler: "update" });
                },
                placeholder: placeholder,
                height,
                embeddCSS: embeddCSS || EmbeddCSS,
                showAutoComplete: autocompleteEnabled,
                showProposalIdAutoComplete: showProposalIdAutoComplete,
              }}
            />
          </>
        ) : (
          <div className="card-body">
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"
              }
              props={{
                text: state.data,
              }}
            />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

return Compose(props);
