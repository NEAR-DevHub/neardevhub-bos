const [authorsOptions, setAuthorsOptions] = useState([]);
const [selectedAuthor, setSelectedAuthor] = useState(null);

if (!authorsOptions.length) {
  const data = [{ label: "None", value: "" }];
  const authors = Near.view(
    "${REPL_DEVHUB_CONTRACT}",
    "get_all_proposal_authors",
    {}
  );

  if (Array.isArray(authors)) {
    for (const author of authors) {
      data.push({ label: author, value: author });
    }
    setAuthorsOptions(data);
  }
}

const Container = styled.div`
  .dropdown-menu {
    max-height: 400px;
    overflow-x: auto;
  }
`;
return (
  <Container>
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown"
      props={{
        options: authorsOptions,
        label: "Author",
        onUpdate: (v) => {
          setSelectedAuthor(v);
          props.onAuthorChange(v);
        },
        selectedValue: props.author,
      }}
    />
  </Container>
);
