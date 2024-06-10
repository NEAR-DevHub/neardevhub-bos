/*
---props---
props.id: number;
props.newTab: boolean;
props.timestamp: number;
props.referral: any;
*/
const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || {
  href: () => {},
};
const { readableDate } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.common"
) || { readableDate: () => {} };
const proposalId = props.id ?? (props.id ? parseInt(props.id) : 0);
const proposal = Near.view("${REPL_DEVHUB_CONTRACT}", "get_proposal", {
  proposal_id: proposalId,
});
if (!proposal || !proposal.snapshot_history) {
  return <div class="bi bi-clock-history px-2"></div>;
}
const referral = props.referral;

const currentTimestamp = props.timestamp ?? proposal.snapshot.timestamp;
const snapshot = proposal.snapshot;
const snapshotHistory = proposal.snapshot_history
  ? Array.from(proposal.snapshot_history)
  : [];

snapshotHistory.push(snapshot);
snapshotHistory.reverse();

const history = (
  <div class="btn-group" role="group">
    <a
      class="card-link"
      role="button"
      title="proposal History"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      type="button"
    >
      <div class="bi bi-clock-history px-2"></div>
    </a>
    <ul class="dropdown-menu">
      <a
        class="d-flex text-muted"
        style={{ fontSize: "11px", textDecoration: "none", cursor: "default" }}
      >
        <a
          style={{
            textAlign: "center",
            minWidth: "250px",
            maxWidth: "250px",
          }}
        >
          Edit History
        </a>
        <a style={{ marginRight: "8px" }}>Compare</a>
      </a>
      {snapshotHistory.map((item) => {
        if (item === undefined) return;
        return (
          <li style={{ display: "flex" }}>
            <div
              style={{
                minWidth: "250px",
                maxWidth: "250px",
              }}
            >
              <a
                class="dropdown-item"
                href={href({
                  widgetSrc: "${REPL_DEVHUB}/widget",
                  params: {
                    page: "proposal",
                    id: proposalId,
                    timestamp: item.timestamp,
                    compareTimestamp: null,
                    referral,
                  },
                })}
                target={props.newTab ? "_blank" : undefined}
              >
                {readableDate(item.timestamp / 1000000)}

                <Widget
                  src="${REPL_MOB}/widget/ProfileImage"
                  props={{
                    accountId: item.editor_id,
                    style: {
                      width: "1.25em",
                      height: "1.25em",
                    },
                    imageStyle: {
                      transform: "translateY(-12.5%)",
                    },
                  }}
                />
                {proposal.author_id.substring(0, 8)}
              </a>
            </div>
            <a
              class="dropdown-item"
              href={href({
                widgetSrc: "${REPL_DEVHUB}/widget/app",
                params: {
                  page: "proposal",
                  id: proposalId,
                  timestamp: currentTimestamp,
                  compareTimestamp: item.timestamp,
                  referral,
                },
              })}
            >
              <i class="bi bi-file-earmark-diff" />
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);

return history;
