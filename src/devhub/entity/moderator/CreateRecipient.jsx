const [form, setForm] = useState(null);

// dropdown options
const [fromWalletOptions, setFromWalletOptions] = useState([]);
const [selectedOption, setSelectedOption] = useState("Confirmed");

const handleOptionChange = (event) => {
  setSelectedOption(event.target.value);
};

const Container = styled.div`
  margin-top: 10px;
  font-size: 14px;
  width: 40%;

  @media screen and (max-width: 1300px) {
    width: 60%;
  }

  @media screen and (max-width: 1000px) {
    width: 100%;
  }

  .text-grey {
    color: #b9b9b9 !important;
  }

  .card-custom {
    border-radius: 5px;
    background-color: white;
  }

  label {
    font-weight: 600;
    margin-bottom: 3px;
    font-size: 15px;
  }

  .p-2 {
    padding: 0px !important;
  }

  .green-btn {
    background-color: #04a46e !important;
    color: white;
  }

  .text-size-1 {
    font-weight: normal;
    font-size: 13px;
  }

  .text-dark-grey {
    color: #818181;
  }

  .form-check-input:checked {
    background-color: #04a46e;
    border-color: #04a46e;
    color: #fff;
  }
`;

function onCancelClick() {}

function onSubmitClick() {}

const VerificationIconContainer = ({ isVerified, label }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      {isVerified ? (
        <img
          src="https://ipfs.near.social/ipfs/bafkreidqveupkcc7e3rko2e67lztsqrfnjzw3ceoajyglqeomvv7xznusm"
          height={30}
        />
      ) : (
        "Need icon"
      )}
      <div>{label}</div>
    </div>
  );
};

return (
  <Container className="d-flex gap-3 flex-column">
    <div className="h5 bold mb-0">Create New Recipient</div>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        key: `first-name`,
        label: "First Name",
        onChange: () => {},
        placeholder: "Enter first name",
        value: form,
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        key: `last-name`,
        label: "Last Name",
        onChange: () => {},
        placeholder: "Enter last name",
        value: form,
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        key: `email`,
        label: "Email Address",
        onChange: () => {},
        placeholder: "Enter email address",
        value: form,
      }}
    />
    <div>
      <label>
        <span>
          Organisation (optional)
          <div className="text-dark-grey text-size-1 mt-1">
            If recipient is getting paid as an entity, please enter the
            organization name. Note that KYB is required.
          </div>
        </span>
      </label>
      <input
        className="flex-grow-1 form-control border border-2"
        onChange={() => {}}
        placeholder="Enter organisation"
        value={form}
      />
    </div>

    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: form,
        onChange: () => {},
        label: "Wallet Address",
        options: fromWalletOptions,
        showSearch: true,
        defaultLabel: "neardevhub.near",
      }}
    />
    <VerificationIconContainer isVerified={true} label="KYC Verified" />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        key: `url`,
        label: "Test Transaction URL",
        onChange: () => {},
        placeholder: "Enter URL",
        value: form,
      }}
    />
    <div>
      <label>Test Transaction</label>
      <div>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            value="Confirmed"
            checked={selectedOption === "Confirmed"}
            onChange={handleOptionChange}
          />
          <label htmlFor="option1" className="form-check-label text-dark-grey">
            Confirmed
          </label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            value="Not Confirmed"
            checked={selectedOption === "Not Confirmed"}
            onChange={handleOptionChange}
          />
          <label htmlFor="option2" className="form-check-label text-dark-grey">
            Not Confirmed
          </label>
        </div>
      </div>
    </div>
    <div className="d-flex mt-4 gap-3 justify-content-end">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
        props={{
          classNames: { root: "btn-outline-danger shadow-none border-0" },
          label: "Cancel",
          onClick: onCancelClick,
        }}
      />
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
        props={{
          classNames: { root: "green-btn" },
          disabled: false, // add checks
          label: "Submit",
          onClick: onSubmitClick,
        }}
      />
    </div>
  </Container>
);
