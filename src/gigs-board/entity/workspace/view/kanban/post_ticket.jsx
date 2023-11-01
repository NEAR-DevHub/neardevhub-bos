/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */

const iconsByPostType = {
  Idea: "bi-lightbulb",
  Comment: "bi-chat",
  Solution: "bi-rocket",
  Attestation: "bi-check-circle",
  Sponsorship: "bi-cash-coin",
};

const KanbanPostTicket = ({ metadata }) => {
  const data = Near.view(nearDevGovGigsContractAccountId, "get_post", {
    post_id: metadata.id ? parseInt(metadata.id) : 0,
  });

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

  const isFundingRequested =
    post_type === "Solution" &&
    typeof requested_sponsorship_amount === "string" &&
    parseInt(requested_sponsorship_amount, 10) > 0;

  const features = {
    ...metadata.features,

    sponsorship_request_indicator:
      isFundingRequested && metadata.features.sponsorship_request_indicator,

    requested_sponsorship_value:
      isFundingRequested && metadata.features.requested_sponsorship_value,

    approved_sponsorship_value:
      post_type === "Sponsorship" &&
      metadata.features.approved_sponsorship_value,

    requested_sponsor:
      isFundingRequested && metadata.features.requested_sponsor,

    sponsorship_supervisor:
      post_type === "Sponsorship" && metadata.features.sponsorship_supervisor,
  };

  const header = (
    <div className="card-header d-flex justify-content-between gap-3">
      <a
        href={`https://near.org/mob.near/widget/ProfilePage?accountId=${data.author_id}`}
        className="d-flex gap-2 link-dark text-truncate"
      >
        {features.author ? (
          <Widget
            src="mob.near/widget/ProfileImage"
            props={{
              metadata,
              accountId: data.author_id,
              widgetName,
              style: { height: "1.5em", width: "1.5em", minWidth: "1.5em" },
            }}
          />
        ) : null}

        <span className="text-muted">@{data.author_id}</span>
      </a>

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
  );

  const footer =
    features.like_count || features.reply_count ? (
      <div className="card-footer d-flex justify-content-between gap-3">
        {features.like_count ? (
          <span>
            {widget("components.atom.icon", {
              type: "bootstrap_icon",
              variant: "bi-heart-fill",
            })}

            {data.likes.length}
          </span>
        ) : null}

        {features.reply_count ? (
          <span>
            {widget("components.atom.icon", {
              type: "bootstrap_icon",
              variant: "bi-comment",
            })}

            {data.comments.length}
          </span>
        ) : null}
      </div>
    ) : null;

  const titleArea = (
    <span className="card-text gap-2">
      {features.type ? (
        <i className={`bi ${iconsByPostType[post_type]}`} />
      ) : null}

      <span>
        {[features.type ? post_type : null, name]
          .filter(
            (maybeString) =>
              typeof maybeString === "string" && maybeString.length > 0
          )
          .join(": ")}
      </span>
    </span>
  );

  const descriptionArea =
    post_type === "Comment" ? (
      <div className="overflow-auto" style={{ maxHeight: "6em" }}>
        <Markdown className="card-text" text={description} />
      </div>
    ) : null;

  const tagList =
    Array.isArray(tags) && features.tags ? (
      <div className="d-flex flex-wrap gap-2 m-0">
        {tags.map((tag) => (
          <a href={href("Feed", { tag })} key={tag}>
            <span className="badge text-bg-primary me-1">{tag}</span>
          </a>
        ))}
      </div>
    ) : null;

  return (
    <AttractableDiv className="card border-secondary">
      {header}

      <div className="card-body d-flex flex-column gap-3">
        {titleArea}
        {descriptionArea}

        {features.sponsorship_request_indicator ? (
          <span className="d-flex gap-2">
            {widget("components.atom.icon", {
              type: "bootstrap_icon",
              variant: "bi-cash",
            })}

            <span>Funding requested</span>
          </span>
        ) : null}

        {features.requested_sponsorship_value ||
        features.approved_sponsorship_value ? (
          <span className="d-flex flex-wrap gap-2">
            <span>{`${
              post_type === "Solution" ? "Requested" : "Approved"
            } funding:`}</span>

            <span className="d-flex flex-nowrap gap-1">
              <span>{requested_sponsorship_amount ?? amount}</span>
              <span>{requested_sponsorship_token ?? sponsorship_token}</span>
            </span>
          </span>
        ) : null}

        {features.requested_sponsor || features.sponsorship_supervisor ? (
          <div className="d-flex flex-wrap gap-2">
            <span>{`${
              post_type === "Solution" ? "Requested sponsor" : "Supervisor"
            }:`}</span>

            <Widget
              className="flex-wrap"
              src={`neardevgov.near/widget/ProfileLine`}
              props={{
                accountId: requested_sponsor ?? supervisor,
                hideAccountId: true,
                tooltip: true,
              }}
            />
          </div>
        ) : null}

        {tagList}
      </div>

      {footer}
    </AttractableDiv>
  );
};

return KanbanPostTicket(props);
