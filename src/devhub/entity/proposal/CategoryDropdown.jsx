const { selectedValue, onChange, label, disabled } = props;

onChange = onChange || (() => {});

const options = [
  {
    icon: "https://ipfs.near.social/ipfs/bafkreiet5w62oeef6msfsakdskq7zkjk33ngogcerfdmqewnsuj74u376e",
    title: "DevDAO Operations",
    description:
      "Provide core operations and leadership for the DAO or infrastructure support.",
    value: "DevDAO Operations",
  },
  {
    icon: "https://ipfs.near.social/ipfs/bafkreiem2vjsp6wu3lkd4zagpm43f32egdjjzchmleky6rr2ydzhlkrxam",
    title: "Decentralized DevRel",
    description:
      "Provide support, gather feedback, and maintain docs to drive engagement.",
    value: "Decentralized DevRel",
  },
  {
    icon: "https://ipfs.near.social/ipfs/bafkreic3prsy52hwueugqj5rwualib4imguelezsbvgrxtezw4u33ldxqq",
    title: "NEAR Campus",
    description:
      "Engage with students and universities globally to encourage NEAR.",
    value: "NEAR Campus",
  },
  {
    icon: "https://ipfs.near.social/ipfs/bafkreibdrwhbouuutvrk4qt2udf4kumbyy5ebjkezobbahxvo7fyxo2ec4",
    title: "Marketing",
    description:
      "Create social content to real world swag to drive awareness to NEAR.",
    value: "Marketing",
  },
  {
    icon: "https://ipfs.near.social/ipfs/bafkreicpt3ulwsmptzdbtkhvxodvo7pcajcpyr35tqcbfdnaipzrx5re7e",
    title: "Events",
    description:
      "Organize or support events, hackathons, and local meet ups to grow communities.",
    value: "Events",
  },
  {
    icon: "https://ipfs.near.social/ipfs/bafkreigf7j5isssumbjl24zy4pr27ryfqivan3vuwu2uwsofcujhhkk7cq",
    title: "Tooling & Infrastructure",
    description:
      "Contribute code to NEAR tooling or facilitating technical decisions.",
    value: "Tooling & Infrastructure",
  },
  {
    icon: "https://ipfs.near.social/ipfs/bafkreihctatkwnvpmblgqnpw76zggfet3fmpgurqvtj7vbm3cb5r3pp52u",
    title: "Other",
    description: "Use this category if you are not sure which one to use.",
    value: "Other",
  },
];

const [isOpen, setIsOpen] = useState(false);
const [selectedOptionValue, setSelectedValue] = useState(selectedValue);

const toggleDropdown = () => {
  setIsOpen(!isOpen);
};

const handleOptionClick = (option) => {
  setSelectedOption(option.value);
  setIsOpen(false);
  onChange(option.value);
};

const Container = styled.div`
  .disabled {
    background-color: #f8f8f8 !important;
    cursor: not-allowed !important;
    border-radius: 5px;
  }

  .custom-select {
    position: relative;
  }
  .select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 0.5px solid #ccc;
    cursor: pointer;
    background-color: #fff;
  }
  .options-card {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 0.5rem;
    z-index: 9999;
  }

  .option {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.3s ease;
  }
  .option:hover {
    background-color: #f0f0f0; /* Custom hover effect color */
  }
  .option:last-child {
    border-bottom: none;
  }
  .selected {
    background-color: #f0f0f0;
  }
`;

const Item = ({ option }) => {
  return (
    <div className="d-flex gap-3 align-items-center">
      <img src={option.icon} height={30} />
      <div className="d-flex flex-column gap-1">
        <div className="h6 mb-0"> {option.title}</div>
        <div className="text-sm tetx-muted">{option.description}</div>
      </div>
    </div>
  );
};

const selectedOption =
  options.find((item) => item.value === selectedOptionValue) ?? null;

return (
  <Container>
    {label && <label>{label}</label>}
    <div className="custom-select">
      <div
        className={"select-header " + (disabled ? "disabled" : "")}
        onClick={!disabled && toggleDropdown}
      >
        <div className={`selected-option`}>
          <Item option={selectedOption} />
        </div>
        {!disabled && <i class={`bi bi-chevron-${isOpen ? "up" : "down"}`}></i>}
      </div>

      {isOpen && (
        <div className="options-card">
          <div>
            {options.map((option) => (
              <div
                key={option.value}
                className={`option ${
                  selectedOption.value === option.value ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <Item option={option} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </Container>
);
