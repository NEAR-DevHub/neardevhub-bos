const options = props.options; // [{label:"",value:""}]
const label = props.label;
const onUpdate = props.onUpdate ?? (() => {});
const selectedValue = props.selectedValue;
const [selected, setSelected] = useState(selectedValue);

useEffect(() => {
  if (JSON.stringify(selectedValue) !== JSON.stringify(selected)) {
    setSelected(selectedValue);
  }
}, [selectedValue]);

const StyledDropdown = styled.div`
  .drop-btn {
    width: 100%;
    max-width: 200px;
    text-align: left;
    padding-inline: 10px;
  }

  .dropdown-item.active,
  .dropdown-item:active {
    background-color: #f0f0f0 !important;
    color: black;
  }

  .cursor-pointer {
    cursor: pointer;
  }
`;

useEffect(() => {
  onUpdate(selected);
}, [selected]);

return (
  <div>
    <div className="dropdown w-100">
      <StyledDropdown>
        <button
          className="btn drop-btn text-truncate dropdown-toggle bg-white border rounded-2"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {label} {selected && label && ": "} {selected.label}
        </button>
        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start px-2 shadow">
          {options.map((item) => (
            <li
              style={{ borderRadius: "5px" }}
              className="dropdown-item cursor-pointer link-underline link-underline-opacity-0"
              onClick={() => {
                if (selected.label !== item.label) {
                  setSelected(item);
                }
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </StyledDropdown>
    </div>
  </div>
);
