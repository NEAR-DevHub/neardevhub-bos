const columnId = props.columnId;
const { href } = VM.require("devhub.near/widget/core.lib.url");
href || (href = () => {});
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;
  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
const iconsByPostType = {
  Idea: "bi-lightbulb",
  Comment: "bi-chat",
  Solution: "bi-rocket",
  Attestation: "bi-check-circle",
  Sponsorship: "bi-cash-coin",
};
function getToken(token) {
  let amountUnit = "";
  if (typeof token === "string") {
    amountUnit = token;
  } else if (typeof token === "object") {
    const address = Object.values(token)?.[0]?.address ?? "";
    const ftMetadata = Near.view(address, "ft_metadata", {});
    if (ftMetadata !== null) {
      amountUnit = ftMetadata?.symbol;
    }
  }
  return amountUnit;
}
const KanbanPostTicket = ({ metadata, data }) => {
  if (!data) return <div>Loading ...</div>;
  const {
    post_type,
    name,
    description,
    labels: tags,
    requested_sponsorship_amount,
    requested_sponsorship_token,
    requested_sponsor,
    amount,
    sponsorship_token,
    supervisor,
  } = data.snapshot;
  const features = {
    ...metadata.features,
    approved_sponsorship_value:
      post_type === "Sponsorship" &&
      metadata.features.approved_sponsorship_value,
    sponsorship_supervisor:
      post_type === "Sponsorship" && metadata.features.sponsorship_supervisor,
  };
  const footer = (
    <div className="card-header d-flex justify-content-between gap-3 align-items-center">
      {features.like_count && (
        <div className="d-flex gap-2 align-items-center">
          <Widget
            src={`devhub.near/widget/devhub.components.atom.Icon`}
            props={{
              type: "bootstrap_icon",
              variant: "bi-heart-fill",
            }}
          />
          {data.likes.length}
        </div>
      )}
      <div className="d-flex justify-content-end w-100">
        <a
          className="card-link"
          href={href("Post", { id: data.id })}
          role="button"
          target="_blank"
          title="Open in new tab"
        >
          <i className="bi bi-share" />
        </a>
      </div>
    </div>
  );
  const titleArea = (
    <span>
      {features.type ? (
        <i className={`bi ${iconsByPostType[post_type]}`} />
      ) : null}
      <span>{name}</span>
    </span>
  );
  const sponsorshipValue = (
    <span className="d-flex flex-nowrap gap-1">
      <span>{requested_sponsorship_amount ?? amount}</span>
      <span>{requested_sponsorship_token ?? getToken(sponsorship_token)}</span>
    </span>
  );
  const requestedSponsor = (
    <Widget
      className="flex-wrap"
      src={`neardevgov.near/widget/ProfileLine`}
      props={{
        accountId: requested_sponsor ?? supervisor,
        hideAccountId: true,
        tooltip: true,
      }}
    />
  );
  const descriptionArea =
    post_type === "Comment" ? (
      <div
        style={{ maxHeight: "6em", wordBreak: "break-all", overflow: "hidden" }}
      >
        <Markdown className="card-text" text={description} />
      </div>
    ) : null;
  const tagList =
    Array.isArray(tags) && features.tags ? (
      <div className="d-flex flex-wrap gap-2 m-0">
        {(tags ?? []).map((tag) => (
          <a href={href("Feed", { tag })} key={tag}>
            <span className="badge text-bg-primary me-1">{tag}</span>
          </a>
        ))}
      </div>
    ) : null;
  const showFunding = features.approved_sponsorship_value;
  const showSponsor = features.sponsorship_supervisor;
  return (
    <AttractableDiv className="card">
      <div
        className="card-body d-flex flex-column gap-2"
        style={{ fontSize: 14 }}
      >
        <div className="d-flex justify-content-between gap-2">
          <span className="card-text gap-2">{titleArea}</span>
          {features.author && (
            <a
              href={`https://near.org/mob.near/widget/ProfilePage?accountId=${data.author_id}`}
              s
              style={{ minWidth: 20 }}
            >
              <Widget
                src="mob.near/widget/ProfileImage"
                props={{
                  metadata,
                  accountId: data.author_id,
                  widgetName,
                  style: { height: "1.8em", width: "1.8em", minWidth: "1.8em" },
                }}
              />
            </a>
          )}
        </div>
        {descriptionArea}
        {showFunding && (
          <span className="d-flex flex-wrap gap-2">
            <span>Amount:</span>
            {sponsorshipValue}
          </span>
        )}
        {showSponsor && (
          <div className="d-flex flex-wrap gap-2">
            <span>{`${
              post_type === "Solution" ? "Sponsor" : "Supervisor"
            }:`}</span>{" "}
            {requestedSponsor}{" "}
          </div>
        )}
        {tagList}
      </div>
      {footer}
    </AttractableDiv>
  );
};
return KanbanPostTicket(props);
