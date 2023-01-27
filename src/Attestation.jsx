const ownerId = "devgovgigs.near";
const attestation_id = props.attestation.id
  ? parseInt(props.attestation.id)
  : 0;
const attestation =
  props.attestation ??
  Near.view(ownerId, "get_attestation", { attestation_id });

function readableDate(timestamp) {
  var a = new Date(timestamp);
  return a.toDateString() + " " + a.toLocaleTimeString();
}

const timestamp = readableDate(
  attestation.timestamp ? attestation.timestamp / 1000000 : Date.now()
);

const onLike = () => {
  Near.call(ownerId, "like", {
    post_type: "Attestation",
    post_id: attestation_id,
  });
};

const commentsUnordered =
  Near.view(ownerId, "get_comments", {
    post_type: "Attestation",
    post_id: attestation_id,
  }) ?? [];

const comments = props.isPreview ? [] : commentsUnordered.reverse();
const likes = attestation.likes ?? [];
const containsLike = props.isPreview
  ? false
  : likes.find((l) => l.author_id == context.accountId);
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
          Like ({attestation.likes.length ?? 0})
        </a>
      </div>
      <div class="col-3">
        <a
          class="card-link"
          data-bs-toggle="collapse"
          href={`#collapseCommentEditorAttestation${attestation_id}`}
          role="button"
          aria-expanded="false"
          aria-controls={`collapseCommentEditorAttestation${attestation_id}`}
        >
          <i class={commentBtnClass}> </i> Comment ({comments.length ?? 0})
        </a>
      </div>
    </div>
    <div
      class="collapse"
      id={`collapseCommentEditorAttestation${attestation_id}`}
    >
      <Widget
        src={`${ownerId}/widget/CommentEditor`}
        props={{
          comment: { post_type: "Attestation", post_id: attestation_id },
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
            href={`#collapseCommentsListAttestation${attestation_id}`}
            role="button"
            aria-expanded="false"
            aria-controls={`collapseCommentsListAttestation${attestation_id}`}
          >
            <i class="bi bi-arrows-angle-expand"> </i> Expand Comments
          </a>
        </div>
      </div>
      <div
        class="collapse"
        id={`collapseCommentsListAttestation${attestation_id}`}
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
              props={{ accountId: attestation.author_id }}
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
        <i class="bi bi-check2-circle"> </i>Attestation: {attestation.name}
      </h5>
      <Markdown class="card-text" text={attestation.description}></Markdown>
      {buttonsFooter}
      {commentsList}
    </div>
  </Card>
);
