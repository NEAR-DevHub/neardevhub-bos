const { useState } = require("react");

const [form, setForm] = useState(null);

// dropdown options
const [fromWalletOptions, setFromWalletOptions] = useState([]);
const [proposals, setProposals] = useState([]);
const [recipientsOptions, setReceientsOptions] = useState([]);
const [tokensOptions, setTokenOptions] = useState([]);

return (
  <div>
    <h1>Create Payment Request</h1>

    <div>
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
        props={{
          className: "flex-grow-1",
          key: `column-${id}-title`,
          label: "Title",
          onChange: formUpdate({
            path: ["payload", "columns", id, "title"],
          }),
          placeholder: "Enter column title",
          value: title,
        }}
      />
    </div>
  </div>
);