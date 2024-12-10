const { RFP_TIMELINE_STATUS, parseJSON } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/core.common`
) || { RFP_TIMELINE_STATUS: {}, parseJSON: () => {} };
const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);

const draftKey = "INFRA_RFP_EDIT";
href || (href = () => {});

const { getGlobalLabels } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };
const { id, timestamp } = props;

const isEditPage = typeof id === "string";
const author = context.accountId;
const FundingDocs =
  "https://github.com/near/Infrastructure-Working-Group/wiki/Funding-Process-%E2%80%90-Company";
const CoCDocs =
  "https://github.com/near/Infrastructure-Working-Group/wiki/Code-Of-Conduct";

const rfpLabelOptions = getGlobalLabels();
const isAllowedToWriteRfp = Near.view(
  "${REPL_TREASURY_TEMPLAR_CONTRACT}",
  "is_allowed_to_write_rfps",
  {
    editor: context.accountId,
  }
);

if (!author || !isAllowedToWriteRfp) {
  return (
    <Widget src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.LoginScreen`} />
  );
}

let editRfpData = null;
let draftRfpData = null;

if (isEditPage) {
  editRfpData = Near.view(`${REPL_TREASURY_TEMPLAR_CONTRACT}`, "get_rfp", {
    rfp_id: parseInt(id),
  });
}

const Container = styled.div`
  input {
    font-size: 14px !important;
  }

  .card.no-border {
    border-left: none !important;
    border-right: none !important;
    margin-bottom: -3.5rem;
  }

  textarea {
    font-size: 14px !important;
  }

  .full-width-div {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }

  .text-sm {
    font-size: 13px;
  }

  .h5 {
    font-size: 18px !important;
  }

  @media screen and (max-width: 768px) {
    .h6 {
      font-size: 14px !important;
    }

    .h5 {
      font-size: 16px !important;
    }

    .text-sm {
      font-size: 11px;
    }

    .gap-6 {
      gap: 0.5rem !important;
    }
  }

  .border-bottom {
    border-bottom: var(--bs-card-border-width) solid var(--bs-card-border-color);
  }

  .text-xs {
    font-size: 10px;
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

  .border-1 {
    border: 1px solid #e2e6ec;
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
    border-radius: 0.375rem !important;
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

  a.no-space {
    display: inline-block;
  }

  .fw-light-bold {
    font-weight: 600 !important;
  }

  .disabled .circle {
    opacity: 0.5;
  }

  .circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .grey {
    background-color: #818181;
  }

  @media screen and (max-width: 970px) {
    .gap-6 {
      gap: 1.5rem !important;
    }
  }

  @media screen and (max-width: 570px) {
    .gap-6 {
      gap: 0.5rem !important;
    }
  }
`;

