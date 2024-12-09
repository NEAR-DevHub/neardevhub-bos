const { fetchGraphQL } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/core.common`
);

const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);
href || (href = () => {});

const linkedProposals = props.linkedProposals;
const onChange = props.onChange;
const [selectedProposals, setSelectedProposals] = useState(linkedProposals);
const [proposalsOptions, setProposalsOptions] = useState([]);
const [searchProposalId, setSearchProposalId] = useState("");

useEffect(() => {
  if (JSON.stringify(linkedProposals) !== JSON.stringify(selectedProposals)) {
    setSelectedProposals(linkedProposals);
  }
}, [linkedProposals]);

useEffect(() => {
  if (JSON.stringify(linkedProposals) !== JSON.stringify(selectedProposals)) {
    onChange(selectedProposals);
  }
}, [selectedProposals]);

function searchProposals() {
  const ENDPOINT = "${REPL_CACHE_URL}";

  let searchInput = encodeURI(searchProposalId);
  let searchUrl = searchInput
    ? `${ENDPOINT}/proposals/search/${searchInput}`
    : `${ENDPOINT}/proposals`;

  return asyncFetch(searchUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  })
    .then((result) => {
      const proposalsData = result.body.records;
      const data = [];
      for (const prop of proposalsData) {
        data.push({
          label: "# " + prop.proposal_id + " : " + prop.name,
          value: prop.proposal_id,
        });
      }
      setProposalsOptions(data);
    })
    .catch((error) => {
      console.log("Error searching cache api", error);
    });
}

useEffect(() => {
  searchProposals();
}, [searchProposalId]);

return (
  <>
    {selectedProposals.map((proposal) => {
      return (
        <div className="d-flex gap-2 align-items-center">
          <a
            className="text-decoration-underline flex-1"
            href={href({
              widgetSrc: `${REPL_TREASURY_TEMPLAR}/widget/portal`,
              params: {
                page: "proposal",
                id: proposal.value,
              },
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            {proposal.label}
          </a>
          <div
            className="cursor-pointer"
            onClick={() => {
              const updatedLinkedProposals = selectedProposals.filter(
                (item) => item.value !== proposal.value
              );
              setSelectedProposals(updatedLinkedProposals);
            }}
          >
            <i className="bi bi-trash3-fill"></i>
          </div>
        </div>
      );
    })}

    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch"
      props={{
        selectedValue: selectedProposals,
        onChange: (v) => {
          if (!selectedProposals.some((item) => item.value === v.value)) {
            setSelectedProposals([...selectedProposals, v]);
          }
        },
        options: proposalsOptions,
        showSearch: true,
        searchInputPlaceholder: "Search by Id",
        defaultLabel: "Search proposals",
        searchByValue: true,
        onSearch: (value) => {
          setSearchProposalId(value);
        },
      }}
    />
  </>
);
