const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;

const [search, setSearch] = useState(props.search);
const onSearch = props.onSearch ?? (() => {});
const onEnter = props.onEnter ?? (() => {});

const updateInput = (value) => setSearch(value);

useEffect(() => {
  if (search !== props.search) {
    onSearch(search);
  }
}, [search]);

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
    props={{
      className: "flex-grow-1",
      value: search,
      onChange: (e) => {
        updateInput(e.target.value);
      },
      onKeyDown: (e) => e.key == "Enter" && onEnter(),
      skipPaddingGap: true,
      placeholder: "Search by content",
      inputProps: {
        prefix: <i class="bi bi-search m-auto"></i>,
      },
    }}
  />
);
