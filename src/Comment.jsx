const ownerId = "devgovgigs.near";
const comment_id = props.comment.id ? parseInt(props.comment.id) : 0;
const comment =
  props.comment ?? Near.view(ownerId, "get_comment", { comment_id });

function readableDate(timestamp) {
  var a = new Date(timestamp);
  return a.toDateString() + " " + a.toLocaleTimeString();
}

const timestamp = readableDate(
  comment.timestamp ? comment.timestamp / 1000000 : Date.now()
);

const onLike = () => {
  Near.call(ownerId, "like", {
    post_type: "Comment",
    post_id: comment_id,
  });
};

const commentsUnordered =
  Near.view(ownerId, "get_comments", {
    post_type: "Comment",
    post_id: comment_id,
  }) ?? [];

const comments = props.isPreview ? [] : commentsUnordered.reverse();
const containsLike = props.isPreview
  ? false
  : comment.likes.find((l) => l.author_id == context.accountId);
const likeBtnClass = containsLike ? "bi bi-heart-fill" : "bi bi-heart";
const containsComment = props.isPreview
  ? false
  : comments.find((c) => c.author_id == context.accountId);
const commentBtnClass = containsComment ? "bi bi-chat-fill" : "bi bi-chat";

const buttonsFooter = props.isPreview ? null : (
  <div class="row">
    <div class="row">
      <div class="col-2" onClick={onLike}>
        <a class={likeBtnClass} role="button">
          {" "}
          Like ({comment.likes.length ?? 0})
        </a>
      </div>
      <div class="col-3">
        <a
          class="card-link"
          data-bs-toggle="collapse"
          href={`#collapseCommentEditorComment${comment_id}`}
          role="button"
          aria-expanded="false"
          aria-controls={`collapseCommentEditorComment${comment_id}`}
        >
          <i class={commentBtnClass}> </i> Comment ({comments.length ?? 0})
        </a>
      </div>
    </div>
    <div class="collapse" id={`collapseCommentEditorComment${comment_id}`}>
      <Widget
        src={`${ownerId}/widget/CommentEditor`}
        props={{ comment: { post_type: "Comment", post_id: comment_id } }}
      />
    </div>
  </div>
);

const commentsList = props.isPreview ? null : (
  <div class="row">
    <div>
      {comments
        ? comments.map((comment) => {
            return (
              <Widget src={`${ownerId}/widget/Comment`} props={{ comment }} />
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

return (
  <Card className="card my-2 border-light">
    <div className="card-header">
      <small class="text-muted">
        <div class="row justify-content-between">
          <div class="col-4">
            <Widget
              src={`mob.near/widget/ProfileLine`}
              props={{ accountId: comment.author_id }}
            />
          </div>
          <div class="col-4">
            <div class="d-flex justify-content-end">{timestamp}</div>
          </div>
        </div>
      </small>
    </div>
    <div className="card-body">
      <limitedMarkdown className="overflow-auto">
        <Markdown class="card-text" text={comment.description}></Markdown>
      </limitedMarkdown>
      {buttonsFooter}
      {commentsList}
    </div>
  </Card>
);