const Heading = styled.div`
  font-size: 24px;
  font-weight: 700;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

function getTimestamp(date) {
  // in nanoseconds
  const parsedDate = date ? new Date(date) : new Date();
  return Math.floor(parsedDate.getTime() * 1000000).toString();
}

function getDate(timestamp) {
  const stamp =
    !timestamp || timestamp === "0" || timestamp === "NaN" ? null : timestamp;
  return new Date(parseFloat(stamp / 1000000)).toISOString().split("T")[0];
}

const [labels, setLabels] = useState([]);
const [title, setTitle] = useState(null);
const [description, setDescription] = useState(null);
const [summary, setSummary] = useState(null);
const [consent, setConsent] = useState({ coc: false });
const [submissionDeadline, setSubmissionDeadline] = useState(null);
const [allowDraft, setAllowDraft] = useState(true);

const [loading, setLoading] = useState(true);
const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false);
const [isDraftBtnOpen, setDraftBtnOpen] = useState(false);

const [showRfpViewModal, setShowRfpViewModal] = useState(false); // when user creates/edit a RFP and confirm the txn, this is true
const [rfpId, setRfpId] = useState(null);
const [rfpIdsArray, setRfpIdsArray] = useState(null);
const [isTxnCreated, setCreateTxn] = useState(false);
const [oldRfpData, setOldRfpData] = useState(null);
const [timeline, setTimeline] = useState({
  status: RFP_TIMELINE_STATUS.ACCEPTING_SUBMISSIONS,
});
const [isCancelModalOpen, setCancelModal] = useState(false);

if (allowDraft) {
  draftRfpData = Storage.privateGet(draftKey);
}

const memoizedDraftData = useMemo(
  () => ({
    id: editRfpData.id ?? null,
    snapshot: {
      name: title,
      description: description,
      labels: labels,
      summary: summary,
      submission_deadline: getTimestamp(submissionDeadline),
    },
  }),
  [title, summary, description, submissionDeadline, labels]
);

useEffect(() => {
  if (allowDraft) {
    let data = editRfpData || JSON.parse(draftRfpData);
    let snapshot = data.snapshot;
    if (data) {
      if (timestamp) {
        snapshot =
          data.snapshot_history.find((item) => item.timestamp === timestamp) ??
          data.snapshot;
      }
      if (
        draftRfpData &&
        editRfpData &&
        editRfpData.id === JSON.parse(draftRfpData).id
      ) {
        snapshot = {
          ...editRfpData.snapshot,
          ...JSON.parse(draftRfpData).snapshot,
        };
      }
      setRfpId(data.id);
      setLabels(snapshot.labels);
      setTitle(snapshot.name);
      setSummary(snapshot.summary);
      setDescription(snapshot.description);
      setSubmissionDeadline(getDate(snapshot.submission_deadline));
      setTimeline(parseJSON(snapshot.timeline));
      if (isEditPage) {
        setConsent({ coc: true });
      }
    }
  }
}, [editRfpData, draftRfpData, allowDraft]);

// show loader until LS data is set in state
useEffect(() => {
  const handler = setTimeout(() => {
    setAllowDraft(false);
    setLoading(false);
  }, 200);

  return () => clearTimeout(handler);
}, []);

useEffect(() => {
  if (showRfpViewModal) {
    return;
  }
  setDisabledSubmitBtn(
    !title ||
      !description ||
      !summary ||
      !(labels ?? []).length ||
      !submissionDeadline ||
      !consent.coc
  );
  const handler = setTimeout(() => {
    Storage.privateSet(draftKey, JSON.stringify(memoizedDraftData));
  }, 10000);

  return () => clearTimeout(handler);
}, [
  memoizedDraftData,
  draftKey,
  draftRfpData,
  consent,
  isTxnCreated,
  showRfpViewModal,
]);

const InputContainer = ({ heading, description, children }) => {
  return (
    <div className="d-flex flex-column gap-1 gap-sm-2 w-100">
      <b className="h6 mb-0">{heading}</b>
      {description && (
        <div className="text-muted w-100 text-sm">{description}</div>
      )}
      {children}
    </div>
  );
};

function cleanDraft() {
  Storage.privateSet(draftKey, null);
}

function checkIfLatestRFPMatchesTitleAndDescription() {
  Near.asyncView("${REPL_TREASURY_TEMPLAR_CONTRACT}", "get_all_rfp_ids").then(
    (rfpIds) => {
      const latestRFPId = rfpIds[rfpIds.length - 1];
      Near.asyncView("${REPL_TREASURY_TEMPLAR_CONTRACT}", "get_rfp", {
        rfp_id: latestRFPId,
      }).then((latestRFP) => {
        if (
          latestRFP.snapshot.name === title &&
          latestRFP.snapshot.description === description
        ) {
          setCreateTxn(false);
          setRfpId(rfpIds[rfpIds.length - 1]);
          setShowRfpViewModal(true);
        } else {
          setTimeout(() => checkIfLatestRFPMatchesTitleAndDescription(), 500);
        }
      });
    }
  );
}

// show RFP created after txn approval for popup wallet
useEffect(() => {
  if (isTxnCreated) {
    if (editRfpData) {
      setOldRfpData(editRfpData);
      if (
        editRfpData &&
        typeof editRfpData === "object" &&
        oldRfpData &&
        typeof oldRfpData === "object" &&
        JSON.stringify(editRfpData) !== JSON.stringify(oldRfpData)
      ) {
        cleanDraft();
        setCreateTxn(false);
        setRfpId(editRfpData.id);
        setShowRfpViewModal(true);
      }
    } else {
      checkIfLatestRFPMatchesTitleAndDescription();
    }
  }
});

useEffect(() => {
  if (props.transactionHashes) {
    setLoading(true);
    useCache(
      () =>
        asyncFetch("${REPL_RPC_URL}", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "dontcare",
            method: "tx",
            params: [props.transactionHashes, context.accountId],
          }),
        }).then((transaction) => {
          const transaction_method_name =
            transaction?.body?.result?.transaction?.actions[0].FunctionCall
              .method_name;

          const is_edit_or_add_rfp_transaction =
            transaction_method_name == "add_rfp" ||
            transaction_method_name == "edit_rfp";

          if (is_edit_or_add_rfp_transaction) {
            cleanDraft();
            setShowRfpViewModal(true);
          }
          // show the latest created rfp to user
          if (transaction_method_name == "add_rfp") {
            useCache(
              () =>
                Near.asyncView(
                  "${REPL_TREASURY_TEMPLAR_CONTRACT}",
                  "get_all_rfp_ids"
                ).then((rfpIdsArray) => {
                  setRfpId(rfpIdsArray?.[rfpIdsArray?.length - 1]);
                }),
              props.transactionHashes + "rfpIds",
              { subscribe: false }
            );
          } else {
            setRfpId(id);
          }
          setLoading(false);
        }),
      props.transactionHashes + context.accountId,
      { subscribe: false }
    );
  } else {
    if (showRfpViewModal) {
      setShowRfpViewModal(false);
    }
  }
}, [props.transactionHashes]);

const onSubmit = () => {
  setCreateTxn(true);
  const body = {
    rfp_body_version: "V0",
    name: title,
    description: description,
    summary: summary,
    submission_deadline: getTimestamp(submissionDeadline),
    timeline:
      Object.keys(timeline || {}).length > 0
        ? timeline
        : { status: RFP_TIMELINE_STATUS.ACCEPTING_SUBMISSIONS },
  };
  const args = { labels: (labels ?? []).map((i) => i.value), body: body };
  if (isEditPage) {
    args["id"] = editRfpData.id;
  }

  Near.call([
    {
      contractName: "${REPL_TREASURY_TEMPLAR_CONTRACT}",
      methodName: isEditPage ? "edit_rfp" : "add_rfp",
      args: args,
      gas: 270000000000000,
    },
  ]);
};

if (loading) {
  return (
    <div
      style={{ height: "50vh" }}
      className="d-flex justify-content-center align-items-center w-100"
    >
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner`}
      />
    </div>
  );
}

