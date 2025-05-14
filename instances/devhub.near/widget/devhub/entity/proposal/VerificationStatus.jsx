const receiverAccount = props.receiverAccount;
const showGetVerifiedBtn = props.showGetVerifiedBtn;
const [verificationStatus, setVerificationStatus] = useState(null);
const imageSize = props.imageSize ?? 40;

const WarningImg =
  "https://ipfs.near.social/ipfs/bafkreieq4222tf3hkbccfnbw5kpgedm3bf2zcfgzbnmismxav2phqdwd7q";

const SuccessImg =
  "https://ipfs.near.social/ipfs/bafkreidqveupkcc7e3rko2e67lztsqrfnjzw3ceoajyglqeomvv7xznusm";

useEffect(() => {
  if (
    receiverAccount.length === 64 ||
    (receiverAccount ?? "").includes(".near") ||
    (receiverAccount ?? "").includes(".tg")
  ) {
    asyncFetch(
      `https://neardevhub-kyc-proxy-gvbr.shuttle.app/kyc/${receiverAccount}`
    ).then((res) => {
      let displayableText = "";
      switch (res.body.kyc_status) {
        case "APPROVED":
          displayableText = "Verified";
          break;
        case "PENDING":
          displayableText = "Pending";
          break;
        case "EXPIRED":
          displayableText = "Expired";
          break;
        case "NOT_SUBMITTED":
        case "REJECTED":
          displayableText = "Not Verified";
          break;
        default:
          displayableText = "Failed to get status";
          break;
      }
      setVerificationStatus(displayableText);
    });
  }
}, [receiverAccount]);

const Container = styled.div`
  .black-btn {
    background-color: #000 !important;
    border: none;
    color: white;
    &:active {
      color: white;
    }
  }
`;

const [isToastActive, setToastActive] = useState(false);

const Toast = () => {
  return (
    isToastActive && (
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div className={`toast show`}>
          <div class="toast-body d-flex gap-2">
            <div>
              Contact a DevHub Moderator to get your personalized verification
              link.
            </div>
            <i
              class="bi bi-x h4 mb-0 cursor-pointer"
              onClick={() => setToastActive(false)}
            ></i>
          </div>
        </div>
      </div>
    )
  );
};

return (
  <Container>
    <Toast />
    {!verificationStatus ? (
      <span
        className="spinner-grow spinner-grow-sm me-1"
        role="status"
        aria-hidden="true"
      />
    ) : (
      <div className="d-flex text-black justify-content-between align-items-center">
        <div className="d-flex" style={{ gap: "12px" }}>
          <img
            className="align-self-center object-fit-cover"
            src={verificationStatus === "Verified" ? SuccessImg : WarningImg}
            height={imageSize}
          />
          <div className="d-flex flex-column justify-content-center">
            <div className="h6 mb-0">Fractal</div>
            <div className="text-sm text-muted">{verificationStatus}</div>
          </div>
        </div>
        {verificationStatus !== "Verified" && showGetVerifiedBtn && (
          <button
            className="black-btn btn"
            onClick={() => setToastActive(true)}
          >
            Get Verified
          </button>
        )}
      </div>
    )}
  </Container>
);
