const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
href || (href = () => {});

const instance = props.instance ?? "";

console.log("Instance linked proposals dropdown", instance);

const { cacheUrl, contract } = VM.require(`${instance}/widget/config.data`);

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

function searchCacheApi() {
  let searchInput = encodeURI(searchProposalId);
  let searchUrl = `${cacheUrl}/proposals/search/${searchInput}`;

  console.log("searchUrl, ", searchUrl);
  return asyncFetch(searchUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  }).catch((error) => {
    console.log("Error searching cache api", error);
  });
}

function searchProposals() {
  if (state.loading) return;
  State.update({ loading: true });

  searchCacheApi().then((result) => {
    console.log("result", result);
    let proposalsData = result.body.records;

    const data = [];
    for (const prop of proposalsData) {
      data.push({
        label: "# " + prop.proposal_id + " : " + prop.name,
        value: prop.proposal_id,
      });
    }
    setProposalsOptions(data);
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
              widgetSrc: `${contract}/widget/app`,
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
            <i class="bi bi-trash3-fill"></i>
          </div>
        </div>
      );
    })}

    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch"
      props={{
        selectedValue: "",
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
