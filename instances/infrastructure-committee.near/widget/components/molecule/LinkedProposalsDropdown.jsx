const { fetchGraphQL } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/core.common`
);

const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);
href || (href = () => {});

const linkedProposals = props.linkedProposals;
const onChange = props.onChange;
const [selectedProposals, setSelectedProposals] = useState(linkedProposals);
const [proposalsOptions, setProposalsOptions] = useState([]);
const [searchProposalId, setSearchProposalId] = useState("");

const queryName = "${REPL_PROPOSAL_FEED_INDEXER_QUERY_NAME}";
const query = `query GetLatestSnapshot($offset: Int = 0, $limit: Int = 10, $where: ${queryName}_bool_exp = {}) {
${queryName}(
  offset: $offset
  limit: $limit
  order_by: {proposal_id: desc}
  where: $where
) {
  name
  proposal_id
}
}`;

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

function separateNumberAndText(str) {
  const numberRegex = /\d+/;

  if (numberRegex.test(str)) {
    const number = str.match(numberRegex)[0];
    const text = str.replace(numberRegex, "").trim();
    return { number: parseInt(number), text };
  } else {
    return { number: null, text: str.trim() };
  }
}

const buildWhereClause = () => {
  let where = {};
  const { number, text } = separateNumberAndText(searchProposalId);

  if (number) {
    where = { proposal_id: { _eq: number }, ...where };
  }

  if (text) {
    where = {
      _or: [
        { name: { _iregex: `${text}` } },
        { summary: { _iregex: `${text}` } },
        { description: { _iregex: `${text}` } },
      ],
      ...where,
    };
  }

  return where;
};

const fetchProposals = () => {
  const FETCH_LIMIT = 30;
  const variables = {
    limit: FETCH_LIMIT,
    offset: 0,
    where: buildWhereClause(),
  };
  if (typeof fetchGraphQL !== "function") {
    return;
  }
  fetchGraphQL(query, "GetLatestSnapshot", variables).then(async (result) => {
    if (result.status === 200) {
      if (result.body.data) {
        const proposalsData = result.body.data?.[queryName];
        const data = [];
        for (const prop of proposalsData) {
          data.push({
            label: "# " + prop.proposal_id + " : " + prop.name,
            value: prop.proposal_id,
          });
        }
        setProposalsOptions(data);
      }
    }
  });
};

useEffect(() => {
  fetchProposals();
}, [searchProposalId]);

return (
  <>
    {selectedProposals.map((proposal) => {
      return (
        <div className="d-flex gap-2 align-items-center">
          <a
            className="text-decoration-underline flex-1"
            href={href({
              widgetSrc: `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/app`,
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
      src="${REPL_DEVHUB}/widget/components.molecule.DropDownWithSearch"
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
