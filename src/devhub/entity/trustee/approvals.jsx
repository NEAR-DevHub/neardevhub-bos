const { getRelativeTime } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.timeUtils"
);

getRelativeTime || (getRelativeTime = () => {});

const Container = styled.div`
  .text-grey {
    color: #b9b9b9 !important;
  }

  .text-dark-grey {
    color: #687076;
  }

  .text-grey-100 {
    background-color: #f5f5f5;
  }

  td {
    padding-inline: 1.5rem;
    color: inherit;
    padding-block: 0.5rem;
  }

  .overflow {
    overflow: auto;
  }

  .max-w-100 {
    max-width: 100%;
  }

  button {
    background-color: #04a46e;
    color: white;
    border: none;
    font-weight: 600;
  }
`;

const data = [
  {
    id: 1,
    summary:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu",
    title: "Proposal 1 will deliver a new solution to improve th...",
    description: "",
    from: "megha19.near",
    to: "megha19.near",
    kycbVerified: true,
    token: "NEAR",
    amount: "1000",
    created: 1643468479000,
  },
  {
    id: 2,
    summary:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu",
    title: "Proposal 2 will deliver a new solution to improve th...",
    description: "",
    from: "mefsdfdsfsdfsdfie urhfgiurehvbiubuihrbiuthvuerhtiuerhvniurhntiuheritheruthieurtheiutheritigha19.near",
    to: "megha19.near",
    kycbVerified: true,
    token: "NEAR",
    amount: "1000",
    created: 1643468479000,
  },
  {
    id: 3,
    summary:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu",
    title: "Proposal 3 will deliver a new solution to improve th...",
    description: "",
    from: "megha19.near",
    to: "megha19.near",
    kycbVerified: false,
    token: "NEAR",
    amount: "1000.44",
    created: 1643468479000,
  },
];

const [expandSummaryIndex, setExpandSummary] = useState({});

return (
  <Container className="d-flex flex-column gap-4">
    <div className="d-flex flex-row gap-2 align-items-center">
      <div className="h4 bold mb-0">Need Approvals</div>
      <i class="bi bi-info-circle"></i>
    </div>
    <div className="custom-card overflow">
      <div className="card-body">
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
              <td>CREATED</td>
              <td>PAY</td>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => {
              return (
                <tr
                  className={expandSummaryIndex[index] ? "text-grey-100" : ""}
                >
                  <td>{item.id}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-between gap-2">
                      <div
                        className="d-flex flex-column gap-2 flex-wrap"
                        style={{ maxWidth: 280 }}
                      >
                        <div className="h6 bold text-truncate max-w-100">
                          {item.title}
                        </div>
                        {expandSummaryIndex[index] && (
                          <div className={"text-dark-grey max-w-100"}>
                            {item.summary}
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
                    {item.from}
                  </td>
                  <td className="text-truncate bold" style={{ maxWidth: 150 }}>
                    {item.to}
                  </td>
                  <td className="text-center">
                    {item.kycbVerified ? (
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
                    {parseFloat(item.amount).toLocaleString("en-US")}
                  </td>
                  <td className="text-grey">{getRelativeTime(item.created)}</td>
                  <td>
                    <button>Pay</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </Container>
);
