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
  onChangeKeyup,
  handler,
  sortedRelevantUsers,
  isTailwind,
}) => {
  State.init({
    data: data,
    selectedTab: "editor",
    autoFocus: false,
  });

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange(state.data);
    }
  }, [state.data]);

  useEffect(() => {
    // for clearing editor after txn approval/ showing draft state
    if (data !== state.data || handler !== state.handler) {
      State.update({ data: data, handler: handler });
    }
  }, [data, handler]);

  // classes are different for tailwind and bootstrap
  if (isTailwind) {
    return (
      <div>
        <div className="bg-white shadow-sm rounded-lg">
          <ul
            className="p-2 flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
            style={{ position: "relative" }}
          >
            <li className="me-2">
              <button
                className={
                  "inline-block p-3 rounded-t-lg " +
                  (state.selectedTab === "editor" &&
                    " active text-blue-600 bg-gray-100")
                }
                onClick={() =>
                  State.update({ selectedTab: "editor", autoFocus: true })
                }
              >
                Write
              </button>
            </li>
            <li className="me-2">
              <button
                className={
                  "inline-block p-3 rounded-t-lg " +
                  (state.selectedTab === "preview" &&
                    " active text-blue-600 bg-gray-100")
                }
                onClick={() => State.update({ selectedTab: "preview" })}
              >
                Preview
              </button>
            </li>
          </ul>

          {state.selectedTab === "editor" ? (
            <>
              <Widget
                src={
                  "${REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDE"
                }
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
                  autoFocus: state.autoFocus,
                  onChangeKeyup: onChangeKeyup,
                  sortedRelevantUsers,
                }}
              />
            </>
          ) : (
            <div className="p-3">
              <Widget
                src={`${REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDEViewer`}
                props={{
                  content: state.data,
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  } else
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
                    onClick={() =>
                      State.update({ selectedTab: "editor", autoFocus: true })
                    }
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
                src={
                  "${REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDE"
                }
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
                  autoFocus: state.autoFocus,
                  onChangeKeyup: onChangeKeyup,
                  sortedRelevantUsers,
                }}
              />
            </>
          ) : (
            <div className="card-body">
              <Widget
                src={`${REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDEViewer`}
                props={{
                  content: state.data,
                }}
              />
            </div>
          )}
        </div>
      </Wrapper>
    );
};

return Compose(props);
