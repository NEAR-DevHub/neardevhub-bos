const { getRelativeTime } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.timeUtils"
);

getRelativeTime || (getRelativeTime = () => {});

const treasuryDaoID = "${REPL_TREASURY_CONTRACT}";
const resPerPage = 50;
const [currentPage, setPage] = useState(0);

const [expandSummaryIndex, setExpandSummary] = useState({});
const proposals = Near.view(treasuryDaoID, "get_proposals", {
  from_index: currentPage === 0 ? currentPage : (currentPage - 1) * resPerPage,
  limit: resPerPage,
});

const lastProposalID = Near.view(treasuryDaoID, "get_last_proposal_id", {});
if (proposals === null || lastProposalID === null) {
  return <></>;
}

const Container = styled.div`
  font-size: 13px;
  .text-grey {
    color: #b9b9b9 !important;
  }

  .card-custom {
    border-radius: 5px;
    background-color: white;
  }

  .text-size-2 {
    font-size: 15px;
  }

  .text-dark-grey {
    color: #687076;
  }

  .text-grey-100 {
    background-color: #f5f5f5;
  }

  td {
    padding: 0.5rem;
    color: inherit;
  }

  .overflow {
    overflow: auto;
  }

  .max-w-100 {
    max-width: 100%;
  }
`;

// filter approved proposals
const historyProposals = proposals.filter((item) => {
  if (item.kind?.FunctionCall?.actions?.[0]?.method_name) {
    return (
      item.kind?.FunctionCall?.actions?.[0]?.method_name === "ft_transfer" &&
      item.status === "Approved"
    );
  }
  return false;
});

const ProposalsComponent = () => {
  return (
    <tbody>
      {historyProposals?.map((item, index) => {
        // decode args
        const actions = item.kind?.FunctionCall?.actions?.[0];
        const args = JSON.parse(atob(actions?.args ?? ""));
        const isReceiverkycbVerified = true;
        const isNEAR = true;
        const address = item.token;
        let ftMetadata = {
          symbol: "NEAR",
          decimals: 24,
        };
        if (!isNEAR) {
          ftMetadata = Near.view(address, "ft_metadata", {});
          if (ftMetadata === null) return null;
        }
        let amount = amountWithDecimals;
        if (amountWithoutDecimals !== undefined) {
          amount = Big(amountWithoutDecimals)
            .div(Big(10).pow(ftMetadata.decimals))
            .toString();
        }
        return (
          <tr className={expandSummaryIndex[index] ? "text-grey-100" : ""}>
            <td>{item.id}</td>
            <td>
              <div className="d-flex flex-row gap-2">
                <div
                  className="d-flex flex-column gap-2 flex-wrap"
                  style={{ maxWidth: 320 }}
                >
                  <div
                    className={
                      "h6 bold max-w-100" +
                      (!expandSummaryIndex[index] && " text-truncate")
                    }
                  >
                    {args.title}
                  </div>
                  {expandSummaryIndex[index] && (
                    <div className={"text-dark-grey max-w-100"}>
                      {args.summary}
                    </div>
                  )}
                </div>
                <div className="cursor">
                  <img
                    src={
                      expandSummaryIndex[index]
                        ? "https://ipfs.near.social/ipfs/bafkreic35n4yddasdpl532oqcxjwore66jrjx2qc433hqdh5wi2ijy4ida"
                        : "https://ipfs.near.social/ipfs/bafkreiaujwid7iigy6sbkrt6zkwmafz5umocvzglndugvofcz2fpw5ur3y"
                    }
                    onClick={() =>
                      setExpandSummary((prevState) => ({
                        ...prevState,
                        [index]: !prevState[index],
                      }))
                    }
                    height={20}
                  />
                </div>
              </div>
            </td>
            <td className="text-truncate bold" style={{ maxWidth: 150 }}>
              {treasuryDaoID}
            </td>
            <td className="text-truncate bold" style={{ maxWidth: 150 }}>
              {args.receiver_id}
            </td>
            <td className="text-center">
              {isReceiverkycbVerified ? (
                <img
                  src="https://ipfs.near.social/ipfs/bafkreidqveupkcc7e3rko2e67lztsqrfnjzw3ceoajyglqeomvv7xznusm"
                  height={30}
                />
              ) : (
                "Need icon"
              )}
            </td>
            <td className="bold">{item.token}</td>
            <td className="bold">
              {parseFloat(args.amount).toLocaleString("en-US")}
            </td>
            <td>{Object.keys(item.votes ?? {}).join(", ")}</td>
            <td className="text-truncate" style={{ maxWidth: 150 }}>
              {item.txnHash}
            </td>
            <td className="text-grey">{getRelativeTime(item.approvedAt)}</td>
          </tr>
        );
      })}
    </tbody>
  );
};
return (
  <Container className="d-flex flex-column gap-4">
    <div className="d-flex flex-row gap-2 align-items-center justify-content-between">
      <div className="h5 bold mb-0">{props.title ?? "Payment History"}</div>
      {/* currently we don't support any filter */}
      {/* <div>
        <button className="btn btn-outline-primary d-flex gap-2 align-items-center justify-content-center p-2 px-3">
          <i class="bi bi-sliders"></i> <div>Filters</div>
        </button>
      </div> */}
    </div>
    <div className="card-custom overflow p-3">
      <table className="table">
        <thead>
          <tr className="text-grey">
            <td>ID</td>
            <td>PROPOSAL</td>
            <td>FROM</td>
            <td>TO</td>
            <td>KYC/B VERIFIED</td>
            <td>TOKEN</td>
            <td>AMOUNT</td>
            <td>APPROVER</td>
            <td>TRANSACTION</td>
            <td>WHEN</td>
          </tr>
        </thead>

        <ProposalsComponent />
      </table>
    </div>
    <div className="d-flex align-items-center justify-content-center">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Pagination"}
        props={{
          totalPages: Math.round(lastProposalID / resPerPage),
          onPageClick: (v) => setPage(v),
        }}
      />
    </div>
  </Container>
);
