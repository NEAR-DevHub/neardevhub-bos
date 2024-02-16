const options = props.options; // [{label:"",value:""}]
const label = props.label;
const onUpdate = props.onUpdate ?? (() => {});
const selectedValue = props.selectedValue;
const [selected, setSelected] = useState(selectedValue);

const DropdownContainer = styled.div``;

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
`;

useEffect(() => {
  onUpdate(selected);
}, [selected]);

return (
  <DropdownContainer>
    <div class="dropdown w-100">
      <StyledDropdown>
        <button
          class="btn drop-btn text-truncate dropdown-toggle bg-white border rounded-2"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {label} {selected && label && ": "} {selected.label}
        </button>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start px-2 shadow">
          {options.map((item) => (
            <li
              style={{ borderRadius: "5px" }}
              class="dropdown-item link-underline link-underline-opacity-0"
              onClick={() => setSelected(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </StyledDropdown>
    </div>
  </DropdownContainer>
);
