const ownerId = "devgovgigs.near";
const submission_id = props.submission.id ? parseInt(props.submission.id) : 0;
const submission =
  props.submission ?? Near.view(ownerId, "get_submission", { submission_id });

function readableDate(timestamp) {
  var a = new Date(timestamp);
  return a.toDateString() + " " + a.toLocaleTimeString();
}

const timestamp = readableDate(
  submission.timestamp ? submission.timestamp / 1000000 : Date.now()
);

const attestations = props.isPreview
  ? null
  : Near.view(ownerId, "get_attestations", {
      submission_id,
    });

const sponsorships = props.isPreview
  ? null
  : Near.view(ownerId, "get_sponsorships", {
      submission_id,
    });

const commentsUnordered =
  Near.view(ownerId, "get_comments", {
    post_type: "Submission",
    post_id: submission_id,
  }) ?? [];

const comments = props.isPreview ? [] : commentsUnordered.reverse();
const containsLike = props.isPreview
  ? false
  : submission.likes.find((l) => l.author_id == context.accountId);
const likeBtnClass = containsLike ? "bi bi-heart-fill" : "bi bi-heart";
const containsComment = props.isPreview
  ? false
  : comments.find((c) => c.author_id == context.accountId);
const commentBtnClass = containsComment ? "bi bi-chat-fill" : "bi bi-chat";

const onLike = () => {
  Near.call(ownerId, "like", {
    post_type: "Submission",
    post_id: submission_id,
  });
};

const buttonsFooter = props.isPreview ? null : (
  <div class="row">
    <div class="row">
      <div class="col-2">
        <a
          class="card-link"
          data-bs-toggle="collapse"
          href={`#collapseAttestationEditor${submission_id}`}
          role="button"
          aria-expanded="false"
          aria-controls={`collapseAttestationEditor${submission_id}`}
        >
          <i class="bi bi-check2-circle"> </i> Attest
        </a>
      </div>
      <div class="col-2">
        <a
          class="card-link"
          data-bs-toggle="collapse"
          href={`#collapseSponsorshipEditor${submission_id}`}
          role="button"
          aria-expanded="false"
          aria-controls={`collapseSponsorshipEditor${submission_id}`}
        >
          <i class="bi bi-cash-coin"> </i> Sponsor
        </a>
      </div>
      <div class="col-2" onClick={onLike}>
        <a class={likeBtnClass} role="button">
          {" "}
          Like ({submission.likes.length ?? 0})
        </a>
      </div>
      <div class="col-3">
        <a
          class="card-link"
          data-bs-toggle="collapse"
          href={`#collapseCommentEditorSubmission${submission_id}`}
          role="button"
          aria-expanded="false"
          aria-controls={`collapseCommentEditorSubmission${submission_id}`}
        >
          <i class={commentBtnClass}> </i> Comment ({comments.length ?? 0})
        </a>
      </div>
    </div>
    <div class="collapse" id={`collapseAttestationEditor${submission_id}`}>
      <Widget
        src={`${ownerId}/widget/AttestationEditor`}
        props={{ attestation: { submission_id } }}
      />
    </div>
    <div class="collapse" id={`collapseSponsorshipEditor${submission_id}`}>
      <Widget
        src={`${ownerId}/widget/SponsorshipEditor`}
        props={{ sponsorship: { submission_id } }}
      />
    </div>
    <div
      class="collapse"
      id={`collapseCommentEditorSubmission${submission_id}`}
    >
      <Widget
        src={`${ownerId}/widget/CommentEditor`}
        props={{ comment: { post_type: "Submission", post_id: submission_id } }}
      />
    </div>
  </div>
);

const attestationsList = props.isPreview ? null : (
  <div class="row">
    <div>
      {attestations
        ? attestations.map((attestation) => {
            return (
              <Widget
                src={`${ownerId}/widget/Attestation`}
                props={{ attestation }}
              />
            );
          })
        : ""}
    </div>
  </div>
);

const sponsorshipsList = props.isPreview ? null : (
  <div class="row">
    <div>
      {sponsorships
        ? sponsorships.map((sponsorship) => {
            return (
              <Widget
                src={`${ownerId}/widget/Sponsorship`}
                props={{ sponsorship }}
              />
            );
          })
        : ""}
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
            href={`#collapseCommentsListSubmission${submission_id}`}
            role="button"
            aria-expanded="false"
            aria-controls={`collapseCommentsListSubmission${submission_id}`}
          >
            <i class="bi bi-arrows-angle-expand"> </i> Expand Comments
          </a>
        </div>
      </div>
      <div
        class="collapse"
        id={`collapseCommentsListSubmission${submission_id}`}
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
  <Card className="card my-2 border-secondary">
    <div className="card-header">
      <small class="text-muted">
        <div class="row justify-content-between">
          <div class="col-4">
            <Widget
              src={`mob.near/widget/ProfileLine`}
              props={{ accountId: submission.author_id }}
            />
          </div>
          <div class="col-4">
            <div class="d-flex justify-content-end">{timestamp}</div>
          </div>
        </div>
      </small>
    </div>
    <div className="card-body">
      <h5 class="card-title">
        <div className="row justify-content-between">
          <div class="col-10">
            <i class="bi bi-rocket"> </i>Submission: {submission.name}
          </div>
        </div>
      </h5>
      <Markdown class="card-text" text={submission.description}></Markdown>
      {buttonsFooter}
      {attestationsList}
      {sponsorshipsList}
      {commentsList}
    </div>
  </Card>
);
