const {
  RFP_TIMELINE_STATUS,
  CANCEL_RFP_OPTIONS,
  parseJSON,
  PROPOSALS_APPROVED_STATUS_ARRAY,
  getLinkUsingCurrentGateway,
} = VM.require(`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/core.common`) || {
  RFP_TIMELINE_STATUS: {},
  CANCEL_RFP_OPTIONS: {},
  parseJSON: () => {},
  PROPOSALS_APPROVED_STATUS_ARRAY: {},
  getLinkUsingCurrentGateway: () => {},
};
const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`) || {
  href: () => {},
};
const { readableDate } = VM.require(
  `${REPL_DEVHUB}/widget/core.lib.common`
) || { readableDate: () => {} };

const { getGlobalLabels } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };

const accountId = context.accountId;
/*
  ---props---
  props.id: number;
  props.timestamp: number; optional
  accountId: string
  blockHeight:number
  */

const { id, timestamp } = props;

if (id === undefined) {
  return (
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.page.notfound`}
      props={{ missing: "rfp id" }}
    />
  );
}

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

  .accept-submission-info-container {
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

  .blue-btn {
    background-color: #3c697d;
    border: none;
    color: white;
  }

  .form-check-input:checked {
    background-color: #3c697d !important;
    border-color: #3c697d !important;
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

const RfpContainer = styled.div`
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

const rfpLabelOptions = getGlobalLabels();

const LinkProfile = ({ account, children }) => {
  return (
    <Link href={`/near/widget/ProfilePage?accountId=${account}`}>
      {children}
    </Link>
  );
};

const [snapshotHistory, setSnapshotHistory] = useState([]);

const rfp = Near.view("${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}", "get_rfp", {
  rfp_id: parseInt(id),
});

const fetchSnapshotHistory = () => {
  asyncFetch(`https://infra-cache-api-rs-2.fly.dev/rfp/${id}/snapshots`, {
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
        const rfpData = {
          ...item,
          timestamp: item.ts,
          timeline: parseJSON(item.timeline),
        };
        delete rfpData.ts;
        return rfpData;
      });
      setSnapshotHistory([...history].reverse());
    });
};

useEffect(() => {
  fetchSnapshotHistory();
}, [id]);

