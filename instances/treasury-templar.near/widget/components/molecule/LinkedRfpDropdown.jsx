const { RFP_TIMELINE_STATUS, fetchGraphQL, parseJSON } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/core.common`
) || { RFP_TIMELINE_STATUS: {}, parseJSON: () => {} };
const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);
href || (href = () => {});

const { linkedRfp, onChange, disabled, onDeleteRfp } = props;

const isModerator = Near.view(
  "${REPL_TREASURY_TEMPLAR_CONTRACT}",
  "is_allowed_to_write_rfps",
  {
    editor: context.accountId,
  }
);

const [selectedRFP, setSelectedRFP] = useState(null);
const [acceptingRfpsOptions, setAcceptingRfpsOption] = useState([]);
const [allRfpOptions, setAllRfpOptions] = useState([]);
const [searchRFPId, setSearchRfpId] = useState("");
const [initialStateApplied, setInitialState] = useState(false);

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

function searchRfps() {
  const ENDPOINT = "${REPL_CACHE_URL}";
  let searchInput = encodeURI(searchRFPId);
  let searchUrl = searchInput
    ? `${ENDPOINT}/rfps/search/${searchInput}`
    : `${ENDPOINT}/rfps`;

  return asyncFetch(searchUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  })
    .then((result) => {
      const rfpsData = result.body.records;
      const data = [];
      const acceptingData = [];
      for (const prop of rfpsData) {
        const timeline = parseJSON(prop.timeline);
        const label = "# " + prop.rfp_id + " : " + prop.name;
        const value = prop.rfp_id;
        if (timeline.status === RFP_TIMELINE_STATUS.ACCEPTING_SUBMISSIONS) {
          acceptingData.push({
            label,
            value,
          });
        }
        data.push({
          label,
          value,
        });
      }
      setAcceptingRfpsOption(acceptingData);
      setAllRfpOptions(data);
    })
    .catch((error) => {
      console.log("Error searching cache api", error);
    });
}

useEffect(() => {
  searchRfps();
}, [searchRFPId]);

useEffect(() => {
  if (JSON.stringify(linkedRfp) !== JSON.stringify(selectedRFP)) {
    if (allRfpOptions.length > 0) {
      if (typeof linkedRfp !== "object") {
        setSelectedRFP(allRfpOptions.find((i) => linkedRfp === i.value));
      } else {
        setSelectedRFP(linkedRfp);
      }
      setInitialState(true);
    }
  } else {
    setInitialState(true);
  }
}, [linkedRfp, allRfpOptions]);

useEffect(() => {
  if (
    JSON.stringify(linkedRfp) !== JSON.stringify(selectedRFP) &&
    initialStateApplied
  ) {
    onChange(selectedRFP);
  }
}, [selectedRFP, initialStateApplied]);

return (
  <>
    {selectedRFP && (
      <div className="d-flex gap-2 align-items-center">
        <a
          className="text-decoration-underline flex-1"
          href={href({
            widgetSrc: `${REPL_TREASURY_TEMPLAR}/widget/portal`,
            params: {
              page: "rfp",
              id: selectedRFP.value,
            },
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          {selectedRFP.label}
        </a>
        {!disabled && (
          <div
            className="cursor-pointer"
            onClick={() => {
              onDeleteRfp();
              setSelectedRFP(null);
            }}
          >
            <i className="bi bi-trash3-fill"></i>
          </div>
        )}
      </div>
    )}
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch"
      props={{
        disabled: disabled,
        selectedValue: selectedRFP.value,
        onChange: (v) => {
          setSelectedRFP(v);
        },
        options: isModerator ? allRfpOptions : acceptingRfpsOptions,
        showSearch: true,
        searchInputPlaceholder: "Search by Id",
        defaultLabel: "Search RFP",
        searchByValue: true,
        onSearch: (value) => {
          setSearchRfpId(value);
        },
      }}
    />
  </>
);
