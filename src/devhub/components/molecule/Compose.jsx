const AutoComplete = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

const Compose = ({
  data,
  onChange,
  toolbar,
  autoFocus,
  autocompleteEnabled,
  placeholder,
}) => {
  State.init({
    data: data,
    showAccountAutocomplete: false,
    mentionInput: "", // text next to @ tag
    mentionsArray: [], // all the mentions in the description
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
    <div>
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
        }}
      />
      {autocompleteEnabled && state.showAccountAutocomplete && (
        <AutoComplete>
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.molecule.AccountAutocomplete"
            props={{
              term: state.mentionInput,
              onSelect: autoCompleteAccountId,
              onClose: () => State.update({ showAccountAutocomplete: false }),
            }}
          />
        </AutoComplete>
      )}
    </div>
  );
};

return Compose(props);
