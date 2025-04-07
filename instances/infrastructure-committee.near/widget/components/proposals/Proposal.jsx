const { PROPOSAL_TIMELINE_STATUS, parseJSON, isNumber } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/core.common`
) || {
  PROPOSAL_TIMELINE_STATUS: {},
  parseJSON: () => {},
  isNumber: () => {},
};

const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);
href || (href = () => {});
const { getGlobalLabels } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };

const { readableDate } = VM.require(
  `${REPL_DEVHUB}/widget/core.lib.common`
) || { readableDate: () => {} };

const accountId = context.accountId;
/*
  ---props---
  props.id: number;
  props.timestamp: number; optional
  accountId: string
  blockHeight:number
  */

const DecisionStage = [
  PROPOSAL_TIMELINE_STATUS.APPROVED,
  PROPOSAL_TIMELINE_STATUS.REJECTED,
  PROPOSAL_TIMELINE_STATUS.APPROVED_CONDITIONALLY,
];

const Container = styled.div`
  .full-width-div {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }

  .fw-bold {
    font-weight: 600 !important;
  }

  .card.no-border {
    border-left: none !important;
    border-right: none !important;
    margin-bottom: -3.5rem;
  }

  .description-box {
    font-size: 14px;
  }

  .draft-info-container {
    background-color: #ecf8fb;
  }

  .review-info-container {
    background-color: #fef6ee;
  }

  .text-sm {
    font-size: 13px !important;
  }

  .flex-1 {
    flex: 1;
  }

  .flex-3 {
    flex: 3;
  }

  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid grey;
  }

  .green-fill {
    background-color: rgb(4, 164, 110) !important;
    border-color: rgb(4, 164, 110) !important;
    color: white !important;
  }

  .yellow-fill {
    border-color: #ff7a00 !important;
  }

  .vertical-line {
    width: 2px;
    height: 180px;
    background-color: lightgrey;
  }

  @media screen and (max-width: 970px) {
    .vertical-line {
      height: 135px !important;
    }

    .vertical-line-sm {
      height: 70px !important;
    }

    .gap-6 {
      gap: 0.5rem !important;
    }
  }

  @media screen and (max-width: 570px) {
    .vertical-line {
      height: 180px !important;
    }

    .vertical-line-sm {
      height: 75px !important;
    }

    .gap-6 {
      gap: 0.5rem !important;
    }
  }

  .vertical-line-sm {
    width: 2px;
    height: 70px;
    background-color: lightgrey;
  }

  .form-check-input:disabled ~ .form-check-label,
  .form-check-input[disabled] ~ .form-check-label {
    opacity: 1;
  }

  .form-check-input {
    border-color: black !important;
  }

  .grey-btn {
    background-color: #687076;
    border: none;
    color: white;
  }

  .form-check-input:checked {
    background-color: #04a46e !important;
    border-color: #04a46e !important;
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

  .green-btn {
    background-color: #03ba16 !important;
    border: none;
    color: white;

    &:active {
      color: white;
    }
  }

  .gap-6 {
    gap: 2.5rem;
  }

  .border-vertical {
    border-top: var(--bs-border-width) var(--bs-border-style)
      var(--bs-border-color) !important;
    border-bottom: var(--bs-border-width) var(--bs-border-style)
      var(--bs-border-color) !important;
  }

  button.px-0 {
    padding-inline: 0px !important;
  }

  red-icon i {
    color: red;
  }

  input[type="radio"] {
    min-width: 13px;
  }
`;

const ProposalContainer = styled.div`
  border: 1px solid lightgrey;
  overflow: auto;
`;

const Header = styled.div`
  position: relative;
  background-color: #f4f4f4;
  height: 50px;

  .menu {
    position: absolute;
    right: 10px;
    top: 4px;
    font-size: 30px;
  }
`;

const Text = styled.p`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #687076;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -6px -6px 6px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  pointer-events: none;

  img {
    object-fit: cover;
    border-radius: 40px;
    width: 100%;
    height: 100%;
  }
`;

const LinkProfile = ({ account, children }) => {
  return (
    <Link href={`/near/widget/ProfilePage?accountId=${account}`}>
      {children}
    </Link>
  );
};

const stepsArray = [1, 2, 3, 4, 5];

const { id, timestamp } = props;

if (id === undefined) {
  return (
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.page.notfound`}
      props={{ missing: "proposal id" }}
    />
  );
}

