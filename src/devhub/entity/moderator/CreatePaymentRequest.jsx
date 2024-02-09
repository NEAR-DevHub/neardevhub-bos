// dropdown options
const [fromWalletOptions, setFromWalletOptions] = useState([
  { label: "treasury.dhthomas.testnet", value: "treasury.dhthomas.testnet" },
  { label: "treasurydevhub.near", value: "treasurydevhub.near" },
]);
const [proposalsOptions, setProposalsOptions] = useState([]);
const [recipientsOptions, setReceientsOptions] = useState([
  { label: "devhub.near", value: "devhub.near" },
  { label: "devgovgigs.near", value: "devgovgigs.near" },
]);
const [tokensOptions, setTokenOptions] = useState([
  { label: "NEAR", value: "" },
  { label: "USDT", value: "usdt.tether-token.near" },
  {
    label: "USDC",
    value: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
  },
]);

const [sender, setSender] = useState(fromWalletOptions[0].value);
const [tokenId, setTokenId] = useState(null);
const [receiver, setReceiver] = useState(null);
const [memo, setMemo] = useState(null);
const [selectedProposalId, setSelectedProposalId] = useState(null);
const [amount, setAmount] = useState(null);
const [proposalsArray, setProposalsArray] = useState([]);

const proposalsData = Near.view("${REPL_PROPOSAL_CONTRACT}", "get_proposals");
if (proposalsData !== null && Array.isArray(proposalsData)) {
  setProposalsArray(proposalsData);
  const data = [];
  const receiverArray = [];
  for (const prop of proposalsData) {
    const account = prop.snapshot.receiver_account;
    data.push({ label: prop.snapshot.name, value: prop.id });
    receiverArray.push({ label: account, value: account });
  }
  setProposalsOptions(data);
  setReceientsOptions(receiverArray);
}

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

function onSelectProposal(id) {
  const proposal = proposalsArray.find((item) => item.id === id);
  if (proposal !== null) {
    const token =
      tokensOptions.find(
        (i) => i.label === proposal.snapshot.requested_sponsorship_token
      )?.value ?? "";
    setReceiver(proposal.snapshot.receiver_account);
    setAmount(proposal.snapshot.requested_sponsorship_amount);
    setTokenId(token);
    setSelectedProposalId(id);
  }
}

function onCancelClick() {}

function onSubmitClick() {
  const policy = Near.view(sender, "get_policy");
  const gas = 200000000000000;
  const deposit = policy?.proposal_bond || 100000000000000000000000;
  Near.call([
    {
      contractName: sender,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: `[${selectedProposalId}]`,
          kind: {
            Transfer: {
              token_id: tokenId,
              receiver_id: receiver,
              amount: amount,
              msg: memo,
            },
          },
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
}

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
    <div className="h5 bold mb-2">Create Payment Request</div>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: sender,
        onChange: (v) => setSender(v),
        label: "From Wallet",
        options: fromWalletOptions,
        showSearch: false,
        defaultLabel: "treasury.near",
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: selectedProposalId,
        onChange: onSelectProposal,
        label: "Choose Proposal",
        options: proposalsOptions,
        showSearch: false,
        defaultLabel: "Seach proposals",
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: receiver,
        onChange: (v) => setReceiver(v),
        label: "To Wallet (Recipient)",
        options: recipientsOptions,
        showSearch: false,
        defaultLabel: "neardevhub.near",
      }}
    />
    <div className="d-flex gap-2 flex-column">
      <VerificationIconContainer isVerified={true} label="KYC Verified" />
      <VerificationIconContainer
        isVerified={true}
        label="Test Transaction Confirmed"
      />
      <div className="text-grey">
        You can add new recipients in the Manage Recipients tab.
      </div>
    </div>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch`}
      props={{
        selectedValue: tokenId,
        onChange: (v) => setTokenId(v),
        label: "Currency",
        options: tokensOptions,
        showSearch: false,
        defaultLabel: "Near",
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        key: `total-amount`,
        label: "Total Amount",
        onChange: (e) => setAmount(e.target.value),
        placeholder: "Enter amount",
        value: amount,
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
        onChange: (e) => setMemo(e.target.value),
        placeholder: "Enter memo",
        value: memo,
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
          disabled:
            !amount || !sender || !receiver || !selectedProposalId?.toString(),
          label: "Submit",
          onClick: onSubmitClick,
        }}
      />
    </div>
  </Container>
);