if (!rfp) {
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
if (timestamp && rfp) {
  rfp.snapshot =
    snapshotHistory.find((item) => item.timestamp === timestamp) ??
    rfp.snapshot;
}

const { snapshot } = rfp;
snapshot.timeline = parseJSON(snapshot.timeline);

const authorId = rfp.author_id;
const blockHeight = parseInt(rfp.social_db_post_block_height);
const item = {
  type: "social",
  path: `${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}/post/main`,
  blockHeight,
};
const rfpURL = getLinkUsingCurrentGateway(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/app?page=rfp&id=${rfp.id}&timestamp=${snapshot.timestamp}`
);

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

const isAllowedToWriteRfp = Near.view(
  "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
  "is_allowed_to_write_rfps",
  {
    editor: accountId,
  }
);

const link = href({
  widgetSrc: `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/app`,
  params: {
    page: "create-rfp",
    id: rfp.id,
    timestamp: timestamp,
  },
});

const createdDate = snapshotHistory[0].timestamp ?? snapshot.timestamp;

const [approvedProposals, setApprovedProposals] = useState([]);
const [isCancelModalOpen, setCancelModal] = useState(false);
const [isWarningModalOpen, setWarningModal] = useState(false);
const [timeline, setTimeline] = useState(null);
const [showTimelineSetting, setShowTimelineSetting] = useState(false);

useEffect(() => {
  if (!timeline) {
    setTimeline(snapshot.timeline);
  }
}, [snapshot]);

function fetchApprovedRfpProposals() {
  snapshot.linked_proposals.map((item) => {
    Near.asyncView(
      "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
      "get_proposal",
      {
        proposal_id: item,
      }
    ).then((item) => {
      const timeline = parseJSON(item.snapshot.timeline);
      if (PROPOSALS_APPROVED_STATUS_ARRAY.includes(timeline.status)) {
        setApprovedProposals((prevApprovedProposals) => [
          ...prevApprovedProposals,
          { proposal_id: item.id, ...item.snapshot },
        ]);
      }
    });
  });
}

const editRFPStatus = () => {
  Near.call([
    {
      contractName: "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
      methodName: "edit_rfp_timeline",
      args: {
        id: rfp.id,
        timeline: timeline,
      },
      gas: 270000000000000,
    },
  ]);
};

const onCancelRFP = (value) => {
  Near.call([
    {
      contractName: "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
      methodName: "cancel_rfp",
      args: {
        id: rfp.id,
        proposals_to_cancel:
          value === CANCEL_RFP_OPTIONS.CANCEL_PROPOSALS
            ? snapshot.linked_proposals
            : [],
        proposals_to_unlink:
          value === CANCEL_RFP_OPTIONS.UNLINK_PROPOSALS
            ? snapshot.linked_proposals
            : [],
      },
      gas: 270000000000000,
    },
  ]);
};

const accessControlInfo =
  Near.view(
    "${REPL_INFRASTRUCTURE_COMMITTEE_CONTRACT}",
    "get_access_control_info"
  ) ?? null;
const moderatorList =
  accessControlInfo?.members_list?.["team:moderators"]?.children;

useEffect(() => {
  fetchApprovedRfpProposals();
}, [snapshot]);

const SubmitProposalBtn = () => {
  return (
    <div style={{ minWidth: "fit-content" }}>
      <Link
        to={href({
          widgetSrc: `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/app`,
          params: { page: "create-proposal", rfp_id: rfp.id },
        })}
      >
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
          props={{
            label: (
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle"></i>Submit Proposal
              </div>
            ),
            classNames: { root: "blue-btn" },
          }}
        />
      </Link>
    </div>
  );
};
return (
  <Container className="d-flex flex-column gap-2 w-100 mt-4">
    <Widget
      src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.ConfirmCancelModal`}
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
        linkedProposalIds: snapshot.linked_proposals,
      }}
    />
    <Widget
      src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.WarningModal`}
      props={{
        isOpen: isWarningModalOpen,
        onConfirmClick: () => {
          setWarningModal(false);
          setTimeline({ status: RFP_TIMELINE_STATUS.EVALUATION });
        },
      }}
    />
    <div className="d-flex px-3 px-lg-0 justify-content-between">
      <div className="d-flex gap-2 align-items-center h3">
        <div>{snapshot.name}</div>
        <div className="text-muted">#{rfp.id}</div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <Widget
          src={`${REPL_NEAR}/widget/ShareButton`}
          props={{
            postType: "post",
            url: rfpURL,
          }}
        />
        {isAllowedToWriteRfp && (
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
        src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.StatusTag`}
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
        {snapshot.timeline.status ===
          RFP_TIMELINE_STATUS.ACCEPTING_SUBMISSIONS && (
          <div className="accept-submission-info-container p-3 p-sm-4 d-flex flex-wrap flex-sm-nowrap justify-content-between align-items-center gap-2 rounded-2">
            <div style={{ minWidth: "300px" }}>
              <b>This RFP is accepting submissions.</b>
              <p className="text-sm text-muted mt-2">
                Click Submit Proposal if you want to submit a proposal.
              </p>
            </div>
            <SubmitProposalBtn />
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
                  <img src={"${REPL_RFP_IMAGE}"} height={35} width={35} />
                </div>
                <RfpContainer className="rounded-2 flex-1">
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
                      RFP CATEGORY
                      <div className="my-2">
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
                          rfpId: rfp.id,
                          notifyAccountIds: moderatorList,
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
                          url: rfpURL,
                        }}
                      />
                    </div>
                  </div>
                </RfpContainer>
              </div>
              <div className="border-bottom pb-4 mt-4">
                <Widget
                  src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.CommentsAndLogs`}
                  props={{
                    ...props,
                    id: rfp.id,
                    item: item,
                    approvedProposals: approvedProposals,
                    snapshotHistory: snapshotHistory,
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
                    notifyAccountIds: moderatorList,
                    rfpId: rfp.id,
                  }}
                />
                {snapshot.timeline.status ===
                  RFP_TIMELINE_STATUS.ACCEPTING_SUBMISSIONS && (
                  <div className="accept-submission-info-container mt-3 p-3 p-sm-4 d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center gap-2 rounded-2">
                    <div style={{ minWidth: "350px" }}>
                      <b>Want to respond to this RFP? </b> This RFP is accepting
                      submissions.
                    </div>
                    <SubmitProposalBtn />
                  </div>
                )}
              </div>
            </div>
            <div
              style={{ minWidth: "300px" }}
              className="d-flex flex-column gap-4 flex-1 order-1 order-md-2"
            >
              <SidePanelItem title="Submission Deadline">
                <h5 className="text-black">
                  {readableDate(
                    parseFloat(snapshot.submission_deadline / 1000000)
                  )}
                </h5>
              </SidePanelItem>
              <SidePanelItem
                title={
                  <div>
                    <div className="d-flex justify-content-between align-content-center">
                      Timeline
                      {isAllowedToWriteRfp && (
                        <div
                          data-testid="setting-btn"
                          onClick={() => setShowTimelineSetting(true)}
                        >
                          <i class="bi bi-gear"></i>
                        </div>
                      )}
                    </div>
                  </div>
                }
              >
                <Widget
                  src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.TimelineConfigurator`}
                  props={{
                    timeline: timeline,
                    setTimeline: (v) => {
                      if (
                        snapshot.timeline.status === v.status &&
                        timeline.status === v.status
                      ) {
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
                    disabled: showTimelineSetting ? false : true,
                  }}
                />
                {showTimelineSetting && (
                  <div className="d-flex gap-2 align-items-center justify-content-end text-sm mt-2">
                    <Widget
                      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                      props={{
                        label: "Cancel",
                        classNames: {
                          root: "btn-outline-danger border-0 shadow-none btn-sm",
                        },
                        onClick: () => {
                          setShowTimelineSetting(false);
                          setTimeline(snapshot.timeline);
                        },
                      }}
                    />
                    <Widget
                      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                      props={{
                        label: "Save",
                        classNames: { root: "blue-btn btn-sm" },
                        onClick: () => {
                          editRFPStatus();
                          setShowTimelineSetting(false);
                        },
                      }}
                    />
                  </div>
                )}
              </SidePanelItem>
              <SidePanelItem
                title={
                  "Selected Proposal" + " (" + approvedProposals.length + ")"
                }
                ishidden={!approvedProposals.length}
              >
                <Widget
                  src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.LinkedProposals`}
                  props={{
                    linkedProposalIds: (approvedProposals ?? []).map(
                      (i) => i.proposal_id
                    ),
                    showStatus: false,
                  }}
                />
              </SidePanelItem>
              <SidePanelItem
                title={
                  "All Proposals" +
                  " (" +
                  snapshot.linked_proposals.length +
                  ")"
                }
                ishidden={!snapshot.linked_proposals.length}
              >
                <Widget
                  src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.molecule.LinkedProposals`}
                  props={{
                    linkedProposalIds: snapshot.linked_proposals,
                    showStatus:
                      snapshot.timeline.status !==
                      RFP_TIMELINE_STATUS.PROPOSAL_SELECTED,
                  }}
                />
              </SidePanelItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
