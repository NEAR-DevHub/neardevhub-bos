const author = context.accountId;
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

const [category, setCategory] = useState(null);
const [name, setName] = useState(null);
const [description, setDescription] = useState(null);
const [summary, setSummary] = useState(null);
const [consent, setConsent] = useState({ toc: false, coc: false });
const [linkedProposals, setLinkedProposals] = useState([]);
const [fundingAmount, setFundingAmount] = useState([]);
const [receiverAccount, setReceiverAccount] = useState(null);
const [requestedSponsor, setRequestedSponsor] = useState(null);
const [requestedSponsorshipAmount, setRequestedSponsorshipAmount] =
  useState(null);
const [requestedSponsorshipToken, setRequestedSponsorshipToken] = useState(
  tokensOptions[0]
);
const [supervisor, setSupervisor] = useState(null);

const InputContainer = ({ heading, description, children }) => {
  return (
    <div className="d-flex flex-column gap-2">
      <b className="h6 mb-0">{heading}</b>
      {description && <div className="text-muted text-sm">{description}</div>}
      {children}
    </div>
  );
};

const CheckBox = ({ value, isChecked, label }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <input
        class="form-check-input"
        type="checkbox"
        value={value}
        checked={isChecked}
      />
      <label class="form-check-label text-sm">{label}</label>
    </div>
  );
};

const WarningImg =
  "https://ipfs.near.social/ipfs/bafkreieq4222tf3hkbccfnbw5kpgedm3bf2zcfgzbnmismxav2phqdwd7q";

const descriptionPlaceholder = `-- REQUIRED FIELDS // Please remove this line--

  **PROJECT DETAILS**
  Provide a clear overview of the scope, deliverables, and expected outcomes. What benefits will it provide to the NEAR community? How will you measure success?
  
  **TIMELINE**
  Describe the timeline of your project and key milestones, specifying if the work was already complete or not. Include your plans for reporting progress to the community.
  -- OPTIONAL FIELDS // Please remove this line--
  **TEAM**
  Provide a list of who will be working on the project along with their relevant skillset and experience. You may include links to portfolios or profiles to help the community get to know who the DAO will fund and how their backgrounds will contribute to your project’s success.
  
  **BUDGET BREAKDOWN**
  Include a detailed breakdown on how you will use the funds and include rate justification. Our community values transparency, so be as specific as possible.`;

return (
  <Container className="w-100 p-4 d-flex flex-column gap-3">
    <Heading>Create Proposal</Heading>
    <div className="mt-4 d-flex gap-4">
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
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  skipPaddingGap: true,
                  placeholder: "Enter title here.",
                  inputProps: {
                    max: 80,
                    required: true,
                    // disabled: true
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
                  onChange: (e) => setSummary(e.target.value),
                  skipPaddingGap: true,
                  placeholder: "Enter summary here.",
                  inputProps: {
                    max: 500,
                    required: true,
                    // disabled: true
                  },
                }}
              />
            </InputContainer>
            <InputContainer
              heading="Description"
              description="Expand on your summary with any relevant details like your contribution timeline, key milestones, team background, and a clear breakdown of how the funds will be used. Proposals should be simple and clear (e.g. 1 month). For more complex projects, treat each milestone as a separate proposal."
            >
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Compose"}
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
                />
                <CheckBox
                  value={consent.coc}
                  label="I’ve read DevHub’s Code of Conduct and commit to honoring it"
                  isChecked={consent.coc}
                />
              </div>
            </InputContainer>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="h5 text-muted">Author Details</div>
        <div className="d-flex flex-column gap-4">
          <InputContainer heading="Author">
            <Widget
              src="${REPL_MOB}/widget/ProfileImage"
              props={{
                accountId: author,
                style: { height: "1.8em", width: "1.8em", minWidth: "1.8em" },
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
                    must complete KYC/KYB verification using Fractal, a trusted
                    identity verification solution. This helps others trust
                    transactions with your account. Click "Get Verified" to
                    start. <br />
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
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDownWithSearch"
              props={{
                selectedValue: linkedProposals,
                onChange: (v) => setSender(v),
                options: tokensOptions,
                showSearch: false,
                defaultLabel: "treasury.near",
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
                value: summary,
                onChange: (e) => setSummary(e.target.value),
                skipPaddingGap: true,
                placeholder: "Enter amount",
                inputProps: {
                  type: "number",
                  // disabled: true
                },
              }}
            />
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
                placeholder: "DevDAO",
                onUpdate: setSupervisor,
              }}
            />
          </InputContainer>
        </div>
      </div>
    </div>
  </Container>
);
