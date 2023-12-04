const CommunityAccessControlSchema = {
  admins: {
    format: "comma-separated",
    inputProps: { required: true },
    label: "Admins",
    order: 1,
  },
};

const Struct = VM.require("${REPL_DEVHUB}/widget/core.lib.struct");

if (!Struct) {
  return <p>Loading modules...</p>;
}

const AutoComplete = styled.div`
  z-index: 5;

  > div > div {
    padding: calc(var(--padding) / 2);
  }
`;

const Wrapper = styled.div`
  .container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5em;
  }

  .admins-item {
    display: inline-block;
    padding: 0.6em 0.8em;
    border-radius: 10px;
    border: 1px solid lightgray;
    position: relative;
  }

  .admins-item .remove {
    position: absolute;
    right: 5px;
    top: 0;
    font-size: 18px;
    color: grey;
    cursor: pointer;
  }

  .admins-input {
    flex-grow: 1;
    border: none;
    outline: none;
  }

  input[type="text"]:disabled {
    all: inherit;
  }

  input::placeholder {
    font-size: 16px;
  }
`;

const { data, onSubmit, onCancel, setIsActive, isActive } = props;
const initialValues = Struct.typeMatch(CommunityAccessControlSchema)
  ? Struct.pick(data ?? {}, Object.keys(CommunityAccessControlSchema))
  : {};

const [admins, setAdmins] = useState(initialValues?.admins ?? []);
const [text, setText] = useState("");
const [showAccountAutocomplete, setShowAutoAutocomplete] = useState(false);

function handleKeyDown(e) {
  if (e.key !== "Enter") return;
  const value = e.target.value;
  if (!value.trim()) return;
  // Add the value to the admins array
  setAdmins([...admins, value]);
  setText("");
}

const onCancelClick = () => {
  setAdmins(initialValues?.admins ?? []);
  setIsActive(false);
};

const onSubmitClick = () => {
  onSubmit({ admins: admins.map((admin) => admin.trim()) });
  setIsActive(false);
};

function autoCompleteAccountId(id) {
  setAdmins([...admins, id]);
  setText("");
  setShowAutoAutocomplete(false);
}

return (
  <Wrapper className="flex-grow-1 d-flex flex-column gap-4">
    <div className="container">
      {admins.map((admin, index) => (
        <div className="admins-item" key={index}>
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.molecule.ProfileCard"}
            props={{
              accountId: admin,
              nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
            }}
          />
          {/* don't allow removal if only 1 admin is added */}
          {admins.length > 1 && isActive && (
            <span
              className="remove"
              onClick={() => setAdmins(admins.filter((item) => item !== admin))}
            >
              &times;
            </span>
          )}
        </div>
      ))}
      <input
        disabled={!isActive}
        value={text}
        onChange={(v) => {
          setShowAutoAutocomplete(true);
          setText(v.target.value);
        }}
        onKeyDown={handleKeyDown}
        type="text"
        className="admins-input"
        placeholder={isActive && "Add Admins here..."}
      />
    </div>
    {showAccountAutocomplete && (
      <AutoComplete>
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.AccountAutocomplete"
          props={{
            term: text,
            onSelect: autoCompleteAccountId,
            onClose: () => setShowAutoAutocomplete(false),
            filterAccounts: admins,
          }}
        />
      </AutoComplete>
    )}
    {isActive && (
      <div className="d-flex align-items-center justify-content-end gap-3 mt-auto">
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-outline-danger shadow-none border-0" },
            label: cancelLabel || "Cancel",
            onClick: onCancelClick,
          }}
        />
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn-success" },
            disabled: Struct.isEqual(admins, initialValues?.admins ?? []),
            icon: {
              type: "bootstrap_icon",
              variant: "bi-check-circle-fill",
            },
            label: "Submit",
            onClick: onSubmitClick,
          }}
        />
      </div>
    )}
  </Wrapper>
);
