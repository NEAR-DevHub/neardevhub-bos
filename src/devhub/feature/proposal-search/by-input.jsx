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
    src="${REPL_DEVHUB}/widget/devhub.components.molecule.InputWithIcon"
    props={{
      icon: <i class="bi bi-search m-auto"></i>,
      value: search,
      placeholder: "Search by content",
      onUpdate: updateInput,
      onEnter: onEnter,
    }}
  />
);
