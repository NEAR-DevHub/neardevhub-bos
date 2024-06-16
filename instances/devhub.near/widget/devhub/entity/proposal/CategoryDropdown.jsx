const { selectedValue, onChange, disabled } = props;

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
    icon: "https://ipfs.near.social/ipfs/bafkreiengkdru4fczwltjylfqeeypsdf4hb5fdxa6t67l3x2qtqgeo3pzq",
    title: "DevDAO Platform",
    description:
      "Build & maintain the interface for DevHub’s community & funding activities.",
    value: "DevDAO Platform",
  },
  {
    icon: "https://ipfs.near.social/ipfs/bafkreicpt3ulwsmptzdbtkhvxodvo7pcajcpyr35tqcbfdnaipzrx5re7e",
    title: "Events & Hackathons",
    description:
      "Organize or support events, hackathons, and local meet ups to grow communities.",
    value: "Events & Hackathons",
  },
  {
    icon: "https://ipfs.near.social/ipfs/bafkreibdrwhbouuutvrk4qt2udf4kumbyy5ebjkezobbahxvo7fyxo2ec4",
    title: "Engagement & Awareness",
    description:
      "Create content from social posts to real world swag to drive awareness to NEAR.",
    value: "Engagement & Awareness",
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
    title: "Universities & Bootcamps",
    description:
      "Engage with students and universities globally to encourage NEAR.",
    value: "Universities & Bootcamps",
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

useEffect(() => {
  if (selectedValue && selectedValue !== selectedOptionValue) {
    setSelectedValue(selectedValue);
  }
}, [selectedValue]);

useEffect(() => {
  if (selectedValue !== selectedOptionValue) {
    onChange(selectedOptionValue);
  }
}, [selectedOptionValue]);

const handleOptionClick = (option) => {
  setSelectedValue(option.value);
  setIsOpen(false);
};

const Container = styled.div`
  .drop-btn {
    width: 100%;
    text-align: left;
    padding-inline: 10px;
  }

  .dropdown-toggle:after {
    position: absolute;
    top: 46%;
    right: 2%;
  }

  .dropdown-menu {
    width: 100%;
  }

  .dropdown-item.active,
  .dropdown-item:active {
    background-color: #f0f0f0 !important;
    color: black;
  }

  .disabled {
    background-color: #f8f8f8 !important;
    cursor: not-allowed !important;
    border-radius: 5px;
    opacity: inherit !important;
  }

  .disabled.dropdown-toggle::after {
    display: none !important;
  }

  .custom-select {
    position: relative;
  }

  .selected {
    background-color: #f0f0f0;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .text-wrap {
    overflow: hidden;
    white-space: normal;
  }
`;

const Item = ({ option }) => {
  if (!option) {
    return <div className="text-muted">Select Category</div>;
  }
  return (
    <div className="d-flex gap-3 align-items-center w-100">
      <img src={option.icon} height={30} />
      <div className="d-flex flex-column gap-1 w-100 text-wrap">
        <div className="h6 mb-0"> {option.title}</div>
        <div className="text-sm text-muted w-100 text-wrap">
          {option.description}
        </div>
      </div>
    </div>
  );
};

const selectedOption =
  options.find((item) => item.value === selectedOptionValue) ?? null;

return (
  <Container>
    <div
      className="custom-select w-100"
      tabIndex="0"
      onBlur={() => setIsOpen(false)}
    >
      <div
        className={
          "dropdown-toggle bg-white border rounded-2 btn drop-btn w-100 " +
          (disabled ? "disabled" : "")
        }
        onClick={!disabled && toggleDropdown}
      >
        <div className={`selected-option`}>
          <Item option={selectedOption} />
        </div>
      </div>

      {isOpen && (
        <div className="dropdown-menu rounded-2 dropdown-menu-end dropdown-menu-lg-start px-2 shadow show w-100">
          <div>
            {options.map((option) => (
              <div
                key={option.value}
                className={`dropdown-item cursor-pointer w-100 my-1 ${
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
