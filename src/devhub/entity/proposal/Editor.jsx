const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
const { getDepositAmountForWriteAccess } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.common"
);
const draftKey = "PROPOSAL_EDIT";
getDepositAmountForWriteAccess || (getDepositAmountForWriteAccess = () => {});
href || (href = () => {});

const { id, timestamp } = props;

const isEditPage = typeof id === "string";
const author = context.accountId;

if (!author) {
  return (
    <Widget src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.LoginScreen"} />
  );
}
let editProposalData = null;
let draftProposalData = null;

if (isEditPage) {
  editProposalData = Near.view("${REPL_PROPOSALS_CONTRACT}", "get_proposal", {
    proposal_id: parseInt(id),
  });
}

const Container = styled.div`
  .text-sm {
    font-size: 13px;
  }

  .flex-2 {
    flex: 2;
  }

  .flex-1 {
    flex: 1;
  }
  .bg-grey {
    background-color: #f4f4f4;
  }

  .border-bottom {
    border-bottom: 1px solid grey;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .proposal-card {
    &:hover {
      background-color: #f4f4f4;
    }
  }

  .border-1 {
    border: 1px solid #e2e6ec;
  }
  .green-btn {
    background-color: #04a46e !important;
    border: none;
    color: white;
    &:active {
      color: white;
    }
  }

  .black-btn {
    background-color: #000 !important;
    border: none;
    color: white;
    &:active {
      color: white;
    }
  }

  .dropdown-toggle:after {
    position: absolute;
    top: 46%;
    right: 5%;
  }

  .drop-btn {
    max-width: none !important;
  }

  .dropdown-menu {
    width: 100%;
  }

  .input-icon {
    display: flex;
    height: 100%;
    align-items: center;
    border-right: 1px solid #dee2e6;
    padding-right: 10px;
  }

  /* Tooltip container */
  .custom-tooltip {
    position: relative;
    display: inline-block;
  }

  /* Tooltip text */
  .custom-tooltip .tooltiptext {
    visibility: hidden;
    width: 250px;
    background-color: #fff;
    color: #6c757d;
    text-align: center;
    padding: 10px;
    border-radius: 6px;
    font-size: 12px;
    border: 0.2px solid #6c757d;

    /* Position the tooltip text */
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: -30px;

    /* Fade in tooltip */
    opacity: 0;
    transition: opacity 0.3s;
  }

  /* Tooltip arrow */
  .custom-tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 15%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .custom-tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

  .form-check-input:checked {
    background-color: #04a46e !important;
    border-color: #04a46e !important;
  }

  .gap-6 {
    gap: 2.5rem;
  }
`;

