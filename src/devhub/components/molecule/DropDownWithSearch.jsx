const { selectedValue, onChange, label, options, defaultLabel, showSearch } =
  props;

const [searchTerm, setSearchTerm] = useState("");
const [filteredOptions, setFilteredOptions] = useState(options);
const [isOpen, setIsOpen] = useState(false);
const [selectedOption, setSelectedOption] = useState({
  label:
    options?.find((item) => item.value === selectedValue)?.label ??
    defaultLabel,
  value: defaultLabel,
});

const handleSearch = (event) => {
  const searchTerm = event.target.value.toLowerCase();
  setSearchTerm(searchTerm);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm)
  );

  setFilteredOptions(filteredOptions);
};

const toggleDropdown = () => {
  setIsOpen(!isOpen);
};

const handleOptionClick = (option) => {
  setSelectedOption(option);
  setIsOpen(false);
  onChange(option);
};
const Container = styled.div`
  .custom-select {
    position: relative;
  }

  .select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius-top: 5px;
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

  .scroll-box {
    max-height: 200px;
    overflow-y: scroll;
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

  input {
    background-color: #f8f9fa;
  }
`;

return (
  <Container>
    <label>{label}</label>
    <div className="custom-select">
      <div className="select-header" onClick={toggleDropdown}>
        <div
          className={`selected-option ${
            selectedOption.label === defaultLabel ? "text-grey" : ""
          }`}
        >
          {selectedOption.label}
        </div>
        <i class={`bi bi-chevron-${isOpen ? "up" : "down"}`}></i>
      </div>

      {isOpen && (
        <div className="options-card">
          {showSearch && (
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search options"
              value={searchTerm}
              onChange={handleSearch}
            />
          )}
          <div className="scroll-box">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`option ${
                  selectedOption.value === option.value ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </Container>
);
