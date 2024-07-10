const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);
href || (href = () => {});

const {
  selected,
  onChange,
  disabled,
  availableOptions,
  hideDropdown,
  linkedRfp,
} = props;

const [selectedOptions, setSelectedOptions] = useState([]);
const [isOpen, setIsOpen] = useState(false);
const [initialStateApplied, setInitialState] = useState(false);

const toggleDropdown = () => {
  setIsOpen(!isOpen);
};

useEffect(() => {
  if (JSON.stringify(selectedOptions) !== JSON.stringify(selected)) {
    if (availableOptions.length > 0) {
      if ((selected ?? []).some((i) => !i.value)) {
        setSelectedOptions(
          selected.map((i) => availableOptions.find((t) => t.value === i))
        );
      } else {
        setSelectedOptions(selected);
      }
      setInitialState(true);
    }
  } else {
    setInitialState(true);
  }
}, [selected, availableOptions]);

useEffect(() => {
  if (
    JSON.stringify(selectedOptions) !== JSON.stringify(selected) &&
    initialStateApplied
  ) {
    onChange(selectedOptions);
  }
}, [selectedOptions, initialStateApplied]);

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
  if (!selectedOptions.some((item) => item.value === option.value)) {
    setSelectedOptions([...selectedOptions, option]);
  }
  setIsOpen(false);
};

const Item = ({ option }) => {
  return <div> {option.title}</div>;
};

return (
  <>
    <div className="d-flex gap-2 align-items-center">
      {(selectedOptions ?? []).map((option) => {
        return (
          <div
            style={{
              color: "white",
              backgroundColor: `rgb(${option.color})`,
              width: "max-content",
            }}
            className="d-flex gap-2 align-items-center badge rounded-lg p-2 h6 mb-0"
          >
            {option.title}
            {!disabled && (
              <div
                className="cursor-pointer"
                onClick={() => {
                  const updatedOptions = selectedOptions.filter(
                    (item) => item.value !== option.value
                  );
                  setSelectedOptions(updatedOptions);
                }}
              >
                <i className="bi bi-trash3-fill"></i>
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
            <div className={`selected-option`}>
              {linkedRfp ? (
                <span className="text-sm d-flex gap-2 align-items-center">
                  <i class="bi bi-lock-fill"></i>
                  These categories match the chosen RFP and cannot be changed.
                  To use different categories, unlink the RFP.
                </span>
              ) : (
                <span>Select Category </span>
              )}
            </div>
          </div>

          {isOpen && (
            <div className="dropdown-menu rounded-2 dropdown-menu-end dropdown-menu-lg-start px-2 shadow show w-100">
              <div>
                {(availableOptions ?? []).map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-item cursor-pointer w-100 my-1 ${
                      (selectedOptions ?? []).find(
                        (item) => item.value === option.value
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
