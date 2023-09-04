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

const authorProfileImageStyle = {
  height: "1.5em",
  width: "1.5em",
  minWidth: "1.5em",
};

const PostTicket = ({ id, config, post }) => {
  const postId = post.id ?? (id ? parseInt(id) : 0);

  const postData =
    post ??
    Near.view(nearDevGovGigsContractAccountId, "get_post", { post_id: postId });

  if (!postData) {
    return <div>Loading ...</div>;
  }

  const { snapshot } = postData;

  const header = (
    <div className="card-header">
      <div class="d-flex justify-content-between gap-3">
        {(config.propVisibility.author ?? true) && (
          <a
            href={`neardevgov.near/widget/ProfilePage?accountId=${postData.author_id}`}
            className="d-flex gap-2 link-dark text-truncate"
          >
            <Widget
              src="mob.near/widget/ProfileImage"
              props={{
                metadata,
                accountId: postData.author_id,
                widgetName,
                style: authorProfileImageStyle,
              }}
            />

            <span className="text-muted">@{postData.author_id}</span>
          </a>
        )}

        <a
          class="card-link"
          href={href("Post", { id: postId })}
          role="button"
          target="_blank"
          title="Open in new tab"
        >
          <i class="bi bi-share" />
        </a>
      </div>
    </div>
  );

  const tagList =
    snapshot.labels && (config.propVisibility.tags ?? true) ? (
      <div class="card-title">
        {snapshot.labels.map((label) => (
          <a href={href("Feed", { label })} key={label}>
            <span class="badge text-bg-primary me-1">{label}</span>
          </a>
        ))}
      </div>
    ) : null;

  const titleArea =
    snapshot.post_type !== "Comment" &&
    ((config.propVisibility.title ?? true) ||
      (config.propVisibility.type ?? true)) ? (
      <div class="card-text">
        <div className="row justify-content-between">
          <div class="col-9 gap-1">
            <i class={`bi ${iconsByPostType[snapshot.post_type]}`} />

            <span>
              {`${
                snapshot.post_type === "Submission"
                  ? "Solution"
                  : snapshot.post_type
              }${typeof snapshot.name === "string" ? ": " : ""}`}
            </span>

            <span>{snapshot.name}</span>
          </div>
        </div>
      </div>
    ) : null;

  const descriptionArea =
    snapshot.post_type == "Comment" ? (
      <div className="overflow-auto" style={{ maxHeight: "6em" }}>
        <Markdown class="card-text" text={snapshot.description}></Markdown>
      </div>
    ) : null;

  return (
    <AttractableDiv className="card border-secondary">
      {header}

      <div className="card-body">
        {titleArea}
        {descriptionArea}
        {tagList}
      </div>
    </AttractableDiv>
  );
};

return PostTicket(props);
