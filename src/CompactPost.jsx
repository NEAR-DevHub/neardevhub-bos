const ownerId = "devgovgigs.near";
const postId = props.post.id ?? (props.id ? parseInt(props.id) : 0);
const post = props.post ?? Near.view(ownerId, "get_post", { post_id: postId });
if (!post) {
  return <div>Loading ...</div>;
}
const snapshot = post.snapshot;

const shareButton = (
  <a
    class="card-link"
    href={`https://near.social/#/devgovgigs.near/widget/Ideas?postId=${postId}`}
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
            href={`#/mob.near/widget/ProfilePage?accountId=${post.author_id}`}
            className="link-dark text-truncate"
          >
            <Widget
              src="mob.near/widget/ProfileImage"
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
    {post.snapshot.labels.map((label) => {
      return (
        <a
          href={`https://near.social/#/devgovgigs.near/widget/Ideas?label=${label}`}
        >
          <span class="badge text-bg-primary me-1">{label}</span>
        </a>
      );
    })}
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

const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }

`;

const limitedMarkdown = styled.div`
      max-height: 6em;
`;

// Should make sure the posts under the currently top viewed post are limited in size.
const descriptionArea =
  snapshot.post_type == "Comment" ? (
    <limitedMarkdown className="overflow-auto">
      <Markdown class="card-text" text={snapshot.description}></Markdown>
    </limitedMarkdown>
  ) : null;

return (
  <Card className={`card my-2 ${borders[snapshot.post_type]}`}>
    {header}
    <div className="card-body">
      {postTitle}
      {descriptionArea}
      {postLables}
    </div>
  </Card>
);
