const value = props.value;
const placeholder = props.placeholder;
const onUpdate = props.onUpdate;

const [account, setAccount] = useState(value);
const [showAccountAutocomplete, setAutoComplete] = useState(false);
const [isValidAccount, setValidAccount] = useState(true);
const AutoComplete = styled.div`
  margin-top: 1rem;
`;

useEffect(() => {
  if (value !== account) {
    setAccount(value);
  }
}, [value]);

useEffect(() => {
  if (value !== account) {
    onUpdate(account);
  }
}, [account]);

useEffect(() => {
  const handler = setTimeout(() => {
    const valid =
      account.length === 64 ||
      (account ?? "").includes(".near") ||
      (account ?? "").includes(".tg");
    setValidAccount(valid);
    setAutoComplete(!valid);
  }, 100);

  return () => {
    clearTimeout(handler);
  };
}, [account]);

return (
  <div>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        value: account,
        onChange: (e) => {
          setAccount(e.target.value);
        },
        skipPaddingGap: true,
        placeholder: placeholder,
        inputProps: {
          max: 64,
          prefix: "@",
        },
      }}
    />
    {account && !isValidAccount && (
      <div style={{ color: "red" }} className="text-sm mt-1">
        Please enter valid account ID
      </div>
    )}
    {showAccountAutocomplete && (
      <AutoComplete>
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.AccountAutocomplete"
          props={{
            term: account,
            onSelect: (id) => {
              setAccount(id);
              setAutoComplete(false);
            },
            onClose: () => setAutoComplete(false),
          }}
        />
      </AutoComplete>
    )}
  </div>
);
