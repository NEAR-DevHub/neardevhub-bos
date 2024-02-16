const value = props.value;
const placeholder = props.placeholder;
const onUpdate = props.onUpdate;

const [showAccountAutocomplete, setAutoComplete] = useState(false);
const AutoComplete = styled.div`
  max-width: 400px;
  margin-top: 1rem;
`;

return (
  <div>
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.InputWithIcon"
      props={{
        icon: <div className="input-icon">@</div>,
        value: value,
        placeholder: placeholder,
        onUpdate: (v) => {
          onUpdate(v);
          setAutoComplete(true);
        },
        onEnter: () => {},
      }}
    />
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
