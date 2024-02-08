const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;

const [search, setSearch] = useState(props.search);
const onSearch = props.onSearch ?? (() => {});

const updateInput = (value) => setSearch(value);

useEffect(() => {
  if (search !== props.search) {
    onSearch(search);
  }
}, [search]);

return (
  <InputContainer>
    <div className="position-absolute d-flex ps-3 flex-column h-100 justify-center">
      <i class="bi bi-search m-auto"></i>
    </div>
    <input
      type="search"
      className="ps-5 form-control border rounded-2"
      value={search}
      onChange={(e) => updateInput(e.target.value)}
      onKeyDown={(e) => e.key == "Enter" && search()}
      placeholder={props.placeholder ?? `Search by content`}
    />
  </InputContainer>
);
