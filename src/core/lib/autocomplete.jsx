const autocompleteEnabled = true;

const AutoComplete = styled.div`
  z-index: 5;

  > div > div {
    padding: calc(var(--padding) / 2);
  }
`;

function textareaInputHandler(value) {
  const showAccountAutocomplete = /@[\w][^\s]*$/.test(value);
  State.update((lastKnownState) => ({
    ...lastKnownState,
    text: value,
    showAccountAutocomplete,
  }));
}

function autoCompleteAccountId(id) {
  let description = state.description.replace(/[\s]{0,1}@[^\s]*$/, "");
  description = `${description} @${id}`.trim() + " ";
  State.update((lastKnownState) => ({
    ...lastKnownState,
    description,
    showAccountAutocomplete: false,
  }));
}

return {
  autoCompleteAccountId,
  autocompleteEnabled,
  AutoComplete,
  textareaInputHandler,
};
