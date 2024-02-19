const AutoComplete = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

const EmbeddCSS = `
  .CodeMirror {
    border: none !important;
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
  toolbar,
  autoFocus,
  autocompleteEnabled,
  placeholder,
  height,
  embeddCSS,
}) => {
  State.init({
    data: data,
    showAccountAutocomplete: false,
    mentionInput: "", // text next to @ tag
    mentionsArray: [], // all the mentions in the description
    selectedTab: "editor",
  });

  useEffect(() => {
    onChange(state.data);
  }, [state.data]);

  function textareaInputHandler(value) {
    const words = value.split(/\s+/);
    const allMentiones = words
      .filter((word) => word.startsWith("@"))
      .map((mention) => mention.slice(1));
    const newMentiones = allMentiones.filter(
      (item) => !state.mentionsArray.includes(item)
    );

    State.update((lastKnownState) => ({
      ...lastKnownState,
      data: value,
      showAccountAutocomplete: newMentiones?.length > 0,
      mentionsArray: allMentiones,
      mentionInput: newMentiones?.[0] ?? "",
    }));
  }
  function autoCompleteAccountId(id) {
    // to make sure we update the @ at correct index
    let currentIndex = 0;
    const updatedDescription = state.data.replace(
      /(?:^|\s)(@[^\s]*)/g,
      (match) => {
        if (currentIndex === state.mentionsArray.indexOf(state.mentionInput)) {
          currentIndex++;
          return ` @${id}`;
        } else {
          currentIndex++;
          return match;
        }
      }
    );

    State.update((lastKnownState) => ({
      ...lastKnownState,
      handler: "autocompleteSelected",
      data: updatedDescription,
      showAccountAutocomplete: false,
    }));
  }

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
                  textareaInputHandler(content);
                },
                toolbar: toolbar || [
                  "heading",
                  "bold",
                  "italic",
                  "quote",
                  "code",
                  "link",
                  "unordered-list",
                  "ordered-list",
                  "checklist",
                  "mention",
                ],
                statusConfig: [],
                spellChecker: false,
                autoFocus: autoFocus,
                placeholder: placeholder,
                height,
                embeddCSS: embeddCSS || EmbeddCSS,
              }}
            />
            {autocompleteEnabled && state.showAccountAutocomplete && (
              <AutoComplete>
                <Widget
                  src="${REPL_DEVHUB}/widget/devhub.components.molecule.AccountAutocomplete"
                  props={{
                    term: state.mentionInput,
                    onSelect: autoCompleteAccountId,
                    onClose: () =>
                      State.update({ showAccountAutocomplete: false }),
                  }}
                />
              </AutoComplete>
            )}
          </>
        ) : (
          <div className="card-body">
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"
              }
              props={{
                text: data,
              }}
            />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

return Compose(props);