const [collapseState, setCollapseState] = useState({});

const CollapsibleContainer = ({ title, children, noPaddingTop }) => {
  return (
    <div
      className={
        "border-bottom py-4 " +
        (noPaddingTop && "pt-0 ") +
        (collapseState[title] && " pb-0")
      }
    >
      <div className={"d-flex justify-content-between "}>
        <div className="h5 text-muted mb-2 mb-sm-3">{title}</div>
        <div
          className="d-flex d-sm-none cursor-pointer"
          onClick={() =>
            setCollapseState((prevState) => ({
              ...prevState,
              [title]: !prevState[title],
            }))
          }
        >
          {!collapseState[title] ? (
            <i className="bi bi-chevron-up h4"></i>
          ) : (
            <i className="bi bi-chevron-down h4"></i>
          )}
        </div>
      </div>
      <div className={!collapseState[title] ? "" : "d-none"}>{children}</div>
    </div>
  );
};

const CategoryDropdown = useMemo(() => {
  return (
    <Widget
      src={`${REPL_TREASURY_TEMPLAR}/widget/components.molecule.MultiSelectCategoryDropdown`}
      props={{
        selected: labels,
        onChange: (v) => setLabels(v),
        disabled: false,
        availableOptions: rfpLabelOptions,
      }}
    />
  );
}, [draftRfpData]);

