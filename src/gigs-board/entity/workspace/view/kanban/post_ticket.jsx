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
  Submission: "bi-rocket",
  Attestation: "bi-check-circle",
  Sponsorship: "bi-cash-coin",
};

const KanbanPostTicket = ({ metadata: { id, features } }) => {
  const data = Near.view(nearDevGovGigsContractAccountId, "get_post", {
    post_id: id ? parseInt(id) : 0,
  });

  if (!data) {
    return <div>Loading ...</div>;
  }

  const postType =
    data.snapshot.post_type === "Submission"
      ? "Solution"
      : data.snapshot.post_type;

  console.log(data);

  const header = (
    <div className="card-header d-flex justify-content-between gap-3">
      <a
        href={`https://near.org/mob.near/widget/ProfilePage?accountId=${data.author_id}`}
        className="d-flex gap-2 link-dark text-truncate"
      >
        {features.author_avatar ? (
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
    features.likes_amount || features.replies_amount ? (
      <div className="card-footer d-flex justify-content-between gap-3">
        {features.likes_amount ? (
          <span>
            {widget("components.atom.icon", {
              type: "bootstrap_icon",
              variant: "bi-heart-fill",
            })}

            {data.likes.length}
          </span>
        ) : null}

        {features.replies_amount ? (
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
        <i className={`bi ${iconsByPostType[data.snapshot.post_type]}`} />
      ) : null}

      <span>
        {[features.type ? postType : null, data.snapshot.name]
          .filter(
            (maybeString) =>
              typeof maybeString === "string" && maybeString.length > 0
          )
          .join(": ")}
      </span>
    </span>
  );

  const descriptionArea =
    data.snapshot.post_type === "Comment" ? (
      <div className="overflow-auto" style={{ maxHeight: "6em" }}>
        <Markdown className="card-text" text={data.snapshot.description} />
      </div>
    ) : null;

  const tagList =
    Array.isArray(data.snapshot.labels) && features.tags ? (
      <div className="d-flex flex-wrap gap-2 m-0">
        {data.snapshot.labels.map((label) => (
          <a href={href("Feed", { label })} key={label}>
            <span className="badge text-bg-primary me-1">{label}</span>
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

        {postType === "Sponsorship" || postType === "Solution" ? (
          <>
            {features.granted_funds_amount ? (
              <span className="d-flex flex-wrap gap-2">
                <span>Maximum amount:</span>

                <span>
                  <span>{data.snapshot.amount}</span>
                  <span>{data.snapshot.sponsorship_token}</span>
                </span>
              </span>
            ) : null}

            {features.funding_supervisor ? (
              <div className="d-flex flex-wrap gap-2">
                <span>Supervisor:</span>

                <Widget
                  src={`neardevgov.near/widget/ProfileLine`}
                  props={{ accountId: data.snapshot.supervisor }}
                />
              </div>
            ) : null}
          </>
        ) : null}

        {tagList}
      </div>

      {footer}
    </AttractableDiv>
  );
};

return KanbanPostTicket(props);
