const [form, setForm] = useState(null);

// dropdown options
const [fromWalletOptions, setFromWalletOptions] = useState([
  { label: "devhub.near", value: "devhub.near" },
  { label: "devgovgigs.near", value: "devgovgigs.near" },
]);
const [proposals, setProposals] = useState([]);
const [recipientsOptions, setReceientsOptions] = useState([
  { label: "devhub.near", value: "devhub.near" },
  { label: "devgovgigs.near", value: "devgovgigs.near" },
]);
const [tokensOptions, setTokenOptions] = useState([
  { label: "NEAR", value: "near" },
  { label: "USDT", value: "usdt" },
]);

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
    <div className="h5 bold mb-0">Create Payment Request</div>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: form,
        onChange: () => {},
        label: "From Wallet",
        options: fromWalletOptions,
        showSearch: true,
        defaultLabel: "neardevhub.near",
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: form,
        onChange: () => {},
        label: "Choose Proposal",
        options: proposals,
        showSearch: true,
        defaultLabel: "Seach proposals",
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: form,
        onChange: () => {},
        label: "To Wallet (Recipient)",
        options: recipientsOptions,
        showSearch: true,
        defaultLabel: "neardevhub.near",
      }}
    />
    <div className="d-flex gap-2 flex-column">
      <VerificationIconContainer isVerified={true} label="KYC Verified" />
      <VerificationIconContainer
        isVerified={true}
        label="Test Transaction Confirmed"
      />
      <p className="text-grey">
        You can add new recipients in the Manage Recipients tab.
      </p>
    </div>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: form,
        onChange: () => {},
        label: "Currency",
        options: tokensOptions,
        showSearch: false,
        defaultLabel: "NEAR Tokens",
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        key: `total-amount`,
        label: "Total Amount",
        onChange: () => {},
        placeholder: "Enter amount",
        value: form,
        inputProps: {
          type: "number",
        },
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        key: `notes`,
        label: "Notes",
        onChange: () => {},
        placeholder: "Enter memo",
        value: form,
      }}
    />
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