const Heading = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const tokenMapping = {
  NEAR: "NEAR",
  USDT: {
    NEP141: {
      address: "usdt.tether-token.near",
    },
  },
  USDC: {
    NEP141: {
      address:
        "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    },
  },
};

const tokensOptions = [
  { label: "NEAR", value: tokenMapping.NEAR },
  { label: "USDT", value: tokenMapping.USDT },
  {
    label: "USDC",
    value: tokenMapping.USDC,
  },
];

const devdaoAccount = "neardevdao.near";

const [category, setCategory] = useState(null);
const [title, setTitle] = useState(null);
const [description, setDescription] = useState(null);
const [summary, setSummary] = useState(null);
const [consent, setConsent] = useState({ toc: false, coc: false });
const [linkedProposals, setLinkedProposals] = useState([]);
const [receiverAccount, setReceiverAccount] = useState(context.accountId);
const [requestedSponsor, setRequestedSponsor] = useState(devdaoAccount);
const [requestedSponsorshipAmount, setRequestedSponsorshipAmount] =
  useState(null);
const [requestedSponsorshipToken, setRequestedSponsorshipToken] = useState(
  tokensOptions[2]
);
const [supervisor, setSupervisor] = useState(null);
const [allowDraft, setAllowDraft] = useState(true);

const [proposalsOptions, setProposalsOptions] = useState([]);
const proposalsData = Near.view("${REPL_PROPOSALS_CONTRACT}", "get_proposals");
const [loading, setLoading] = useState(true);

if (allowDraft) {
  draftProposalData = Storage.privateGet(draftKey);
}

const memoizedDraftData = useMemo(
  () => ({
    id: editProposalData.id ?? null,
    snapshot: {
      name: title,
      description: description,
      category: category,
      summary: summary,
      requested_sponsorship_amount: requestedSponsorshipAmount,
      requested_sponsorship_token: requestedSponsorshipToken.value,
      receiver_account: receiverAccount,
      supervisor: supervisor,
      requested_sponsor: requestedSponsor,
    },
  }),
  [
    title,
    summary,
    description,
    category,
    requestedSponsorshipAmount,
    requestedSponsorshipToken,
    receiverAccount,
    supervisor,
    requestedSponsor,
  ]
);

useEffect(() => {
  let data = editProposalData || JSON.parse(draftProposalData);
  let snapshot = data.snapshot;
  if (allowDraft && data) {
    if (timestamp) {
      snapshot =
        data.snapshot_history.find((item) => item.timestamp === timestamp) ??
        data.snapshot;
    }
    if (
      draftProposalData &&
      editProposalData &&
      editProposalData.id === JSON.parse(draftProposalData).id
    ) {
      snapshot = {
        ...editProposalData.snapshot,
        ...JSON.parse(draftProposalData).snapshot,
      };
    }
    setCategory(snapshot.category);
    setTitle(snapshot.name);
    setSummary(snapshot.summary);
    setDescription(snapshot.description);
    setConsent({ toc: true, coc: true });

    setReceiverAccount(snapshot.receiver_account);
    setRequestedSponsor(snapshot.requested_sponsor);
    setRequestedSponsorshipAmount(snapshot.requested_sponsorship_amount);
    setSupervisor(snapshot.supervisor);

    const token = tokensOptions.find(
      (item) =>
        JSON.stringify(item.value) ===
        JSON.stringify(snapshot.requested_sponsorship_token)
    );
    setRequestedSponsorshipToken(token);
  }
  setLoading(false);
}, [editProposalData, draftProposalData]);

useEffect(() => {
  if (draftProposalData) {
    setAllowDraft(false);
  }
}, [draftProposalData]);

useEffect(() => {
  const handler = setTimeout(() => {
    Storage.privateSet(draftKey, JSON.stringify(memoizedDraftData));
  }, 3000);

  return () => {
    clearTimeout(handler);
  };
}, [memoizedDraftData, draftKey, draftProposalData]);

useEffect(() => {
  if (
    proposalsOptions.length > 0 &&
    editProposalData &&
    editProposalData?.snapshot?.linked_proposals?.length > 0
  ) {
    let data = [];
    editProposalData.snapshot.linked_proposals.map((item) => {
      data.push(proposalsOptions.find((i) => i.value === item));
    });
    setLinkedProposals(data);
  }
}, [editProposalData, proposalsOptions]);

useEffect(() => {
  if (
    proposalsData !== null &&
    Array.isArray(proposalsData) &&
    !proposalsOptions.length
  ) {
    const data = [];
    for (const prop of proposalsData) {
      data.push({
        label: "Id " + prop.id + " : " + prop.snapshot.name,
        value: prop.id,
      });
    }
    setProposalsOptions(data);
  }
}, [proposalsData]);

const InputContainer = ({ heading, description, children }) => {
  return (
    <div className="d-flex flex-column gap-2">
      <b className="h6 mb-0">{heading}</b>
      {description && <div className="text-muted text-sm">{description}</div>}
      {children}
    </div>
  );
};

const CheckBox = ({ value, isChecked, label, onClick }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <input
        class="form-check-input"
        type="checkbox"
        value={value}
        checked={isChecked}
        onChange={(e) => onClick(e.target.checked)}
      />
      <label class="form-check-label text-sm">{label}</label>
    </div>
  );
};

const DraftBtnContainer = styled.div`
  font-size: 14px;
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

  .options-card {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 0.5rem;
    z-index: 9999;
  }

  .option {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.3s ease;
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
    background-color: #f8f8f8 !important;
    cursor: not-allowed !important;
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
`;
const [isDraftBtnOpen, setDraftBtnOpen] = useState(false);
const [selectedStatus, setSelectedStatus] = useState("draft");
const [isReviewModalOpen, setReviewModal] = useState(false);
const [amountError, setAmountError] = useState(null);

