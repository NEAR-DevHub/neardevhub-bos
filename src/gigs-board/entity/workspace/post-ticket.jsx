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

const PostTicket = ({ id, config, post }) => {
  const postId = post.id ?? (id ? parseInt(id) : 0);

  const data =
    post ??
    Near.view(nearDevGovGigsContractAccountId, "get_post", { post_id: postId });

  if (!data) {
    return <div>Loading ...</div>;
  }

  const authorAvatar = (
    <Widget
      src="mob.near/widget/ProfileImage"
      props={{
        metadata,
        accountId: data.author_id,
        widgetName,
        style: {
          height: "1.5em",
          width: "1.5em",
          minWidth: "1.5em",
        },
      }}
    />
  );

  const header = (
    <div className="card-header">
      <div className="d-flex justify-content-between gap-3">
        {config.propVisibility?.author ?? true ? (
          <a
            href={`neardevgov.near/widget/ProfilePage?accountId=${data.author_id}`}
            className="d-flex gap-2 link-dark text-truncate"
          >
            {authorAvatar}
            <span className="text-muted">@{data.author_id}</span>
          </a>
        ) : null}

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
    </div>
  );

  const title = [
    config.propVisibility?.type ?? true
      ? data.snapshot.post_type === "Submission"
        ? "Solution"
        : data.snapshot.post_type
      : null,

    config.propVisibility?.title ?? true ? data.snapshot.name : null,
  ]
    .filter((prop) => typeof prop === "string")
    .join(": ");

  const titleArea =
    data.snapshot.post_type !== "Comment" && title.length > 0 ? (
      <span className="card-text">
        <i className={`bi ${iconsByPostType[data.snapshot.post_type]}`} />
        {title}
      </span>
    ) : null;

  const descriptionArea =
    data.snapshot.post_type === "Comment" &&
    (config.propVisibility?.type ?? true) ? (
      <div className="overflow-auto" style={{ maxHeight: "6em" }}>
        <Markdown className="card-text" text={data.snapshot.description} />
      </div>
    ) : null;

  const tagList =
    data.snapshot.labels && (config.propVisibility?.tags ?? true) ? (
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
    </AttractableDiv>
  );
};

return PostTicket(props);
