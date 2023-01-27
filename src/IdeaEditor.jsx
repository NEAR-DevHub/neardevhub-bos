const ownerId = "devgovgigs.near";
const postId = props.post.id ?? (props.id ? parseInt(props.id) : 0);
const post = props.post ?? Near.view(ownerId, "get_post", { post_id: postId });
const snapshot = post.snapshot;
// If this post is displayed under another post. Used to limit the size and decide whether to show link to parent.
const isUnderPost = props.isUnderPost ? true : false;
const parentId = isUnderPost
  ? null
  : Near.view(ownerId, "get_parent_id", { post_id: postId });

const childPostIdsUnordered =
  Near.view(ownerId, "get_children_ids", {
    post_id: postId,
  }) ?? [];

const childPostIds = props.isPreview ? [] : childPostIdsUnordered.reverse();

function readableDate(timestamp) {
  var a = new Date(timestamp);
  return a.toDateString() + " " + a.toLocaleTimeString();
}

const timestamp = readableDate(
  snapshot.timestamp ? snapshot.timestamp / 1000000 : Date.now()
);

const parentLink = isUnderPost ? null : (
  <div className="card-header">
    <a
      href={`https://near.social/#/devgovgigs.near/widget/Post?id=${parentId}`}
    >
      <i class="bi bi-arrow-90deg-up"></i>Go to parent post
    </a>
  </div>
);

const allowedToEdit =
  !props.isPreview &&
  Near.view(ownerId, "is_allowed_to_edit", {
    post_id: postId,
    editor: context.accountId,
  }) == "true";

const btnEditorWidget = (postType, name) => {
  return (
    <li>
      <a
        class="dropdown-item"
        href="#"
        data-bs-toggle="collapse"
        href={`#collapse${postType}Editor${postId}`}
        role="button"
        aria-expanded="false"
        aria-controls={`collapse${postType}Editor${postId}`}
      >
        {name}
      </a>
    </li>
  );
};

const editControl = !allowedToEdit ? (
  <div class="btn-group" role="group">
    <a
      class="card-link px-2"
      role="button"
      title="Edit post"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      type="button"
    >
      <div class="bi bi-pencil-square"></div>
    </a>
    <ul class="dropdown-menu">
      {btnEditorWidget("Idea", "Edit as an idea")}
      {btnEditorWidget("Submission", "Edit as a solution")}
      {btnEditorWidget("Attestation", "Edit as an attestation")}
      {btnEditorWidget("Sponsorship", "Edit as a sponsorship")}
      {btnEditorWidget("Comment", "Edit as a comment")}
    </ul>
  </div>
) : null;

const shareButton = props.isPreview ? null : (
  <a
    class="card-link"
    href={`https://near.social/#/devgovgigs.near/widget/Post?id=${postId}`}
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
          <Widget
            src={`mob.near/widget/ProfileLine`}
            props={{ accountId: post.author_id }}
          />
        </div>
        <div class="col-5">
          <div class="d-flex justify-content-end">
            {editControl}
            {timestamp}
            <div class="bi bi-clock-history px-2"></div>
            {shareButton}
          </div>
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
  Like: "bi-heart",
  Reply: "bi-reply",
};

const fillIcons = {
  Idea: "bi-lightbulb-fill",
  Comment: "bi-chat-fill",
  Submission: "bi-rocket-fill",
  Attestation: "bi-check-circle-fill",
  Sponsorship: "bi-cash-coin",
  Like: "bi-heart-fill",
  Reply: "bi-reply-fill",
};

const borders = {
  Idea: "border-secondary",
  Comment: "border-secondary",
  Submission: "border-secondary",
  Attestation: "border-secondary",
  Sponsorship: "border-secondary",
};

const containsLike = props.isPreview
  ? false
  : post.likes.find((l) => l.author_id == context.accountId);
const likeBtnClass = containsLike ? fillIcons.Like : emptyIcons.Like;
const onLike = () => {
  Near.call(ownerId, "add_like", {
    post_id: postId,
  });
};

const btnCreatorWidget = (postType, icon, name) => {
  return (
    <li>
      <a
        class="dropdown-item"
        href="#"
        data-bs-toggle="collapse"
        href={`#collapse${postType}Creator${postId}`}
        role="button"
        aria-expanded="false"
        aria-controls={`collapse${postType}Creator${postId}`}
      >
        <i class={`bi ${icon}`}> </i> {name}
      </a>
    </li>
  );
};

