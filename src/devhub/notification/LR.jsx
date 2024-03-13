let { accountId, blockHeight, value } = props;

const showAuthorProfile =
  value.type == "devhub/mention" || value.type == "devhub/edit";

if (showAuthorProfile) {
  accountId = value.notifier;
}

return (
  <div className="d-flex justify-content-between">
    <div className="me-2 text-truncate">
      <div className="text-truncate">
        <Widget
          src="mob.near/widget/N.ProfileLine"
          props={{ accountId, tooltip: true, link: true }}
        />
      </div>
      <div className="text-truncate text-muted" style={{ paddingLeft: "1em" }}>
        {props.L}
        <Widget src="mob.near/widget/TimeAgo" props={{ blockHeight }} />
      </div>
    </div>
    <div className="text-nowrap">{props.R}</div>
  </div>
);