const DraftBtn = () => {
  const btnOptions = [
    { iconColor: "grey", label: "Submit Draft", value: "draft" },
    { iconColor: "green", label: "Ready for Review", value: "review" },
  ];

  const handleOptionClick = (option) => {
    setDraftBtnOpen(false);
    setSelectedStatus(option.value);
  };

  const toggleDropdown = () => {
    setDraftBtnOpen(!isDraftBtnOpen);
  };

  const handleSubmit = () => {
    const isDraft = selectedStatus === "draft";
    if (isDraft) {
      onSubmit({ isDraft });
      cleanDraft();
    } else {
      setReviewModal(true);
    }
  };

  const selectedOption = btnOptions.find((i) => i.value === selectedStatus);
  const disabled =
    !title ||
    !description ||
    !summary ||
    !category ||
    !requestedSponsorshipAmount ||
    !receiverAccount ||
    !requestedSponsor ||
    !consent.toc ||
    !consent.coc;

  return (
    <DraftBtnContainer>
      <div
        className="custom-select"
        tabIndex="0"
        onBlur={() => setDraftBtnOpen(false)}
      >
        <div
          className={
            "select-header d-flex gap-1 align-items-center " +
            (disabled && "disabled")
          }
        >
          <div
            onClick={() => !disabled && handleSubmit()}
            className="p-2 d-flex gap-2 align-items-center "
          >
            <div className={"circle " + selectedOption.iconColor}></div>
            <div className={`selected-option`}>{selectedOption.label}</div>
          </div>
          <div
            className="h-100 p-2"
            style={{ borderLeft: "1px solid #ccc" }}
            onClick={!disabled && toggleDropdown}
          >
            <i class={`bi bi-chevron-${isOpen ? "up" : "down"}`}></i>
          </div>
        </div>

        {isDraftBtnOpen && (
          <div className="options-card">
            {btnOptions.map((option) => (
              <div
                key={option.value}
                className={`option d-flex gap-2 align-items-center ${
                  selectedOption.value === option.value ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <div className={"circle " + option.iconColor}></div>
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </DraftBtnContainer>
  );
};

let grantNotify = Near.view(
  "${REPL_SOCIAL_CONTRACT}",
  "is_write_permission_granted",
  {
    predecessor_id: "${REPL_DEVHUB_LEGACY}",
    key: context.accountId + "/index/notify",
  }
);

const userStorageDeposit = Near.view(
  "${REPL_SOCIAL_CONTRACT}",
  "storage_balance_of",
  {
    account_id: context.accountId,
  }
);

const onSubmit = ({ isDraft }) => {
  const linkedProposalsIds = linkedProposals.map((item) => item.value) ?? [];
  const body = {
    proposal_body_version: "V0",
    name: title,
    description: description,
    category: category,
    summary: summary,
    linked_proposals: linkedProposalsIds,
    requested_sponsorship_amount: requestedSponsorshipAmount,
    requested_sponsorship_token: requestedSponsorshipToken.value,
    receiver_account: receiverAccount,
    supervisor: supervisor,
    requested_sponsor: requestedSponsor,
    payouts: [],
    timeline: isDraft
      ? { status: "DRAFT" }
      : {
          status: "REVIEW",
          sponsor_requested_review: true,
          reviewer_completed_attestation: false,
        },
  };
  const args = { labels: [], body: body };
  if (isEditPage) {
    args["id"] = editProposalData.id;
  }
  const calls = [
    {
      contractName: "${REPL_PROPOSALS_CONTRACT}",
      methodName: isEditPage ? "edit_proposal" : "add_proposal",
      args: args,
      gas: 270000000000000,
    },
  ];
  // if (grantNotify === false) {
  //   calls.unshift({
  //     contractName: "${REPL_SOCIAL_CONTRACT}",
  //     methodName: "grant_write_permission",
  //     args: {
  //       predecessor_id: "${REPL_DEVHUB_LEGACY}",
  //       keys: [context.accountId + "/index/notify"]
  //     },
  //     gas: Big(10).pow(14),
  //     deposit: getDepositAmountForWriteAccess(userStorageDeposit)
  //   });
  // }
  Near.call(calls);
};

function cleanDraft() {
  Storage.privateSet(draftKey, null);
}

const WarningImg =
  "https://ipfs.near.social/ipfs/bafkreieq4222tf3hkbccfnbw5kpgedm3bf2zcfgzbnmismxav2phqdwd7q";

const descriptionPlaceholder = `**PROJECT DETAILS**
Provide a clear overview of the scope, deliverables, and expected outcomes. What benefits will it provide to the NEAR community? How will you measure success?

**TIMELINE**
Describe the timeline of your project and key milestones, specifying if the work was already complete or not. Include your plans for reporting progress to the community.

OPTIONAL FIELDS

**TEAM**
Provide a list of who will be working on the project along with their relevant skillset and experience. You may include links to portfolios or profiles to help the community get to know who the DAO will fund and how their backgrounds will contribute to your project’s success.

**BUDGET BREAKDOWN**
Include a detailed breakdown on how you will use the funds and include rate justification. Our community values transparency, so be as specific as possible.
`;

if (loading) {
  return (
    <div
      style={{ height: "45vh" }}
      className="d-flex justify-content-center align-items-center w-100"
    >
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner"}
      />
    </div>
  );
}

return (
  <Container className="w-100 py-4 px-2 d-flex flex-column gap-3">
    <Heading>{isEditPage ? "Edit" : "Create"} Proposal</Heading>
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.ConfirmReviewModal"}
      props={{
        isOpen: isReviewModalOpen,
        onCancelClick: () => setReviewModal(false),
        onReviewClick: () => {
          setReviewModal(false);
          cleanDraft();
          onSubmit({ isDraft: false });
        },
      }}
    />
    <div className="card card-body p-4 rounded-0">
      <div className="d-flex gap-6">
        <div className="flex-2">
          <div className="d-flex gap-2">
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
              props={{
                accountId: author,
              }}
            />
            <div className="d-flex flex-column gap-4">
              <InputContainer
                heading="Category"
                description="Select the category that best aligns with your contribution to the NEAR developer community. Need guidance? See Funding Docs."
              >
                <Widget
                  src={
                    "${REPL_DEVHUB}/widget/devhub.entity.proposal.CategoryDropdown"
                  }
                  props={{
                    selectedValue: category,
                    onChange: setCategory,
                  }}
                />
              </InputContainer>
              <InputContainer
                heading="Title"
                description="Highlight the essence of your proposal in a few words. This will appear on your proposal’s detail page and the main proposal feed. Keep it short, please :)"
              >
                <Widget
                  src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
                  props={{
                    className: "flex-grow-1",
                    value: title,
                    onChange: (e) => {
                      setTitle(e.target.value);
                    },
                    skipPaddingGap: true,
                    placeholder: "Enter title here.",
                    inputProps: {
                      max: 80,
                      required: true,
                    },
                  }}
                />
              </InputContainer>
              <InputContainer
                heading="Summary"
                description="Explain your proposal briefly. This is your chance to make a good first impression on the community. Include what needs or goals your work will address, your solution, and the benefit for the NEAR developer community."
              >
                <Widget
                  src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
                  props={{
                    className: "flex-grow-1",
                    value: summary,
                    multiline: true,
                    onChange: (e) => {
                      setSummary(e.target.value);
                    },
                    skipPaddingGap: true,
                    placeholder: "Enter summary here.",
                    inputProps: {
                      max: 500,
                      required: true,
                    },
                  }}
                />
              </InputContainer>
              <InputContainer
                heading="Description"
                description="Expand on your summary with any relevant details like your contribution timeline, key milestones, team background, and a clear breakdown of how the funds will be used. Proposals should be simple and clear (e.g. 1 month). For more complex projects, treat each milestone as a separate proposal."
              >
                <Widget
                  src={
                    "${REPL_DEVHUB}/widget/devhub.components.molecule.Compose"
                  }
                  props={{
                    data: description,
                    onChange: setDescription,
                    autocompleteEnabled: true,
                    autoFocus: false,
                    placeholder: descriptionPlaceholder,
                  }}
                />
              </InputContainer>
              <InputContainer
                heading="Final Consent"
                description="Expand on your summary with any relevant details like your contribution timeline, key milestones, team background, and a clear breakdown of how the funds will be used. Proposals should be simple and clear (e.g. 1 month). For more complex projects, treat each milestone as a separate proposal."
              >
                <div className="d-flex flex-column gap-2">
                  <CheckBox
                    value={consent.toc}
                    label="I’ve agree to DevHub’s Terms and Conditions and commit to honoring it"
                    isChecked={consent.toc}
                    onClick={(value) =>
                      setConsent((prevConsent) => ({
                        ...prevConsent,
                        toc: value,
                      }))
                    }
                  />
                  <CheckBox
                    value={consent.coc}
                    label="I’ve read DevHub’s Code of Conduct and commit to honoring it"
                    isChecked={consent.coc}
                    onClick={() =>
                      setConsent((value) => ({
                        ...prevConsent,
                        coc: value,
                      }))
                    }
                  />
                </div>
              </InputContainer>
              <div className="d-flex justify-content-end gap-2">
                <Link
                  to={
                    isEditPage
                      ? href({
                          widgetSrc: "${REPL_DEVHUB}/widget/app",
                          params: {
                            page: "proposal",
                            id: parseInt(id),
                          },
                        })
                      : href({
                          widgetSrc: "${REPL_DEVHUB}/widget/app",
                          params: {
                            page: "proposals",
                          },
                        })
                  }
                >
                  <Widget
                    src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                    props={{
                      classNames: {
                        root: "d-flex btn btn-outline-danger shadow-none border-0",
                      },
                      label: "Cancel",
                      onClick: cleanDraft,
                    }}
                  />
                </Link>
                <DraftBtn />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="h5 text-muted">Author Details</div>
          <div className="d-flex flex-column gap-4">
            <InputContainer heading="Author">
              <Widget
                src="mob.near/widget/Profile.ShortInlineBlock"
                props={{
                  accountId: author,
                }}
              />
            </InputContainer>
            <InputContainer
              heading={
                <div className="d-flex gap-2 align-items-center">
                  Verification Status
                  <div className="custom-tooltip">
                    <i class="bi bi-info-circle-fill"></i>
                    <span class="tooltiptext">
                      To get approved and receive payments on our platform, you
                      must complete KYC/KYB verification using Fractal, a
                      trusted identity verification solution. This helps others
                      trust transactions with your account. Click "Get Verified"
                      to start. <br />
                      <br />
                      Once verified, your profile will display a badge, which is
                      valid for 365 days from the date of your verification. You
                      must renew your verification upon expiration OR if any of
                      your personal information changes.
                    </span>
                  </div>
                </div>
              }
              description=""
            >
              <div className="border-1 p-3 rounded-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-4 ">
                    <img
                      className="align-self-center"
                      src={WarningImg}
                      height={30}
                    />
                    <div className="d-flex flex-column justify-content-center">
                      <div className="h6 mb-0">Fractal</div>
                      <div className="text-muted text-sm">Not Verified</div>
                    </div>
                  </div>
                  <Widget
                    src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                    props={{
                      classNames: { root: "black-btn" },
                      label: (
                        <div className="d-flex align-items-center gap-1">
                          Get Verified
                          <i class="bi bi-box-arrow-up-right"></i>
                        </div>
                      ),
                    }}
                  />
                </div>
              </div>
            </InputContainer>
            <InputContainer
              heading={
                <div className="text-muted">Link Proposals (Optional)</div>
              }
              description="Link any relevant proposals (e.g. previous milestones)."
            >
              {linkedProposals.map((proposal) => {
                return (
                  <div className="d-flex gap-2 align-items-center">
                    <a
                      className="text-decoration-underline"
                      href={href({
                        widgetSrc: "${REPL_DEVHUB}/widget/app",
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
                        const updatedLinkedProposals = linkedProposals.filter(
                          (item) => item.value !== proposal.value
                        );
                        setLinkedProposals(updatedLinkedProposals);
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
                    if (
                      !linkedProposals.some((item) => item.value === v.value)
                    ) {
                      setLinkedProposals([...linkedProposals, v]);
                    }
                  },
                  options: proposalsOptions,
                  showSearch: true,
                  searchInputPlaceholder: "Search by Id",
                  defaultLabel: "Search proposals",
                  searchByValue: true,
                }}
              />
            </InputContainer>
            <div className="h5 text-muted">Funding Details</div>
            <InputContainer
              heading="Total Amount"
              description="Enter the exact amount you are seeking. See Funding Documentation for guidelines."
            >
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
                props={{
                  className: "flex-grow-1",
                  value: requestedSponsorshipAmount,
                  onChange: (e) => {
                    const inputValue = e.target.value;
                    // Check if the input value is a whole number
                    if (!Number.isInteger(Number(inputValue))) {
                      setAmountError("Please enter a whole number.");
                    } else {
                      setRequestedSponsorshipAmount(e.target.value);
                      setAmountError("");
                    }
                  },
                  skipPaddingGap: true,
                  placeholder: "Enter amount",
                  inputProps: {
                    type: "number",
                  },
                }}
              />
              {amountError && (
                <div style={{ color: "red" }} className="text-sm">
                  {amountError}
                </div>
              )}
            </InputContainer>
            <InputContainer heading="Currency" description="">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown"
                props={{
                  options: tokensOptions,
                  selectedValue: requestedSponsorshipToken,
                  onUpdate: (v) => {
                    setRequestedSponsorshipToken(v);
                  },
                }}
              />
            </InputContainer>

            <InputContainer
              heading="NEAR Wallet Address"
              description="Enter the address that will receive the funds. We’ll need this to send a test transaction once your proposal is approved."
            >
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.proposal.AccountInput"
                props={{
                  value: receiverAccount,
                  placeholder: "DevDAO",
                  onUpdate: setReceiverAccount,
                }}
              />
            </InputContainer>
            <InputContainer heading="Requested Sponsor" description="">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.proposal.AccountInput"
                props={{
                  value: requestedSponsor,
                  placeholder: "DevDAO",
                  onUpdate: setRequestedSponsor,
                }}
              />
            </InputContainer>
            <InputContainer heading="Supervisor (Optional)" description="">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.proposal.AccountInput"
                props={{
                  value: supervisor,
                  placeholder: "Enter Supervisor",
                  onUpdate: setSupervisor,
                }}
              />
            </InputContainer>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
