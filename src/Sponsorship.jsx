const ownerId = "devgovgigs.near";
const sponsorship_id = props.sponsorship.id
  ? parseInt(props.sponsorship.id)
  : 0;
const sponsorship =
  props.sponsorship ??
  Near.view(ownerId, "get_sponsorship", { sponsorship_id });

function readableDate(timestamp) {
  var a = new Date(timestamp);
  return a.toDateString() + " " + a.toLocaleTimeString();
}

const timestamp = readableDate(
  sponsorship.timestamp ? sponsorship.timestamp / 1000000 : Date.now()
);

const onLike = () => {
  Near.call(ownerId, "like", {
    post_type: "Sponsorship",
    post_id: sponsorship_id,
  });
};

const commentsUnordered =
  Near.view(ownerId, "get_comments", {
    post_type: "Sponsorship",
    post_id: sponsorship_id,
  }) ?? [];

const comments = props.isPreview ? [] : commentsUnordered.reverse();
const containsLike = props.isPreview
  ? false
  : sponsorship.likes.find((l) => l.author_id == context.accountId);
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
          Like ({sponsorship.likes.length ?? 0})
        </a>
      </div>
      <div class="col-3">
        <a
          class="card-link"
          data-bs-toggle="collapse"
          href={`#collapseCommentEditorSponsorship${sponsorship_id}`}
          role="button"
          aria-expanded="false"
          aria-controls={`collapseCommentEditorSponsorship${sponsorship_id}`}
        >
          <i class={commentBtnClass}> </i> Comment ({comments.length ?? 0})
        </a>
      </div>
    </div>
    <div
      class="collapse"
      id={`collapseCommentEditorSponsorship${sponsorship_id}`}
    >
      <Widget
        src={`${ownerId}/widget/CommentEditor`}
        props={{
          comment: { post_type: "Sponsorship", post_id: sponsorship_id },
        }}
      />
    </div>
  </div>
);

const commentsList =
  props.isPreview || comments.length == 0 ? null : (
    <div class="row">
      <div class="row">
        <div class="col-4">
          <a
            class="card-link"
            data-bs-toggle="collapse"
            href={`#collapseCommentsListSponsorship${sponsorship_id}`}
            role="button"
            aria-expanded="false"
            aria-controls={`collapseCommentsListSponsorship${sponsorship_id}`}
          >
            <i class="bi bi-arrows-angle-expand"> </i> Expand Comments
          </a>
        </div>
      </div>
      <div
        class="collapse"
        id={`collapseCommentsListSponsorship${sponsorship_id}`}
      >
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

return (
  <Card className="card my-2 border-success">
    <div className="card-header">
      <small class="text-muted">
        <div class="row justify-content-between">
          <div class="col-4">
            {" "}
            <Widget
              src={`mob.near/widget/ProfileLine`}
              props={{ accountId: sponsorship.author_id }}
            />
          </div>
          <div class="col-4">
            {" "}
            <div class="d-flex justify-content-end">{timestamp}</div>
          </div>
        </div>
      </small>
    </div>
    <div className="card-body">
      <h5 class="card-title">
        <i class="bi bi-cash-coin"> </i>Sponsorship: {sponsorship.name}
      </h5>
      <h6 class="card-subtitle mb-2 text-muted">
        Maximum amount: {sponsorship.amount} {sponsorship.sponsorship_token}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Supervisor:{" "}
        <Widget
          src={`mob.near/widget/ProfileLine`}
          props={{ accountId: sponsorship.supervisor }}
        />
      </h6>
      <Markdown class="card-text" text={sponsorship.description}></Markdown>
      {buttonsFooter}
      {commentsList}
    </div>
  </Card>
);
