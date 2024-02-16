const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || {
  href: () => {},
};
const { readableDate } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.common"
) || { readableDate: () => {} };

/*
---props---
props.id: number;
props.timestamp: number; optional
*/

const Container = styled.div`
  .draft-info-container {
    background-color: #ecf8fb;
  }

  .text-sm {
    font-size: 13px;
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

  .vertical-line {
    width: 2px;
    height: 160px;
    background-color: lightgrey;
  }
  .vertical-line-sm {
    width: 2px;
    height: 90px;
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
const proposal = {
  proposal_version: "V0",
  id: 0,
  author_id: "test_proposals.testnet",
  social_db_post_block_height: "156868817",
  snapshot: {
    editor_id: "test_proposals.testnet",
    timestamp: "1707244539703028078",
    labels: ["test1", "test2"],
    proposal_body_version: "V0",
    name: "another post",
    category: "Marketing",
    summary: "sum",
    description:
      "Hello to @heytestpolyprogrammist.testnet and @psalomo.near. This is an idea with mentions.",
    linked_proposals: [
      { link_type: "PostId", id: 1 },
      { link_type: "PostId", id: 3 },
    ],
    requested_sponsorship_amount: "1000000000",
    requested_sponsorship_token: "USD",
    receiver_account: "polyprogrammist.near",
    requested_sponsor: null,
    supervisor: "frol.near",
    payouts: [],
    timeline: { status: "DRAFT" },
  },
  snapshot_history: [],
};
// Near.view("${REPL_PROPOSALS_CONTRACT}", "get_proposal", {
//   proposal_id: id
// });

if (!proposal) {
  return "Loading...";
}
if (timestamp) {
  proposal.snapshot = proposal.snapshot_history.find(
    (item) => item.timestamp === timestamp
  );
}

const { snapshot } = proposal;
const editorAccountId = snapshot.editor_id;
const blockHeight = proposal.social_db_post_block_height;
const item = {
  type: "social",
  path: `${editorAccountId}/post/main`,
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

const SidePanelItem = ({ title, children }) => {
  return (
    <div className="d-flex flex-column gap-2 pb-3 border-bottom">
      <div className="h6 mb-0">{title} </div>
      <div className="text-muted">{children}</div>
    </div>
  );
};

const TimelineItems = ({ title, children }) => {
  return (
    <div>
      <div className="h6 text-black"> {title}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
};

const LinkedProposals = () => {
  const linkedProposalsData = [];
  snapshot.linked_proposals.map((item) => {
    let data = null;
    if (item.link_type === "PostId") {
      data = Near.view("${REPL_DEVHUB_LEGACY}", "get_post", {
        post_id: item.id,
      });
    } else {
      data = Near.view("${REPL_PROPOSALS_CONTRACT}", "get_proposal", {
        proposal_id: item.id,
      });
    }
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

const CheckBox = ({ value, isChecked, label }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <input
        class="form-check-input"
        type="checkbox"
        value={value}
        checked={isChecked}
        disabled={true}
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

return (
  <Container className="d-flex flex-column gap-2 w-100 mt-4">
    <div className="d-flex justify-content-between">
      <div className="d-flex gap-2 align-items-center h3">
        <div>{snapshot.name}</div>
        <div className="text-muted">#{proposal.id}</div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.History"}
          props={{
            proposal,
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
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            label: "Edit",
            classNames: { root: "grey-btn" },
            onClick: () => {},
          }}
        />
      </div>
    </div>
    <div className="d-flex gap-2 align-items-center text-sm border-bottom pb-3">
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
    <div className="draft-info-container p-4">
      <b>This proposal is in draft mode and open for community comments.</b>
      <p className="text-sm text-muted mt-2">
        The author can still refine the proposal and build consensus before
        sharing it with sponsors. Click “Ready for review” when you want to
        start the official review process. This will lock the editing function,
        but comments are still open.
      </p>
    </div>
    <div className="mt-4">
      <div className="d-flex gap-4">
        <div className="flex-3">
          <div className="d-flex gap-2 flex-1 border-bottom pb-4">
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
                <div className="menu">
                  <Widget
                    src="${REPL_NEAR}/widget/Posts.Menu"
                    props={{
                      accountId: editorAccountId,
                      blockHeight: blockHeight,
                      parentFunctions: {
                        toggleEdit: () => {},
                        optimisticallyHideItem: () => {},
                        resolveHideItem: () => {},
                        cancelHideItem: () => {},
                      },
                    }}
                  />
                </div>
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
          <div className="mt-4">
            <div className="d-flex gap-2">
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
                props={{
                  accountId: context.accountId,
                }}
              />
              <div className="d-flex flex-column gap-4">
                <b className="mt-1">Add a comment</b>
              </div>
            </div>
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
          <SidePanelItem title="Verification Status">
            <KycVerificationStatus />
          </SidePanelItem>
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
                  {snapshot.equested_sponsorship_token ?? "NEAR"}
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
            {snapshot.supervisor && (
              <Widget
                src="${REPL_NEAR}/widget/AccountProfile"
                props={{
                  accountId: snapshot.supervisor,
                }}
              />
            )}
          </SidePanelItem>
          <SidePanelItem title="Payouts">
            {snapshot.payouts.length > 0 ? <div></div> : "No Payouts yet"}
          </SidePanelItem>
          <SidePanelItem title="Timeline">
            <div className="d-flex gap-3 mt-2">
              <div className="d-flex flex-column">
                {stepsArray.map((_, index) => (
                  <div className="d-flex flex-column align-items-center gap-1">
                    <div className="circle"></div>

                    {index !== stepsArray.length - 1 && (
                      <div
                        className={
                          "vertical-line" +
                          (index === stepsArray.length - 2 ? "-sm" : "")
                        }
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="d-flex flex-column gap-3">
                <TimelineItems title="1) Draft">
                  <div>
                    Once an author submits a proposal, it is in draft mode and
                    open for community comments. The author can still make
                    changes to the proposal during this stage and submit it for
                    official review when ready.
                  </div>
                </TimelineItems>
                <TimelineItems title="2) Review">
                  <div className="d-flex flex-column gap-2">
                    Sponsors who agree to consider the proposal may request
                    attestations from work groups.
                    <CheckBox
                      value=""
                      label="Sponsor provides feedback or requests reviews"
                      isChecked={false}
                    />
                    <CheckBox
                      value=""
                      label="Reviewer completes attestations (Optional)"
                      isChecked={false}
                    />
                  </div>
                </TimelineItems>
                <TimelineItems title="3) Decision">
                  <div className="d-flex flex-column gap-2">
                    <div>Sponsor makes a final decision:</div>
                    <RadioButton value="" label="Approve" isChecked={false} />
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
                      isChecked={false}
                    />
                    <RadioButton value="" label="Reject" isChecked={false} />
                  </div>
                </TimelineItems>
                <TimelineItems title="4) Payment Processing">
                  <div className="d-flex flex-column gap-2">
                    <CheckBox
                      value=""
                      label="Sponsor verifies KYC/KYB"
                      isChecked={false}
                    />
                    <CheckBox
                      value=""
                      label="Sponsor sends test transaction"
                      isChecked={false}
                    />
                    <CheckBox
                      value=""
                      label="Sponsor creates funding request from Trustees"
                      isChecked={false}
                    />
                  </div>
                </TimelineItems>
                <TimelineItems title="5) Funded">
                  <CheckBox
                    value=""
                    label="DevDAO Trustee Releases payment"
                    isChecked={false}
                  />
                </TimelineItems>
              </div>
            </div>
          </SidePanelItem>
        </div>
      </div>
    </div>
  </Container>
);