const buttonsFooter = props.isPreview ? null : (
  <div class="row">
    <div class="col-8">
      <div class="btn-group" role="group" aria-label="Basic outlined example">
        <button
          type="button"
          class="btn btn-outline-primary"
          style={{ border: "0px" }}
          onClick={onLike}
        >
          <i class={`bi ${likeBtnClass}`}> </i>
          Like ({post.likes.length ?? 0})
        </button>
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-outline-primary"
            style={{ border: "0px" }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class={`bi ${emptyIcons.Reply}`}> </i> Reply
          </button>
          <ul class="dropdown-menu">
            {btnCreatorWidget("Idea", emptyIcons.Idea, "Idea")}
            {btnCreatorWidget("Submission", emptyIcons.Submission, "Solution")}
            {btnCreatorWidget(
              "Attestation",
              emptyIcons.Attestation,
              "Attestation"
            )}
            {btnCreatorWidget(
              "Sponsorship",
              emptyIcons.Sponsorship,
              "Sponsorship"
            )}
            <li>
              <hr class="dropdown-divider" />
            </li>
            {btnCreatorWidget("Comment", emptyIcons.Comment, "Comment")}
          </ul>
        </div>
        <button
          type="button"
          class="btn btn-outline-primary"
          style={{ border: "0px" }}
          data-bs-toggle="collapse"
          href={`#collapseChildPosts${postId}`}
          aria-expanded="false"
          aria-controls={`collapseChildPosts${postId}`}
        >
          <i class="bi bi-arrows-expand"> </i>{" "}
          {`Expand Replies (${childPostIds.length})`}
        </button>
      </div>
    </div>
  </div>
);

const CreatorWidget = (postType) => {
  return (
    <div
      class="collapse"
      id={`collapse${postType}Creator${postId}`}
      data-bs-parent={`#accordion${postId}`}
    >
      <Widget
        src={`${ownerId}/widget/PostEditor`}
        props={{
          postType,
          parentId: postId,
          mode: "Create",
        }}
      />
    </div>
  );
};

const EditorWidget = (postType) => {
  return (
    <div
      class="collapse"
      id={`collapse${postType}Editor${postId}`}
      data-bs-parent={`#accordion${postId}`}
    >
      <Widget
        src={`${ownerId}/widget/PostEditor`}
        props={{
          postType,
          id: postId,
          mode: "Edit",
          author_id: post.author_id,
          labels: post.snapshot.labels,
          name: post.snapshot.name,
          description: post.snapshot.description,
          amount: post.snapshot.amount,
          token: post.snapshot.token,
          supervisor: post.snapshot.supervisor,
        }}
      />
    </div>
  );
};

const editorsFooter = props.isPreview ? null : (
  <div class="row" id={`accordion${postId}`}>
    {CreatorWidget("Comment")}
    {EditorWidget("Comment")}
    {CreatorWidget("Idea")}
    {EditorWidget("Idea")}
    {CreatorWidget("Submission")}
    {EditorWidget("Submission")}
    {CreatorWidget("Attestation")}
    {EditorWidget("Attestation")}
    {CreatorWidget("Sponsorship")}
    {EditorWidget("Sponsorship")}
  </div>
);

const renamedPostType =
  snapshot.post_type == "Submission" ? "Solution" : snapshot.post_type;

const postLables = post.snapshot.labels ? (
  <div class="card-title">
    {post.snapshot.labels.map((label) => {
      return <span class="badge text-bg-primary me-1">{label}</span>;
    })}
  </div>
) : null;

const postTitle =
  snapshot.post_type == "Comment" ? null : (
    <h5 class="card-title">
      <div className="row justify-content-between">
        <div class="col-9">
          <i class={`bi ${emptyIcons[snapshot.post_type]}`}> </i>
          {renamedPostType}: {snapshot.name}
        </div>
      </div>
    </h5>
  );

const postExtra =
  snapshot.post_type == "Sponsorship" ? (
    <div>
      <h6 class="card-subtitle mb-2 text-muted">
        Maximum amount: {snapshot.amount} {snapshot.sponsorship_token}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Supervisor:{" "}
        <Widget
          src={`mob.near/widget/ProfileLine`}
          props={{ accountId: snapshot.supervisor }}
        />
      </h6>
    </div>
  ) : null;

const postsList =
  props.isPreview || childPostIds.length == 0 ? null : (
    <div class="row">
      <div class="collapse" id={`collapseChildPosts${postId}`}>
        {childPostIds
          ? childPostIds.map((childId) => {
              return (
                <Widget
                  src={`${ownerId}/widget/Post`}
                  props={{ id: childId, isUnderPost: true }}
                />
              );
            })
          : ""}
      </div>
    </div>
  );

const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }

`;

const limitedMarkdown = styled.div`
      max-height: 20em;
`;

// Should make sure the posts under the currently top viewed post are limited in size.
const descriptionArea = isUnderPost ? (
  <limitedMarkdown className="overflow-auto">
    <Markdown class="card-text" text={snapshot.description}></Markdown>
  </limitedMarkdown>
) : (
  <Markdown class="card-text" text={snapshot.description}></Markdown>
);

return (
  <Card className={`card my-2 ${borders[snapshot.post_type]}`}>
    {parentLink}
    {header}
    <div className="card-body">
      {postLables}
      {postTitle}
      {postExtra}
      {descriptionArea}
      {buttonsFooter}
      {editorsFooter}
      {postsList}
    </div>
  </Card>
);
