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
`;

const { data, onSubmit, onCancel, setIsActive, isActive } = props;
const initialValues = Struct.typeMatch(CommunityAccessControlSchema)
  ? Struct.pick(data ?? {}, Object.keys(CommunityAccessControlSchema))
  : {};

const [admins, setAdmins] = useState(initialValues?.admins ?? []);
const [text, setText] = useState("");

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
          <span
            className="remove"
            onClick={() =>
              isActive && setAdmins(admins.filter((item) => item !== admin))
            }
          >
            &times;
          </span>
        </div>
      ))}
      <input
        disabled={!isActive}
        value={text}
        onChange={(v) => setText(v.target.value)}
        onKeyDown={handleKeyDown}
        type="text"
        className="admins-input"
        placeholder="Add Admins"
      />
    </div>
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
