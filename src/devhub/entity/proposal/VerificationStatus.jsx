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
    (receiverAccount ?? "").includes(".near")
  ) {
    useCache(
      () =>
        asyncFetch(
          `https://neardevhub-kyc-proxy.shuttleapp.rs/kyc/${receiverAccount}`
        ).then((res) => {
          let displayableText = "";
          switch (res.body.kyc_status) {
            case "Approved":
              displayableText = "Verified";
              break;
            case "Pending":
              displayableText = "Pending";
              break;
            default:
              displayableText = "Not Verfied";
              break;
          }
          setVerificationStatus(displayableText);
        }),
      "ky-check-proposal" + receiverAccount,
      { subscribe: false }
    );
  }
}, [receiverAccount]);

const DropdowntBtnContainer = styled.div`
  font-size: 13px;
  min-width: 150px;

  .custom-select {
    position: relative;
  }

  .select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    border-radius-top: 5px;
    cursor: pointer;
    background-color: #fff;
    border-radius: 5px;
  }

  .no-border {
    border: none !important;
  }

  .options-card {
    position: absolute;
    top: 100%;
    left: 0;
    width: 200%;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 0.5rem;
    z-index: 99;
    font-size: 13px;
    border-radius: 0.375rem !important;
  }

  .left {
    right: 0 !important;
    left: auto !important;
  }

  @media screen and (max-width: 768px) {
    .options-card {
      right: 0 !important;
      left: auto !important;
    }
  }

  .option {
    margin-block: 2px;
    padding: 5px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.3s ease;
    border-radius: 0.375rem !important;
  }

  .option:hover {
    background-color: #f0f0f0; /* Custom hover effect color */
  }

  .option:last-child {
    border-bottom: none;
  }

  .selected {
    background-color: #f0f0f0;
  }

  .disabled {
    background-color: #f4f4f4 !important;
    cursor: not-allowed !important;
    font-weight: 500;
    color: #b3b3b3;
  }

  .disabled .circle {
    opacity: 0.5;
  }

  .circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .grey {
    background-color: #818181;
  }

  .green {
    background-color: #04a46e;
  }

  a:hover {
    text-decoration: none;
  }

  .black-btn {
    background-color: #000 !important;
    border: none;
    color: white;
    &:active {
      color: white;
    }
  }
`;

const [kycOptionsOpen, setKycOptions] = useState(false);

const VerificationBtn = () => {
  const btnOptions = [
    {
      src: "https://ipfs.near.social/ipfs/bafkreidqveupkcc7e3rko2e67lztsqrfnjzw3ceoajyglqeomvv7xznusm",
      label: "KYC",
      description: "Choose this if you are an individual.",
      value: "KYC",
    },
    {
      src: "https://ipfs.near.social/ipfs/bafkreic5ksax6b45pelvxm6a2v2j465jgbitpzrxtzpmn6zehl23gocwxm",
      label: "KYB",
      description: "Choose this if you are a business or corporate entity..",
      value: "KYB",
    },
  ];

  const toggleDropdown = () => {
    setKycOptions(!kycOptionsOpen);
  };

  return (
    <DropdowntBtnContainer>
      <div
        className="custom-select"
        tabIndex="0"
        id="getVerifiedButton"
        onClick={toggleDropdown}
        onBlur={() => {
          setTimeout(() => {
            setKycOptions(false);
          }, 100);
        }}
      >
        <div
          className={
            "select-header no-border black-btn btn d-inline-flex align-items-center gap-2"
          }
        >
          <div className="d-flex align-items-center gap-1">
            Get Verified
            <i class="bi bi-box-arrow-up-right"></i>
          </div>
        </div>

        {kycOptionsOpen && (
          <div className="options-card left">
            {btnOptions.map((option) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={
                  option.value === "KYC"
                    ? "https://go.fractal.id/near-social-kyc"
                    : "https://go.fractal.id/near-social-kyb"
                }
              >
                <div
                  key={option.value}
                  className={`option ${
                    selectedOption.value === option.value ? "selected" : ""
                  }`}
                >
                  <div className={`d-flex gap-2 align-items-center`}>
                    <img src={option.src} height={30} />
                    <div>
                      <div className="fw-bold">{option.label}</div>
                      <div className="text-muted text-xs">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </DropdowntBtnContainer>
  );
};

return (
  <div>
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
        <VerificationBtn />
      )}
    </div>
  </div>
);