const TitleComponent = useMemo(() => {
  return (
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        value: title,
        onBlur: (e) => {
          setTitle(e.target.value);
        },
        skipPaddingGap: true,
        inputProps: {
          max: 80,
        },
      }}
    />
  );
}, [draftRfpData]);

const SummaryComponent = useMemo(() => {
  return (
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        value: summary,
        multiline: true,
        onBlur: (e) => {
          setSummary(e.target.value);
        },
        skipPaddingGap: true,
        inputProps: {
          max: 500,
        },
      }}
    />
  );
}, [draftRfpData]);

const DescriptionComponent = useMemo(() => {
  return (
    <Widget
      src={`${REPL_TREASURY_TEMPLAR}/widget/components.molecule.Compose`}
      props={{
        data: description,
        onChange: setDescription,
        autocompleteEnabled: true,
        autoFocus: false,
      }}
    />
  );
}, [draftRfpData]);

const ConsentComponent = useMemo(() => {
  return (
    <div className="d-flex flex-column gap-2">
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Checkbox`}
        props={{
          value: "coc",
          label: (
            <>
              I’ve read{" "}
              <a
                href={href({
                  widgetSrc: `${REPL_TREASURY_TEMPLAR}/widget/components.proposals.TermsAndConditions`,
                })}
                className="text-decoration-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Templar's Terms and Condition
              </a>
              and commit to honoring it
            </>
          ),
          isChecked: consent.coc,
          onClick: (value) =>
            setConsent((prevConsent) => ({
              ...prevConsent,
              coc: value,
            })),
        }}
      />
    </div>
  );
}, [draftRfpData]);

const SubmissionDeadline = useMemo(() => {
  return (
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
      props={{
        className: "flex-grow-1",
        value: submissionDeadline,
        onBlur: (e) => {
          setSubmissionDeadline(e.target.value);
        },
        skipPaddingGap: true,
        type: "date",
        inputProps: {
          required: true,
        },
      }}
    />
  );
}, [draftRfpData]);

return (
  <Container className="w-100 py-2 px-0 px-sm-2 d-flex flex-column gap-3">
    <Widget
      src={`${REPL_TREASURY_TEMPLAR}/widget/components.rfps.ViewRfpModal`}
      props={{
        isOpen: showRfpViewModal,
        isEdit: isEditPage,
        rfpId: rfpId,
      }}
    />
    <Widget
      src={`${REPL_TREASURY_TEMPLAR}/widget/components.rfps.ConfirmCancelModal`}
      props={{
        isOpen: isCancelModalOpen,
        onCancelClick: () => {
          setCancelModal(false);
          setTimeline({ status: RFP_TIMELINE_STATUS.EVALUATION });
        },
        onConfirmClick: (value) => {
          setCancelModal(false);
          onCancelRFP(value);
        },
        linkedProposalIds: editRfpData.snapshot.linked_proposals,
      }}
    />
    <Widget
      src={`${REPL_TREASURY_TEMPLAR}/widget/components.rfps.WarningModal`}
      props={{
        isOpen: isWarningModalOpen,
        onConfirmClick: () => {
          setWarningModal(false);
          setTimeline({ status: RFP_TIMELINE_STATUS.EVALUATION });
        },
      }}
    />
    <Heading className="px-2 px-sm-0">
      {isEditPage ? "Edit" : "Create"} RFP
    </Heading>
    <div className="card no-border rounded-0 px-2 p-lg-0 full-width-div">
      <div className="container-xl py-4 d-flex flex-wrap gap-6 w-100">
        <div
          style={{ minWidth: "350px" }}
          className="flex-2 w-100 order-2 order-md-1"
        >
          <div className="d-flex gap-3 w-100">
            <div className="d-none d-sm-flex">
              <img src={"${REPL_RFP_IMAGE}"} height={35} width={35} />
            </div>
            <div className="d-flex flex-column gap-4 w-100">
              <InputContainer
                heading="Category"
                description={
                  <>
                    Select the relevant categories to help users quickly
                    understand the nature of the need.
                  </>
                }
              >
                {CategoryDropdown}
              </InputContainer>
              <InputContainer
                heading="Title"
                description="Highlight the essence of your RFP in a few words. This will appear on your RFP’s detail page and the main RFP feed. Keep it short, please :)"
              >
                {TitleComponent}
              </InputContainer>
              <InputContainer
                heading="Summary"
                description="Explain your RFP briefly. What is the problem or need, desired outcome, and benefit to the NEAR developer community."
              >
                {SummaryComponent}
              </InputContainer>
              <InputContainer
                heading="Description"
                description={
                  "Expand on your summary with any relevant details like a detailed explanation of the problem and the expected solution, scope, and deliverables. Also include an estimate range for the project if you have a specific budget. And the selection criteria."
                }
              >
                {DescriptionComponent}
              </InputContainer>
              <InputContainer heading="Final Consent">
                {ConsentComponent}
              </InputContainer>
              <div className="d-flex justify-content-end gap-2 align-items-center">
                <Link
                  to={
                    isEditPage
                      ? href({
                          widgetSrc: `${REPL_TREASURY_TEMPLAR}/widget/portal`,
                          params: {
                            page: "rfp",
                            id: parseInt(id),
                          },
                        })
                      : href({
                          widgetSrc: `${REPL_TREASURY_TEMPLAR}/widget/portal`,
                          params: {
                            page: "rfps",
                          },
                        })
                  }
                >
                  <Widget
                    src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                    props={{
                      classNames: {
                        root: "d-flex h-100 text-muted fw-bold btn-outline shadow-none border-0 btn-sm",
                      },
                      label: "Discard Changes",
                      onClick: cleanDraft,
                    }}
                  />
                </Link>
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                  props={{
                    classNames: {
                      root: "d-flex h-100 fw-light-bold btn-outline shadow-none border-1",
                    },
                    label: (
                      <div className="d-flex align-items-center gap-2">
                        <div className="circle grey"></div> <div>Submit</div>
                      </div>
                    ),
                    onClick: onSubmit,
                    disabled: disabledSubmitBtn || isTxnCreated,
                    loading: isTxnCreated,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ minWidth: "350px" }}
          className="flex-1 w-100 order-1 order-md-2"
        >
          <CollapsibleContainer noPaddingTop={true}>
            <div className="d-flex flex-column gap-3 gap-sm-4">
              <InputContainer
                heading="Submission Deadline"
                description="Enter the deadline for submitting proposals."
              >
                {SubmissionDeadline}
              </InputContainer>
            </div>
          </CollapsibleContainer>
          <div className="my-2">
            <CollapsibleContainer title="Timeline">
              <Widget
                src={`${REPL_TREASURY_TEMPLAR}/widget/components.rfps.TimelineConfigurator`}
                props={{
                  timeline: timeline,
                  setTimeline: (v) => {
                    if (editRfpData.snapshot.timeline.status === v.status) {
                      return;
                    }
                    // if proposal selected timeline is selected and no approved proposals exist, show warning
                    if (
                      v.status === RFP_TIMELINE_STATUS.PROPOSAL_SELECTED &&
                      Array.isArray(approvedProposals) &&
                      !approvedProposals.length
                    ) {
                      setWarningModal(true);
                    }

                    if (v.status === RFP_TIMELINE_STATUS.CANCELLED) {
                      setCancelModal(true);
                    }
                    setTimeline(v);
                  },
                  disabled: isEditPage ? false : true,
                }}
              />
            </CollapsibleContainer>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
