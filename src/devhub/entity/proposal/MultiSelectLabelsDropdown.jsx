const availableOptions = [
  { label: "Bounty", value: "Bounty", color: "#7C66DC" },
  { label: "Bounty booster", value: "Bounty booster", color: "#DCC266" },
  { label: "Hackathon", value: "Hackathon", color: "#04A46E" },
  { label: "Hackbox", value: "Hackbox", color: "#DC6666" },
  {
    label: "Event sponsorship",
    value: "Event sponsorship",
    color: "#0DAEBB",
  },
  { label: "Meetup", value: "Meetup", color: "#DC9866" },
  { label: "Travel expenses", value: "Travel expenses", color: "#D366DC" },
  { label: "Other", value: "Other", color: "#9BA1A6" },
];

const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);
href || (href = () => {});

const { selected, onChange, disabled, hideDropdown } = props;

const [selectedOptions, setSelectedOptions] = useState([]);
const [isOpen, setIsOpen] = useState(false);

const toggleDropdown = () => {
  setIsOpen(!isOpen);
};

useEffect(() => {
  console.log("sss", selected, selectedOptions);
  if (JSON.stringify(selectedOptions) !== JSON.stringify(selected)) {
    if ((selected ?? []).some((i) => !i.value)) {
      setSelectedOptions(
        selected.map((i) => availableOptions.find((t) => t.value === i)),
      );
    } else {
      setSelectedOptions(selected);
    }
  }
}, [selected]);

useEffect(() => {
  if (JSON.stringify(selectedOptions) !== JSON.stringify(selected)) {
    onChange(selectedOptions);
  }
}, [selectedOptions]);


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

const handleOptionClick = (option) => {
  if (!selectedOptions.some((item) => item.value === v.value)) {
    setSelectedOptions([...selectedOptions, option]);
  }
  setIsOpen(false);
};

const Item = ({ option }) => {
  return <div> {option.label}</div>;
};

return (
  <>
    <div className="d-flex gap-2 align-items-center">
      {selectedOptions.map((option) => {
        return (
          <div
            style={{
              color: "white",
              backgroundColor: option.color,
              width: "max-content",
            }}
            className="d-flex gap-2 align-items-center badge rounded-lg p-2 h6 mb-0"
          >
            {option.label}
            {!disabled && (
              <div
                className="cursor-pointer"
                onClick={() => {
                  const updatedOptions = selectedOptions.filter(
                    (item) => item.value !== option.value,
                  );
                  setSelectedOptions(updatedOptions);
                }}
              >
                <i class="bi bi-trash3-fill"></i>
              </div>
            )}
          </div>
        );
      })}
    </div>
    {!hideDropdown && (
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
            <div className={`selected-option`}>Select Category</div>
          </div>

          {isOpen && (
            <div className="dropdown-menu rounded-2 dropdown-menu-end dropdown-menu-lg-start px-2 shadow show w-100">
              <div>
                {availableOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-item cursor-pointer w-100 my-1 ${
                      (selectedOptions ?? []).find(
                        (item) => item.value === option.value,
                      )
                        ? "selected"
                        : ""
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
    )}
  </>
);
