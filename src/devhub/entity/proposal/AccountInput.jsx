const value = props.value;
const placeholder = props.placeholder;
const onUpdate = props.onUpdate;

const [showAccountAutocomplete, setAutoComplete] = useState(false);
const [isValidAccount, setValidAccount] = useState(true);
const AutoComplete = styled.div`
  max-width: 400px;
  margin-top: 1rem;
`;

useEffect(() => {
  const handler = setTimeout(() => {
    const valid = value.length === 64 || value.includes(".near");
    setValidAccount(valid);
    setAutoComplete(!valid);
  }, 100);

  return () => {
    clearTimeout(handler);
  };
}, [value]);

return (
  <div>
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
      props={{
        className: "flex-grow-1",
        value: value,
        onChange: (e) => {
          onUpdate(e.target.value);
        },
        skipPaddingGap: true,
        placeholder: placeholder,
        inputProps: {
          max: 64,
          prefix: "@",
        },
      }}
    />
    {value && !isValidAccount && (
      <div style={{ color: "red" }} className="text-sm mt-1">
        Please enter valid account ID
      </div>
    )}
    {showAccountAutocomplete && (
      <AutoComplete>
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.AccountAutocomplete"
          props={{
            term: value,
            onSelect: (id) => {
              onUpdate(id);
              setAutoComplete(false);
            },
            onClose: () => setAutoComplete(false),
          }}
        />
      </AutoComplete>
    )}
  </div>
);
