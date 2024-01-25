const treasuryDaoID = "${REPL_TREASURY_CONTRACT}";
const resPerPage = 50;
const [currentPage, setPage] = useState(0);

const [showCreatePage, setCreatePage] = useState(false);

const RecipientsData = [
  {
    id: 1,
    firstName: "Megha",
    lastName: "Goel",
    organisation: "",
    kycVerified: true,
    accountId: "megha19.near",
    testTransactionStatus: true,
    totalTransactions: 10,
    totalPaid: "1500",
  },
  {
    id: 2,
    firstName: "Megha",
    lastName: "Goel",
    organisation: "",
    kycVerified: true,
    accountId: "",
    testTransactionStatus: false,
    totalTransactions: 15,
    totalPaid: "1000",
  },
];

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

  .text-underline {
    text-decoration: underline;
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

  tr {
    vertical-align: middle;
  }

  .text-red {
    color: #dc6666;
  }

  .green-button {
    background-color: #04a46e;
    color: white;
    border-color: #04a46e;
  }

  .grey-button {
    background-color: #687076;
    color: white;
    border: none;
    border-radius: 0.3rem;
    padding-block: 0.2rem;
    padding-inline: 0.5rem;
  }
`;

const RecipientsComponent = () => {
  return (
    <tbody>
      {RecipientsData?.map((item, index) => {
        // USE API
        const isReceiverkycbVerified = true;

        return (
          <tr>
            <td>{item.id}</td>
            <td>{item.firstName}</td>
            <td className="text-truncate bold" style={{ maxWidth: 150 }}>
              {item.lastName}
            </td>
            <td className="text-truncate bold" style={{ maxWidth: 150 }}>
              {item.organisation ?? "-"}
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
            <td className="bold">{item.accountId}</td>
            <td className="bold">
              {item.testTransactionStatus ? (
                <span>Confirmed</span>
              ) : (
                <span className="text-red">Not Confirmed</span>
              )}
            </td>
            <td className="bold text-underline">{item.totalTransactions}</td>
            <td className="bold">
              +{parseFloat(item.totalPaid).toLocaleString("en-US")}
            </td>

            <td>
              <div className="d-flex gap-2 align-items-center">
                <button className="grey-button" onClick={() => onPay(item.id)}>
                  Edit
                </button>
                <button className="grey-button" onClick={() => onPay(item.id)}>
                  Remove
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

if (showCreatePage) {
  return (
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.entity.moderator.CreateRecipient`}
    />
  );
}

return (
  <Container className="d-flex flex-column gap-4">
    <div className="d-flex flex-row gap-2 align-items-center justify-content-between">
      <div className="h5 bold mb-0">Manage Recipients</div>
      <div className="d-flex gap-4 align-items-center">
        <button className="btn btn-outline-primary d-flex gap-2 align-items-center justify-content-center p-2 px-3">
          <i class="bi bi-sliders"></i> <div>Filters</div>
        </button>
        <button
          className="btn green-button p-2 px-3"
          onClick={() => setCreatePage(true)}
        >
          Create New
        </button>
      </div>
    </div>

    <div className="card-custom overflow p-3">
      <table className="table">
        <thead>
          <tr className="text-grey">
            <td>ID</td>
            <td>FIRST NAME</td>
            <td>LAST NAME</td>
            <td>ORGANISATION</td>
            <td>KYC/B VERIFIED</td>
            <td>WALLET</td>
            <td>TEST TRANSACTIONS</td>
            <td># TRANSACTIONS</td>
            <td>TOTAL PAID</td>
            <td>ACTIONS</td>
          </tr>
        </thead>
        <RecipientsComponent />
      </table>
    </div>
    <div className="d-flex align-items-center justify-content-center">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Pagination"}
        props={{
          totalPages: 2,
          onPageClick: (v) => setPage(v),
        }}
      />
    </div>
  </Container>
);