const proposal = Near.view(
  "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
  "get_proposal",
  {
    proposal_id: parseInt(id),
  }
);

const [snapshotHistory, setSnapshotHistory] = useState([]);

const fetchSnapshotHistory = () => {
  asyncFetch(`https://infra-cache-api-rs-2.fly.dev/proposal/${id}/snapshots`, {
    method: "GET",
    headers: { accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Failed to fetch snapshots: ${response.status}`);
      }
      return response.body;
    })
    .then((snapshots) => {
      const history = snapshots.map((item) => {
        const proposalData = {
          ...item,
          timestamp: item.ts,
          timeline: parseJSON(item.timeline),
        };
        delete proposalData.ts;
        return proposalData;
      });
      setSnapshotHistory(history);
    });
};

useEffect(() => {
  fetchSnapshotHistory();
}, [id]);

if (!proposal) {
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
if (timestamp && proposal) {
  proposal.snapshot =
    snapshotHistory.find((item) => item.timestamp === timestamp) ??
    proposal.snapshot;
}

const { snapshot } = proposal;
snapshot.timeline = parseJSON(snapshot.timeline);

const authorId = proposal.author_id;
const blockHeight = parseInt(proposal.social_db_post_block_height);
const item = {
  type: "social",
  path: `${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}/post/main`,
  blockHeight,
};
const comments = Social.index("comment", item, { subscribe: true }) ?? [];

const commentAuthors = [
  ...new Set(comments.map((comment) => comment.accountId)),
];

const proposalURL = `https://${REPL_INFRASTRUCTURE_COMMITTEE}.page/proposal/${proposal.id}`;

const SidePanelItem = ({ title, children, hideBorder, ishidden }) => {
  return (
    <div
      style={{ gap: "8px" }}
      className={
        ishidden
          ? "d-none"
          : "d-flex flex-column pb-3 " + (!hideBorder && " border-bottom")
      }
    >
      <div className="h6 mb-0">{title} </div>
      <div className="text-muted">{children}</div>
    </div>
  );
};

const rfpLabelOptions = getGlobalLabels();

const proposalStatusOptions = [
  {
    label: "Draft",
    value: { status: PROPOSAL_TIMELINE_STATUS.DRAFT },
  },
  {
    label: "Review",
    value: {
      status: PROPOSAL_TIMELINE_STATUS.REVIEW,
      sponsor_requested_review: false,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Approved",
    value: {
      status: PROPOSAL_TIMELINE_STATUS.APPROVED,
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Approved-Conditionally",
    value: {
      status: PROPOSAL_TIMELINE_STATUS.APPROVED_CONDITIONALLY,
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Rejected",
    value: {
      status: PROPOSAL_TIMELINE_STATUS.REJECTED,
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Canceled",
    value: {
      status: PROPOSAL_TIMELINE_STATUS.CANCELED,
      sponsor_requested_review: false,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Payment-processing",
    value: {
      status: PROPOSAL_TIMELINE_STATUS.PAYMENT_PROCESSING,
      kyc_verified: false,
      test_transaction_sent: false,
      request_for_trustees_created: false,
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Funded",
    value: {
      status: PROPOSAL_TIMELINE_STATUS.FUNDED,
      trustees_released_payment: true,
      kyc_verified: true,
      test_transaction_sent: true,
      request_for_trustees_created: true,
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
];

const CheckBox = ({ value, isChecked, label, disabled, onClick }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <input
        class="form-check-input"
        type="checkbox"
        value={value}
        checked={isChecked}
        disabled={!isModerator || !showTimelineSetting || disabled}
        onChange={(e) => onClick(e.target.checked)}
      />
      <label style={{ width: "90%" }} class="form-check-label text-black">
        {label}
      </label>
    </div>
  );
};

const RadioButton = ({ value, isChecked, label }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <input
        class="form-check-input"
        type="radio"
        value={value}
        checked={isChecked}
        disabled={true}
      />
      <label class="form-check-label text-black">{label}</label>
    </div>
  );
};

const isAllowedToEditProposal = Near.view(
  "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
  "is_allowed_to_edit_proposal",
  {
    proposal_id: proposal.id,
    editor: accountId,
  }
);

const isModerator = Near.view(
  "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
  "is_allowed_to_write_rfps",
  {
    editor: context.accountId,
  }
);

const editProposal = ({ timeline }) => {
  const body = {
    proposal_body_version: "V1",
    name: snapshot.name,
    description: snapshot.description,
    category: snapshot.category,
    summary: snapshot.summary,
    linked_proposals: snapshot.linked_proposals,
    requested_sponsorship_usd_amount: snapshot.requested_sponsorship_usd_amount,
    requested_sponsorship_paid_in_currency:
      snapshot.requested_sponsorship_paid_in_currency,
    receiver_account: snapshot.receiver_account,
    requested_sponsor: snapshot.requested_sponsor,
    timeline: timeline,
    linked_rfp: snapshot.linked_rfp,
    supervisor: supervisor ?? snapshot.supervisor,
  };
  const args = {
    labels: typeof snapshot.linked_rfp === "number" ? [] : snapshot.labels,
    body: body,
    id: proposal.id,
  };

  Near.call([
    {
      contractName: "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
      methodName: "edit_proposal",
      args: args,
      gas: 270000000000000,
    },
  ]);
};

const editProposalStatus = ({ timeline }) => {
  Near.call([
    {
      contractName: "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
      methodName: "edit_proposal_timeline",
      args: {
        id: proposal.id,
        timeline: timeline,
      },
      gas: 270000000000000,
    },
  ]);
};

const [isReviewModalOpen, setReviewModal] = useState(false);
const [isCancelModalOpen, setCancelModal] = useState(false);
const [showTimelineSetting, setShowTimelineSetting] = useState(false);
const proposalStatus = useCallback(
  () =>
    proposalStatusOptions.find(
      (i) => i.value.status === snapshot.timeline.status
    ),
  [snapshot]
);
const [updatedProposalStatus, setUpdatedProposalStatus] = useState({});

useEffect(() => {
  setUpdatedProposalStatus({
    ...proposalStatus(),
    value: { ...proposalStatus().value, ...snapshot.timeline },
  });
}, [proposal]);

const [paymentHashes, setPaymentHashes] = useState([""]);
const [supervisor, setSupervisor] = useState(snapshot.supervisor);

const selectedStatusIndex = useMemo(
  () =>
    proposalStatusOptions.findIndex((i) => {
      return updatedProposalStatus.value.status === i.value.status;
    }),
  [updatedProposalStatus]
);

const TimelineItems = ({ title, children, value, values }) => {
  const indexOfCurrentItem = proposalStatusOptions.findIndex((i) =>
    Array.isArray(values)
      ? values.includes(i.value.status)
      : value === i.value.status
  );
  let color = "transparent";
  let statusIndex = selectedStatusIndex;

  // index 2,3,4,5  is of decision
  if (selectedStatusIndex === 3 || selectedStatusIndex === 2) {
    statusIndex = 2;
  }
  if (statusIndex === indexOfCurrentItem) {
    color = "#FEF6EE";
  }
  if (
    statusIndex > indexOfCurrentItem ||
    updatedProposalStatus.value.status === PROPOSAL_TIMELINE_STATUS.FUNDED
  ) {
    color = "#EEFEF0";
  }
  // reject
  if (statusIndex === 4 && indexOfCurrentItem === 2) {
    color = "#FF7F7F";
  }
  // cancelled
  if (statusIndex === 5 && indexOfCurrentItem === 2) {
    color = "#F4F4F4";
  }

  return (
    <div
      className="p-2 rounded-3"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="h6 text-black"> {title}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
};

const link = href({
  widgetSrc: `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/app`,
  params: {
    page: "create-proposal",
    id: proposal.id,
    timestamp: timestamp,
  },
});

const createdDate = snapshotHistory[0]?.timestamp ?? snapshot.timestamp;

return (
  <Container className="d-flex flex-column gap-2 w-100 mt-4">
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.ConfirmReviewModal`}
      props={{
        isOpen: isReviewModalOpen,
        onCancelClick: () => setReviewModal(false),
        onReviewClick: () => {
          setReviewModal(false);
          editProposalStatus({ timeline: proposalStatusOptions[1].value });
        },
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.ConfirmCancelModal`}
      props={{
        isOpen: isCancelModalOpen,
        onCancelClick: () => setCancelModal(false),
        onConfirmClick: () => {
          setCancelModal(false);
          editProposalStatus({ timeline: proposalStatusOptions[5].value });
        },
      }}
    />
    <div className="d-flex px-3 px-lg-0 justify-content-between">
      <div className="d-flex gap-2 align-items-center h3">
        <div>{snapshot.name}</div>
        <div className="text-muted">#{proposal.id}</div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.molecule.ShareLinkButton"
          props={{
            postType: "proposal",
            url: proposalURL,
          }}
        />
        {((isAllowedToEditProposal &&
          snapshot.timeline.status === PROPOSAL_TIMELINE_STATUS.DRAFT) ||
          isModerator) && (
          <Link to={link} style={{ textDecoration: "none" }}>
            <Widget
              src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
              props={{
                label: "Edit",
                classNames: { root: "grey-btn btn-sm" },
              }}
            />
          </Link>
        )}
      </div>
    </div>
    <div className="d-flex flex-wrap flex-md-nowrap px-3 px-lg-0 gap-2 align-items-center text-sm pb-3 w-100">
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.StatusTag`}
        props={{
          timelineStatus: snapshot.timeline.status,
          size: "sm",
        }}
      />
      <div className="w-100 d-flex flex-wrap flex-md-nowrap gap-1 align-items-center">
        <div className="fw-bold text-truncate">
          <LinkProfile account={authorId}>{authorId}</LinkProfile>
        </div>
        <div>created on {readableDate(createdDate / 1000000)}</div>
      </div>
    </div>
    <div className="card no-border rounded-0 full-width-div px-3 px-lg-0">
      <div className="container-xl py-4">
        {snapshot.timeline.status === PROPOSAL_TIMELINE_STATUS.DRAFT &&
          isAllowedToEditProposal && (
            <div className="draft-info-container p-3 p-sm-4 d-flex flex-wrap flex-sm-nowrap justify-content-between align-items-center gap-2 rounded-2">
              <div style={{ minWidth: "300px" }}>
                <b>
                  This proposal is in draft mode and open for community
                  comments.
                </b>
                <p className="text-sm text-muted mt-2">
                  The author can still refine the proposal and build consensus
                  before sharing it with sponsors. Click “Ready for review” when
                  you want to start the official review process. This will lock
                  the editing function, but comments are still open.
                </p>
              </div>
              <div style={{ minWidth: "fit-content" }}>
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                  props={{
                    label: "Ready for review",
                    classNames: { root: "grey-btn btn-sm" },
                    onClick: () => setReviewModal(true),
                  }}
                />
              </div>
            </div>
          )}
        {snapshot.timeline.status === PROPOSAL_TIMELINE_STATUS.REVIEW &&
          isAllowedToEditProposal && (
            <div className="review-info-container p-3 p-sm-4 d-flex flex-wrap flex-sm-nowrap justify-content-between align-items-center gap-2 rounded-2">
              <div style={{ minWidth: "300px" }}>
                <b>
                  This proposal is in review mode and still open for community
                  comments.
                </b>
                <p className="text-sm text-muted mt-2">
                  You can’t edit the proposal, but comments are open. Only
                  moderators can make changes. Click “Cancel Proposal” to cancel
                  your proposal. This changes the status to Canceled, signaling
                  to sponsors that it’s no longer active or relevant.
                </p>
              </div>
              <div style={{ minWidth: "fit-content" }}>
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                  props={{
                    label: (
                      <div className="d-flex align-items-center gap-1">
                        <i class="bi bi-trash3"></i> Cancel Proposal
                      </div>
                    ),
                    classNames: { root: "btn-outline-danger btn-sm" },
                    onClick: () => setCancelModal(true),
                  }}
                />
              </div>
            </div>
          )}
        <div className="my-4">
          <div className="d-flex flex-wrap gap-6">
            <div
              style={{ minWidth: "350px" }}
              className="flex-3 order-2 order-md-1"
            >
              <div
                className="d-flex gap-2 flex-1"
                style={{
                  zIndex: 99,
                  background: "white",
                  position: "relative",
                }}
              >
                <div className="d-none d-sm-flex">
                  <Widget
                    src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile`}
                    props={{
                      accountId: authorId,
                    }}
                  />
                </div>
                <ProposalContainer className="rounded-2 flex-1">
                  <Header className="d-flex gap-1 align-items-center p-2 px-3 ">
                    <div
                      className="fw-bold text-truncate"
                      style={{ maxWidth: "60%" }}
                    >
                      <LinkProfile account={authorId}>{authorId}</LinkProfile>
                    </div>
                    <div
                      className="text-muted"
                      style={{ minWidth: "fit-content" }}
                    >
                      ･{" "}
                      <Widget
                        src={`${REPL_NEAR}/widget/TimeAgo`}
                        props={{
                          blockHeight,
                          blockTimestamp: createdDate,
                        }}
                      />
                      {context.accountId && (
                        <div className="menu">
                          <Widget
                            src={`${REPL_NEAR}/widget/Posts.Menu`}
                            props={{
                              accountId: authorId,
                              blockHeight: blockHeight,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Header>
                  <div className="d-flex flex-column gap-1 p-2 px-3 description-box">
                    <div className="text-muted h6 border-bottom pb-1 mt-3">
                      PROPOSAL CATEGORY
                    </div>
                    <div>
                      <Widget
                        src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.MultiSelectCategoryDropdown`}
                        props={{
                          selected: snapshot.labels,
                          disabled: true,
                          hideDropdown: true,
                          onChange: () => {},
                          availableOptions: rfpLabelOptions,
                        }}
                      />
                    </div>
                    <div className="text-muted h6 border-bottom pb-1 mt-3">
                      SUMMARY
                    </div>
                    <div>{snapshot.summary}</div>
                    <div className="text-muted h6 border-bottom pb-1 mt-3">
                      DESCRIPTION
                    </div>
                    <Widget
                      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDEViewer`}
                      props={{
                        content: snapshot.description,
                      }}
                    />

                    <div className="d-flex gap-2 align-items-center mt-3">
                      <Widget
                        src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.LikeButton`}
                        props={{
                          item,
                          proposalId: proposal.id,
                          notifyAccountIds: [authorId],
                        }}
                      />
                      <Widget
                        src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.CommentIcon`}
                        props={{
                          item,
                          showOverlay: false,
                          onClick: () => {},
                        }}
                      />
                      <Widget
                        src={`${REPL_NEAR}/widget/CopyUrlButton`}
                        props={{
                          url: proposalURL,
                        }}
                      />
                    </div>
                  </div>
                </ProposalContainer>
              </div>
              <div className="border-bottom pb-4 mt-4">
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.CommentsAndLogs`}
                  props={{
                    ...props,
                    id: proposal.id,
                    item: item,
                    snapshotHistory: [...proposal.snapshot_history, snapshot],
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  zIndex: 99,
                  backgroundColor: "white",
                }}
                className="pt-4"
              >
                <Widget
                  src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.ComposeComment`}
                  props={{
                    ...props,
                    item: item,
                    notifyAccountIds: [authorId],
                    proposalId: proposal.id,
                    sortedRelevantUsers: [
                      authorId,
                      snapshot.requested_sponsor,
                      ...commentAuthors,
                    ].filter((user) => user !== accountId),
                  }}
                />
              </div>
            </div>
            <div
              style={{ minWidth: "350px" }}
              className="d-flex flex-column gap-4 flex-1 order-1 order-md-2"
            >
              <SidePanelItem title="Author">
                <Widget
                  src={`${REPL_NEAR}/widget/AccountProfile`}
                  props={{
                    accountId: authorId,
                    noOverlay: true,
                  }}
                />
              </SidePanelItem>
              <SidePanelItem
                title={"Linked RFP"}
                ishidden={!isNumber(snapshot.linked_rfp)}
              >
                <Widget
                  src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.LinkedRfps`}
                  props={{
                    linkedRfpIds: [snapshot.linked_rfp],
                  }}
                />
              </SidePanelItem>
              <SidePanelItem
                title={
                  "Linked Proposals " + `(${snapshot.linked_proposals.length})`
                }
                ishidden={!snapshot.linked_proposals.length}
              >
                <Widget
                  src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.LinkedProposals`}
                  props={{
                    linkedProposalIds: snapshot.linked_proposals,
                  }}
                />
              </SidePanelItem>
              <SidePanelItem title="Funding Ask">
                <div className="h4 text-black">
                  {snapshot.requested_sponsorship_usd_amount && (
                    <div className="d-flex flex-column gap-1">
                      <div>
                        {parseInt(
                          snapshot.requested_sponsorship_usd_amount
                        ).toLocaleString()}{" "}
                        USD
                      </div>
                      <div className="text-sm text-muted">
                        Requested in{" "}
                        {snapshot.requested_sponsorship_paid_in_currency}
                      </div>
                    </div>
                  )}
                </div>
              </SidePanelItem>
              <SidePanelItem title="Recipient Wallet Address">
                <Widget
                  src={`${REPL_NEAR}/widget/AccountProfile`}
                  props={{
                    accountId: snapshot.receiver_account,
                    noOverlay: true,
                  }}
                />
              </SidePanelItem>
              <SidePanelItem title="Recipient Verification Status">
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.VerificationStatus`}
                  props={{
                    receiverAccount: snapshot.receiver_account,
                    showGetVerifiedBtn:
                      accountId === snapshot.receiver_account ||
                      accountId === authorId,
                  }}
                />
              </SidePanelItem>
              <SidePanelItem
                title="Project Coordinator"
                ishidden={!snapshot.supervisor}
              >
                <Widget
                  src={`${REPL_NEAR}/widget/AccountProfile`}
                  props={{
                    accountId: snapshot.supervisor,
                    noOverlay: true,
                  }}
                />
              </SidePanelItem>
              <SidePanelItem
                hideBorder={true}
                title={
                  <div>
                    <div className="d-flex justify-content-between align-content-center">
                      Timeline
                      {isModerator && (
                        <div onClick={() => setShowTimelineSetting(true)}>
                          <i class="bi bi-gear"></i>
                        </div>
                      )}
                    </div>
                    {showTimelineSetting && (
                      <div className="mt-2 d-flex flex-column gap-2">
                        <h6 className="mb-0">Proposal Status</h6>
                        <Widget
                          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown`}
                          props={{
                            options: proposalStatusOptions,
                            selectedValue: updatedProposalStatus,
                            onUpdate: (v) => {
                              setUpdatedProposalStatus({
                                ...v,
                                value: {
                                  ...v.value,
                                  ...updatedProposalStatus.value,
                                  status: v.value.status,
                                },
                              });
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                }
              >
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex gap-3 mt-2">
                    <div className="d-flex flex-column">
                      {stepsArray.map((_, index) => {
                        const indexOfCurrentItem = index;
                        let color = "";
                        let statusIndex = selectedStatusIndex;
                        // index 2,3,4 is of decision
                        if (
                          selectedStatusIndex === 3 ||
                          selectedStatusIndex === 2 ||
                          selectedStatusIndex === 4 ||
                          selectedStatusIndex === 5
                        ) {
                          statusIndex = 2;
                        }
                        if (selectedStatusIndex === 6) {
                          statusIndex = 3;
                        }
                        const current = statusIndex === indexOfCurrentItem;
                        const completed =
                          statusIndex > indexOfCurrentItem ||
                          updatedProposalStatus.value.status ===
                            PROPOSAL_TIMELINE_STATUS.FUNDED;
                        return (
                          <div className="d-flex flex-column align-items-center gap-1">
                            <div
                              className={
                                "circle " +
                                (completed && " green-fill ") +
                                (current && " yellow-fill ")
                              }
                            >
                              {completed && (
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{ height: "110%" }}
                                >
                                  <i class="bi bi-check"></i>
                                </div>
                              )}
                            </div>

                            {index !== stepsArray.length - 1 && (
                              <div
                                className={
                                  "vertical-line" +
                                  (index === stepsArray.length - 2
                                    ? "-sm "
                                    : " ") +
                                  (completed && " green-fill ") +
                                  (current && " yellow-fill ")
                                }
                              ></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="d-flex flex-column gap-3">
                      <TimelineItems
                        title="1) Draft"
                        value={PROPOSAL_TIMELINE_STATUS.DRAFT}
                      >
                        <div>
                          Once an author submits a proposal, it is in draft mode
                          and open for community comments. The author can still
                          make changes to the proposal during this stage and
                          submit it for official review when ready.
                        </div>
                      </TimelineItems>
                      <TimelineItems
                        title="2) Review"
                        value={PROPOSAL_TIMELINE_STATUS.REVIEW}
                      >
                        <div className="d-flex flex-column gap-2">
                          Sponsors who agree to consider the proposal may
                          request attestations from work groups.
                          <CheckBox
                            value=""
                            disabled={selectedStatusIndex !== 1}
                            onClick={(value) =>
                              setUpdatedProposalStatus((prevState) => ({
                                ...prevState,
                                value: {
                                  ...prevState.value,
                                  sponsor_requested_review: value,
                                },
                              }))
                            }
                            label="Sponsor provides feedback or requests reviews"
                            isChecked={
                              updatedProposalStatus.value
                                .sponsor_requested_review
                            }
                          />
                          <CheckBox
                            value=""
                            disabled={selectedStatusIndex !== 1}
                            label="Reviewer completes attestations (Optional)"
                            onClick={(value) =>
                              setUpdatedProposalStatus((prevState) => ({
                                ...prevState,
                                value: {
                                  ...prevState.value,
                                  reviewer_completed_attestation: value,
                                },
                              }))
                            }
                            isChecked={
                              updatedProposalStatus.value
                                .reviewer_completed_attestation
                            }
                          />
                        </div>
                      </TimelineItems>
                      <TimelineItems
                        title="3) Decision"
                        values={[
                          PROPOSAL_TIMELINE_STATUS.APPROVED,
                          PROPOSAL_TIMELINE_STATUS.APPROVED_CONDITIONALLY,
                          PROPOSAL_TIMELINE_STATUS.REJECTED,
                        ]}
                      >
                        <div className="d-flex flex-column gap-2">
                          <div>Sponsor makes a final decision:</div>
                          <RadioButton
                            value=""
                            label={<div className="fw-bold">Approved</div>}
                            isChecked={
                              updatedProposalStatus.value.status ===
                                PROPOSAL_TIMELINE_STATUS.APPROVED ||
                              updatedProposalStatus.value.status ===
                                PROPOSAL_TIMELINE_STATUS.PAYMENT_PROCESSING ||
                              updatedProposalStatus.value.status ===
                                PROPOSAL_TIMELINE_STATUS.FUNDED
                            }
                          />
                          <RadioButton
                            value=""
                            label={
                              <>
                                <div className="fw-bold">
                                  Approved - Conditional{" "}
                                </div>
                                <span>
                                  Requires follow up from recipient. Moderators
                                  will provide further details.
                                </span>
                              </>
                            }
                            isChecked={
                              updatedProposalStatus.value.status ===
                              PROPOSAL_TIMELINE_STATUS.APPROVED_CONDITIONALLY
                            }
                          />
                          <RadioButton
                            value="Reject"
                            label={<div className="fw-bold">Rejected</div>}
                            isChecked={
                              updatedProposalStatus.value.status ===
                              PROPOSAL_TIMELINE_STATUS.REJECTED
                            }
                          />
                          <RadioButton
                            value="Canceled"
                            label={<div className="fw-bold">Canceled</div>}
                            isChecked={
                              updatedProposalStatus.value.status ===
                              PROPOSAL_TIMELINE_STATUS.CANCELED
                            }
                          />
                        </div>
                      </TimelineItems>
                      <TimelineItems
                        title="4) Payment Processing"
                        value={PROPOSAL_TIMELINE_STATUS.PAYMENT_PROCESSING}
                      >
                        <div className="d-flex flex-column gap-2">
                          <CheckBox
                            value={updatedProposalStatus.value.kyc_verified}
                            label="Sponsor verifies KYC/KYB"
                            disabled={selectedStatusIndex !== 6}
                            onClick={(value) =>
                              setUpdatedProposalStatus((prevState) => ({
                                ...prevState,
                                value: {
                                  ...prevState.value,
                                  kyc_verified: value,
                                },
                              }))
                            }
                            isChecked={updatedProposalStatus.value.kyc_verified}
                          />
                          <CheckBox
                            value={
                              updatedProposalStatus.value.test_transaction_sent
                            }
                            disabled={selectedStatusIndex !== 6}
                            label="Sponsor confirmed sponsorship and shared funding steps with recipient"
                            onClick={(value) =>
                              setUpdatedProposalStatus((prevState) => ({
                                ...prevState,
                                value: {
                                  ...prevState.value,
                                  test_transaction_sent: value,
                                },
                              }))
                            }
                            isChecked={
                              updatedProposalStatus.value.test_transaction_sent
                            }
                          />
                        </div>
                      </TimelineItems>
                      <TimelineItems
                        title="5) Funded"
                        value={PROPOSAL_TIMELINE_STATUS.FUNDED}
                      >
                        <div className="d-flex flex-column gap-2">
                          {paymentHashes?.length > 1 ? (
                            paymentHashes.slice(0, -1).map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                className="text-decoration-underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Payment Link
                                <i className="bi bi-arrow-up-right"></i>
                              </a>
                            ))
                          ) : updatedProposalStatus.value.payouts.length > 0 ? (
                            <div>
                              {updatedProposalStatus.value.payouts.map(
                                (link) => {
                                  return (
                                    <a
                                      href={link}
                                      className="text-decoration-underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Payment Link
                                      <i class="bi bi-arrow-up-right"></i>
                                    </a>
                                  );
                                }
                              )}
                            </div>
                          ) : (
                            "No Payouts yet"
                          )}
                        </div>
                      </TimelineItems>
                    </div>
                  </div>
                  {showTimelineSetting && (
                    <div className="d-flex flex-column gap-2">
                      <div className="border-vertical py-3 my-2">
                        <label className="text-black h6">
                          Project Coordinator
                        </label>
                        <Widget
                          src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.AccountInput`}
                          props={{
                            value: supervisor,
                            placeholder: "",
                            onUpdate: setSupervisor,
                          }}
                        />
                      </div>
                      {updatedProposalStatus.value.status ===
                        PROPOSAL_TIMELINE_STATUS.FUNDED && (
                        <div className="border-vertical py-3 my-2">
                          <label className="text-black h6">Payment Link</label>
                          <div className="d-flex flex-column gap-2">
                            {paymentHashes.map((item, index) => (
                              <div className="d-flex gap-2 justify-content-between align-items-center">
                                <Widget
                                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
                                  props={{
                                    className: "flex-grow-1",
                                    value: item,
                                    onChange: (e) => {
                                      const updatedHashes = [...paymentHashes];
                                      updatedHashes[index] = e.target.value;
                                      setPaymentHashes(updatedHashes);
                                    },
                                    skipPaddingGap: true,
                                    placeholder: "Enter URL",
                                  }}
                                />
                                <div style={{ minWidth: 20 }}>
                                  {index !== paymentHashes.length - 1 ? (
                                    <Widget
                                      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                                      props={{
                                        classNames: {
                                          root: "btn-outline-danger shadow-none w-100",
                                        },
                                        label: <i class="bi bi-trash3 h6"></i>,
                                        onClick: () => {
                                          const updatedHashes = [
                                            ...paymentHashes,
                                          ];
                                          updatedHashes.splice(index, 1);
                                          setPaymentHashes(updatedHashes);
                                        },
                                      }}
                                    />
                                  ) : (
                                    <Widget
                                      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                                      props={{
                                        classNames: {
                                          root: "green-btn shadow-none border-0 w-100",
                                        },
                                        disabled: !item,
                                        label: <i class="bi bi-plus-lg"></i>,
                                        onClick: () =>
                                          setPaymentHashes([
                                            ...paymentHashes,
                                            "",
                                          ]),
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="d-flex gap-2 align-items-center justify-content-end text-sm">
                        <Widget
                          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                          props={{
                            label: "Cancel",
                            classNames: {
                              root: "btn-outline-danger border-0 shadow-none btn-sm",
                            },
                            onClick: () => {
                              setShowTimelineSetting(false);
                              setUpdatedProposalStatus(proposalStatus);
                            },
                          }}
                        />
                        <Widget
                          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                          props={{
                            label: "Save",
                            disabled:
                              !supervisor &&
                              DecisionStage.includes(
                                updatedProposalStatus.value.status
                              ),
                            classNames: { root: "green-btn btn-sm" },
                            onClick: () => {
                              if (snapshot.supervisor !== supervisor) {
                                editProposal({
                                  timeline: updatedProposalStatus.value,
                                });
                              } else if (
                                updatedProposalStatus.value.status ===
                                PROPOSAL_TIMELINE_STATUS.FUNDED
                              ) {
                                editProposalStatus({
                                  timeline: {
                                    ...updatedProposalStatus.value,
                                    payouts: !paymentHashes[0]
                                      ? []
                                      : paymentHashes.filter(
                                          (item) => item !== ""
                                        ),
                                  },
                                });
                              } else {
                                editProposalStatus({
                                  timeline: updatedProposalStatus.value,
                                });
                              }
                              setShowTimelineSetting(false);
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </SidePanelItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
