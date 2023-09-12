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

const KanbanPostTicket = ({ id, config, post }) => {
  const postId = post.id ?? (id ? parseInt(id) : 0);

  const data =
    post ??
    Near.view(nearDevGovGigsContractAccountId, "get_post", { post_id: postId });

  if (!data) {
    return <div>Loading ...</div>;
  }

  console.log(data);

  const header = (
    <div className="card-header d-flex justify-content-between gap-3">
      <a
        href={`https://near.org/mob.near/widget/ProfilePage?accountId=${data.author_id}`}
        className="d-flex gap-2 link-dark text-truncate"
      >
        {config.features?.author_avatar ?? true ? (
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
        href={href("Post", { id: postId })}
        role="button"
        target="_blank"
        title="Open in new tab"
      >
        <i className="bi bi-share" />
      </a>
    </div>
  );

  const footer =
    config.features?.likes_amount ?? config.features?.replies_amount ?? true ? (
      <div className="card-footer d-flex justify-content-between gap-3">
        {config.features?.likes_amount ?? true ? (
          <span>
            {widget("components.atom.icon", {
              type: "bootstrap_icon",
              variant: "bi-heart-fill",
            })}

            {data.likes.length}
          </span>
        ) : null}

        {config.features?.replies_amount ?? true ? (
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
      {config.features?.type ?? true ? (
        <i className={`bi ${iconsByPostType[data.snapshot.post_type]}`} />
      ) : null}

      <span>
        {[
          config.features?.type ?? true
            ? data.snapshot.post_type === "Submission"
              ? "Solution"
              : data.snapshot.post_type
            : null,

          data.snapshot.name,
        ]
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
    data.snapshot.labels && (config.features?.tags ?? true) ? (
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
        {tagList}
      </div>

      {footer}
    </AttractableDiv>
  );
};

return KanbanPostTicket(props);
