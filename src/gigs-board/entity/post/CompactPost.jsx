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

const postId = props.post.id ?? (props.id ? parseInt(props.id) : 0);
const post =
  props.post ??
  Near.view(nearDevGovGigsContractAccountId, "get_post", { post_id: postId });
if (!post) {
  return <div>Loading ...</div>;
}
const snapshot = post.snapshot;

const shareButton = (
  <a
    class="card-link"
    href={href("Post", { id: postId })}
    role="button"
    target="_blank"
    title="Open in new tab"
  >
    <div class="bi bi-share"></div>
  </a>
);

const header = (
  <div className="card-header">
    <small class="text-muted">
      <div class="row justify-content-between">
        <div class="col-4">
          <a
            href={`#/neardevgov.near/widget/ProfilePage?accountId=${post.author_id}`}
            className="link-dark text-truncate"
          >
            <Widget
              src="${REPL_MOB}/widget/ProfileImage"
              props={{
                metadata,
                accountId: post.author_id,
                widgetName,
                style: { height: "1.5em", width: "1.5em", minWidth: "1.5em" },
              }}
            />
            <span className="text-muted">@{post.author_id}</span>
          </a>
        </div>
        <div class="col-5">
          <div class="d-flex justify-content-end">{shareButton}</div>
        </div>
      </div>
    </small>
  </div>
);

const emptyIcons = {
  Idea: "bi-lightbulb",
  Comment: "bi-chat",
  Submission: "bi-rocket",
  Attestation: "bi-check-circle",
  Sponsorship: "bi-cash-coin",
};

const borders = {
  Idea: "border-secondary",
  Comment: "border-secondary",
  Submission: "border-secondary",
  Attestation: "border-secondary",
  Sponsorship: "border-secondary",
};

const renamedPostType =
  snapshot.post_type == "Submission" ? "Solution" : snapshot.post_type;

const postLables = post.snapshot.labels ? (
  <div class="card-title">
    {post.snapshot.labels.map((label) => (
      <a href={href("Feed", { label })} key={label}>
        <span class="badge text-bg-primary me-1">{label}</span>
      </a>
    ))}
  </div>
) : null;

const postTitle =
  snapshot.post_type == "Comment" ? null : (
    <div class="card-text">
      <div className="row justify-content-between">
        <div class="col-9">
          <i class={`bi ${emptyIcons[snapshot.post_type]}`}> </i>
          {renamedPostType}: {snapshot.name}
        </div>
      </div>
    </div>
  );

const LimitedMarkdown = styled.div`
  max-height: 6em;
`;

// Should make sure the posts under the currently top viewed post are limited in size.
const descriptionArea =
  snapshot.post_type == "Comment" ? (
    <LimitedMarkdown className="overflow-auto">
      {widget("components.molecule.markdown-viewer", {
        text: snapshot.description,
      })}
    </LimitedMarkdown>
  ) : null;

return (
  <AttractableDiv className={`card my-2 ${borders[snapshot.post_type]}`}>
    {header}
    <div className="card-body">
      {postTitle}
      {descriptionArea}
      {postLables}
    </div>
  </AttractableDiv>
);
