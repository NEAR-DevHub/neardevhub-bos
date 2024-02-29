const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || {
  href: () => {},
};
const { readableDate } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.common"
) || { readableDate: () => {} };

const accountId = context.accountId;
/*
---props---
props.id: number;
props.timestamp: number; optional
*/

const TIMELINE_STATUS = {
  DRAFT: "DRAFT",
  REVIEW: "REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  APPROVED_CONDITIONALLY: "APPROVED_CONDITIONALLY",
  PAYMENT_PROCESSING: "PAYMENT_PROCESSING",
  FUNDED: "FUNDED",
};

const Container = styled.div`
  .draft-info-container {
    background-color: #ecf8fb;
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
    height: 190px;
    background-color: lightgrey;
  }
  .vertical-line-sm {
    width: 2px;
    height: 85px;
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
  }

  .green-btn {
    background-color: #04a46e !important;
    border: none;
    color: white;

    &:active {
      color: white;
    }
  }

  .gap-6 {
    gap: 2.5rem;
  }
`;

const ProposalContainer = styled.div`
  border: 1px solid lightgrey;
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

const stepsArray = [1, 2, 3, 4, 5];

const { id, timestamp } = props;
const proposal = Near.view("${REPL_PROPOSALS_CONTRACT}", "get_proposal", {
  proposal_id: parseInt(id),
});

if (!proposal) {
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
if (timestamp && proposal) {
  proposal.snapshot =
    proposal.snapshot_history.find((item) => item.timestamp === timestamp) ??
    proposal.snapshot;
}

const { snapshot } = proposal;

const editorAccountId = snapshot.editor_id;
const blockHeight = parseInt(proposal.social_db_post_block_height);
const item = {
  type: "social",
  path: `${REPL_PROPOSALS_CONTRACT}/post/main`,
  blockHeight,
};
const proposalURL = `${REPL_DEVHUB}/widget/devhub.entity.proposal.Proposal?id=${proposal.id}&timestamp=${snapshot.timestamp}`;

const KycVerificationStatus = () => {
  const isVerified = true;
  return (
    <div className="d-flex gap-2 align-items-center">
      {isVerified ? (
        <img
          src="https://ipfs.near.social/ipfs/bafkreidqveupkcc7e3rko2e67lztsqrfnjzw3ceoajyglqeomvv7xznusm"
          height={40}
        />
      ) : (
        "Need icon"
      )}
      <div className="d-flex flex-column">
        <div className="h6 mb-0">KYC Verified</div>
        <div className="text-sm">Expires on Aug 24, 2024</div>
      </div>
    </div>
  );
};

const SidePanelItem = ({ title, children, hideBorder }) => {
  return (
    <div
      className={
        "d-flex flex-column gap-2 pb-3 " + (!hideBorder && " border-bottom")
      }
    >
      <div className="h6 mb-0">{title} </div>
      <div className="text-muted">{children}</div>
    </div>
  );
};

const proposalStatusOptions = [
  {
    label: "Draft",
    value: { status: "DRAFT" },
  },
  {
    label: "Review",
    value: {
      status: "REVIEW",
      sponsor_requested_review: false,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Approved",
    value: {
      status: "APPROVED",
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Approved-Conditionally",
    value: {
      status: "APPROVED_CONDITIONALLY",
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Rejected",
    value: {
      status: "REJECTED",
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
  {
    label: "Payment-processing",
    value: {
      status: "PAYMENT_PROCESSING",
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
      status: "FUNDED",
      trustees_released_payment: true,
      kyc_verified: true,
      test_transaction_sent: true,
      request_for_trustees_created: true,
      sponsor_requested_review: true,
      reviewer_completed_attestation: false,
    },
  },
];

const LinkedProposals = () => {
  const linkedProposalsData = [];
  snapshot.linked_proposals.map((item) => {
    const data = Near.view("${REPL_PROPOSALS_CONTRACT}", "get_proposal", {
      proposal_id: item,
    });
    if (data !== null) {
      linkedProposalsData.push(data);
    }
  });

  return (
    <div className="d-flex flex-column gap-3">
      {linkedProposalsData.map((item) => (
        <div className="d-flex gap-2">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
            props={{
              accountId: item.snapshot.editor_id,
            }}
          />
          <div className="d-flex flex-column" style={{ maxWidth: 250 }}>
            <b className="text-truncate">{item.snapshot.name}</b>
            <div className="text-sm text-muted">
              created on {readableDate(item.snapshot.timestamp / 1000000)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CheckBox = ({ value, isChecked, label, disabled, onClick }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <input
        class="form-check-input"
        type="checkbox"
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={(e) => onClick(e.target.checked)}
      />
      <label class="form-check-label text-black">{label}</label>
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

function findTokenNameByAddress(address) {
  const foundToken = Object.entries(tokenMapping).find(
    ([tokenName, tokenData]) => {
      return (
        JSON.stringify(tokenMapping[tokenName]) === JSON.stringify(address)
      );
    }
  );

  return foundToken ? foundToken[0] : null;
}

const tokenName = findTokenNameByAddress(snapshot.requested_sponsorship_token);
const isAllowedToEditProposal = Near.view(
  "${REPL_PROPOSALS_CONTRACT}",
  "is_allowed_to_edit_proposal",
  { proposal_id: proposal.id, editor: accountId }
);

const isModerator = isAllowedToEditProposal && proposal.author_id !== accountId;

const editProposalStatus = ({ timeline }) => {
  Near.call({
    contractName: "${REPL_PROPOSALS_CONTRACT}",
    methodName: "edit_proposal_timeline",
    args: {
      id: proposal.id,
      timeline: timeline,
    },
    gas: 270000000000000,
  });
};

const [isReviewModalOpen, setReviewModal] = useState(false);
const [showTimelineSetting, setShowTimelineSetting] = useState(false);
const proposalStatus = proposalStatusOptions.find(
  (i) => i.value.status === snapshot.timeline.status
);
const [updatedProposalStatus, setUpdatedProposalStatus] =
  useState(proposalStatus);

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

  // index 2,3,4 is of decision
  if (selectedStatusIndex === 3 || selectedStatusIndex === 2) {
    statusIndex = 2;
  }
  if (statusIndex === indexOfCurrentItem) {
    color = "#FEF6EE";
  }
  if (
    statusIndex > indexOfCurrentItem ||
    updatedProposalStatus.value.status === TIMELINE_STATUS.FUNDED
  ) {
    color = "#EEFEF0";
  }
  // reject
  if (statusIndex === 4 && indexOfCurrentItem === 2) {
    color = "#FF7F7F";
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

const optimisticallyHideItem = (message) => {
  console.log(message);
};
const resolveHideItem = (message) => {
  console.log(message);
};
const cancelHideItem = () => {};

const extractNotifyAccountId = (item) => {
  if (!item || item.type !== "social" || !item.path) {
    return undefined;
  }
  const accountId = item.path.split("/")[0];
  return `${accountId}/post/main` === item.path ? accountId : undefined;
};

return (
  <Container className="d-flex flex-column gap-2 w-100 mt-4">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.ConfirmReviewModal"}
      props={{
        isOpen: isReviewModalOpen,
        onCancelClick: () => setReviewModal(false),
        onReviewClick: () => {
          setReviewModal(false);
          editProposalStatus({ timeline: proposalStatusOptions[1].value });
        },
      }}
    />
    <div className="d-flex justify-content-between">
      <div className="d-flex gap-2 align-items-center h3">
        <div>{snapshot.name}</div>
        <div className="text-muted">#{proposal.id}</div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.History"}
          props={{
            id: proposal.id,
            timestamp: snapshot.timestamp,
          }}
        />
        <Widget
          src="${REPL_NEAR}/widget/ShareButton"
          props={{
            postType: "post",
            url: proposalURL,
          }}
        />
        {isAllowedToEditProposal && (
          <Link
            to={href({
              widgetSrc: "${REPL_DEVHUB}/widget/app",
              params: {
                page: "create-proposal",
                id: proposal.id,
                timestamp: timestamp,
              },
            })}
            style={{ textDecoration: "none" }}
          >
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
              props={{
                label: "Edit",
                classNames: { root: "grey-btn btn-sm" },
              }}
            />
          </Link>
        )}
      </div>
    </div>
    <div className="d-flex gap-2 align-items-center text-sm pb-3">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.StatusTag"}
        props={{
          timelineStatus: snapshot.timeline.status,
          size: "sm",
        }}
      />
      <div>
        <b>{proposal.author_id} </b> created on{" "}
        {readableDate(snapshot.timestamp / 1000000)}
      </div>
    </div>
    <div className="card card-body rounded-0 p-4">
      {snapshot.timeline.status === TIMELINE_STATUS.DRAFT &&
        isAllowedToEditProposal && (
          <div className="draft-info-container p-4 d-flex justify-content-between align-items-center gap-2 rounded-2">
            <div>
              <b>
                This proposal is in draft mode and open for community comments.
              </b>
              <p className="text-sm text-muted mt-2">
                The author can still refine the proposal and build consensus
                before sharing it with sponsors. Click “Ready for review” when
                you want to start the official review process. This will lock
                the editing function, but comments are still open.
              </p>
            </div>
            {isAllowedToEditProposal && (
              <div style={{ minWidth: "fit-content" }}>
                <Widget
                  src={
                    "${REPL_DEVHUB}/widget/devhub.components.molecule.Button"
                  }
                  props={{
                    label: "Ready for review",
                    classNames: { root: "grey-btn btn-sm" },
                    onClick: () => setReviewModal(true),
                  }}
                />
              </div>
            )}
          </div>
        )}
      <div className="my-4">
        <div className="d-flex gap-6">
          <div className="flex-3">
            <div className="d-flex gap-2 flex-1">
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
                props={{
                  accountId: editorAccountId,
                }}
              />
              <ProposalContainer className="rounded-2 flex-1">
                <Header className="d-flex gap-3 align-items-center p-2 px-3">
                  {snapshot.editor_id} ･{" "}
                  <Widget
                    src="${REPL_NEAR}/widget/TimeAgo"
                    props={{
                      blockHeight,
                      blockTimestamp: snapshot.timestamp,
                    }}
                  />
                  {context.accountId && (
                    <div className="menu">
                      <Widget
                        src="${REPL_NEAR}/widget/Posts.Menu"
                        props={{
                          accountId: editorAccountId,
                          blockHeight: blockHeight,
                          parentFunctions: {
                            optimisticallyHideItem,
                            resolveHideItem,
                            cancelHideItem,
                          },
                        }}
                      />
                    </div>
                  )}
                </Header>
                <div className="d-flex flex-column gap-1 p-2 px-3">
                  <div className="text-muted h6 border-bottom pb-1 mt-3">
                    PROPOSAL CATEGORY
                  </div>
                  <div>
                    <Widget
                      src={
                        "${REPL_DEVHUB}/widget/devhub.entity.proposal.CategoryDropdown"
                      }
                      props={{
                        selectedValue: snapshot.category,
                        disabled: true,
                      }}
                    />
                  </div>
                  <div className="text-muted h6 border-bottom pb-1 mt-3">
                    SUMMARY
                  </div>
                  <div>{snapshot.summary}</div>
                  <div className="text-muted h6 border-bottom pb-1 mt-3 mb-4">
                    DESCRIPTION
                  </div>
                  <Widget
                    src="${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"
                    props={{ text: snapshot.description }}
                  />

                  <div className="d-flex gap-2 align-items-center mt-4">
                    <Widget
                      src="${REPL_NEAR}/widget/v1.LikeButton"
                      props={{
                        item,
                      }}
                    />
                    <Widget
                      src="${REPL_NEAR}/widget/CommentButton"
                      props={{
                        item,
                        onClick: () => {},
                      }}
                    />
                    <Widget
                      src="${REPL_NEAR}/widget/CopyUrlButton"
                      props={{
                        url: proposalURL,
                      }}
                    />
                    <Widget
                      src="${REPL_NEAR}/widget/ShareButton"
                      props={{
                        postType: "post",
                        url: proposalURL,
                      }}
                    />
                  </div>
                </div>
              </ProposalContainer>
            </div>
            <div className="border-bottom pb-4 mt-4">
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Comments"}
                props={{
                  item: item,
                }}
              />
            </div>
            <div className="mt-4">
              <Widget
                src={
                  "${REPL_DEVHUB}/widget/devhub.entity.proposal.ComposeComment"
                }
                props={{
                  item: item,
                  notifyAccountId: extractNotifyAccountId(item),
                }}
              />
            </div>
          </div>
          <div className="d-flex flex-column gap-4 flex-1">
            <SidePanelItem title="Author">
              <Widget
                src="${REPL_NEAR}/widget/AccountProfile"
                props={{
                  accountId: editorAccountId,
                }}
              />
            </SidePanelItem>
            {/* <SidePanelItem title="Verification Status">
              <KycVerificationStatus />
            </SidePanelItem> */}
            <SidePanelItem
              title={
                "Linked Proposals " + `(${snapshot.linked_proposals.length})`
              }
            >
              <LinkedProposals />
            </SidePanelItem>
            <SidePanelItem title="Funding Ask">
              <div className="h4 text-black">
                {snapshot.requested_sponsorship_amount && (
                  <>
                    {snapshot.requested_sponsorship_amount}{" "}
                    {tokenName ?? "NEAR"}
                  </>
                )}
              </div>
            </SidePanelItem>
            <SidePanelItem title="Requested Sponsor">
              {snapshot.requested_sponsor && (
                <Widget
                  src="${REPL_NEAR}/widget/AccountProfile"
                  props={{
                    accountId: snapshot.requested_sponsor,
                  }}
                />
              )}
            </SidePanelItem>
            <SidePanelItem title="Supervisor">
              {snapshot.supervisor ? (
                <Widget
                  src="${REPL_NEAR}/widget/AccountProfile"
                  props={{
                    accountId: snapshot.supervisor,
                  }}
                />
              ) : (
                "No Supervisor"
              )}
            </SidePanelItem>
            <SidePanelItem title="Payouts">
              {snapshot.payouts.length > 0 ? (
                <div>
                  {snapshot.payouts.map((hash) => {
                    const link = `https://nearblocks.io/blocks/${hash}`;
                    return (
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    );
                  })}
                </div>
              ) : (
                "No Payouts yet"
              )}
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
                        src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown"
                        props={{
                          options: proposalStatusOptions,
                          selectedValue: updatedProposalStatus,
                          onUpdate: (v) => {
                            setUpdatedProposalStatus(v);
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              }
            >
              <div className="d-flex flex-column gap-3">
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
                        selectedStatusIndex === 4
                      ) {
                        statusIndex = 2;
                      }
                      if (selectedStatusIndex === 5) {
                        statusIndex = 3;
                      }
                      const current = statusIndex === indexOfCurrentItem;
                      const completed =
                        statusIndex > indexOfCurrentItem ||
                        updatedProposalStatus.value.status ===
                          TIMELINE_STATUS.FUNDED;
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
                      value={TIMELINE_STATUS.DRAFT}
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
                      value={TIMELINE_STATUS.REVIEW}
                    >
                      <div className="d-flex flex-column gap-2">
                        Sponsors who agree to consider the proposal may request
                        attestations from work groups.
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
                            updatedProposalStatus.value.sponsor_requested_review
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
                        TIMELINE_STATUS.APPROVED,
                        TIMELINE_STATUS.APPROVED_CONDITIONALLY,
                        TIMELINE_STATUS.REJECTED,
                      ]}
                    >
                      <div className="d-flex flex-column gap-2">
                        <div>Sponsor makes a final decision:</div>
                        <RadioButton
                          value=""
                          label="Approve"
                          isChecked={
                            updatedProposalStatus.value.status ===
                            TIMELINE_STATUS.APPROVED
                          }
                        />
                        <RadioButton
                          value=""
                          label={
                            <>
                              Approve - Conditional <br />
                              <span>
                                Require follow up from recipient after payment
                              </span>{" "}
                            </>
                          }
                          isChecked={
                            updatedProposalStatus.value.status ===
                            TIMELINE_STATUS.APPROVED_CONDITIONALLY
                          }
                        />
                        <RadioButton
                          value="Reject"
                          label="Reject"
                          isChecked={
                            updatedProposalStatus.value.status ===
                            TIMELINE_STATUS.REJECTED
                          }
                        />
                      </div>
                    </TimelineItems>
                    <TimelineItems
                      title="4) Payment Processing"
                      value={TIMELINE_STATUS.PAYMENT_PROCESSING}
                    >
                      <div className="d-flex flex-column gap-2">
                        <CheckBox
                          value=""
                          label="Sponsor verifies KYC/KYB"
                          disabled={selectedStatusIndex !== 5}
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
                          value=""
                          disabled={selectedStatusIndex !== 5}
                          label="Sponsor sends test transaction"
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
                        <CheckBox
                          value=""
                          disabled={selectedStatusIndex !== 5}
                          label="Sponsor creates funding request from Trustees"
                          onClick={(value) =>
                            setUpdatedProposalStatus((prevState) => ({
                              ...prevState,
                              value: {
                                ...prevState.value,
                                request_for_trustees_created: value,
                              },
                            }))
                          }
                          isChecked={
                            updatedProposalStatus.value
                              .request_for_trustees_created
                          }
                        />
                      </div>
                    </TimelineItems>
                    <TimelineItems
                      title="5) Funded"
                      value={TIMELINE_STATUS.FUNDED}
                    >
                      <CheckBox
                        value=""
                        disabled={true}
                        label="DevDAO Trustee Releases payment"
                        isChecked={
                          updatedProposalStatus.value.status ===
                          TIMELINE_STATUS.FUNDED
                        }
                      />
                    </TimelineItems>
                  </div>
                </div>
                {showTimelineSetting && (
                  <div className="d-flex gap-2 align-items-center justify-content-end text-sm">
                    <Widget
                      src={
                        "${REPL_DEVHUB}/widget/devhub.components.molecule.Button"
                      }
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
                      src={
                        "${REPL_DEVHUB}/widget/devhub.components.molecule.Button"
                      }
                      props={{
                        label: "Save",
                        classNames: { root: "green-btn btn-sm" },
                        onClick: () => {
                          editProposalStatus({
                            timeline: updatedProposalStatus.value,
                          });
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </SidePanelItem>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
