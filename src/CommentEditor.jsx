const ownerId = "devgovgigs.near";
const comment = props.comment;

initState({
  author_id: context.accountId,
  description: "",
});

const onClick = () => {
  Near.call(ownerId, "comment", {
    post_type: comment.post_type,
    post_id: comment.post_id,
    description: state.description,
  });
};

return (
  <div className="row">
    <div className="col-lg-6">
      <div>
        <h4>Comment Editor</h4>
      </div>
      <div className="mb-2">
        <textarea
          value={state.description}
          type="text"
          rows={6}
          className="form-control"
          onChange={(event) =>
            State.update({ description: event.target.value })
          }
        />
      </div>

      <a className="btn btn-outline-primary mb-2" onClick={onClick}>
        Submit
      </a>
    </div>

    <div className="col-lg-6">
      <div>
        <h4>Preview</h4>
        <br />
      </div>
      <Widget
        src={`${ownerId}/widget/Comment`}
        props={{
          comment: {
            author_id: context.accountId,
            description: state.description,
          },
          isPreview: true,
        }}
      />
    </div>
  </div>
);
