const ownerId = "devgovgigs.near";
const submission_id = props.submission_id ? parseInt(props.submission_id) : 0;

initState({
  name: "",
  description: "",
});

const onClick = () => {
  Near.call(ownerId, "add_attestation", {
    submission_id,
    name: state.name,
    description: state.description,
  });
};

return (
  <div className="row">
    <div className="col-lg-6">
      <div>
        <h4>Attestation Editor</h4>
      </div>
      <div className="mb-2">
        Title:
        <input
          type="text"
          value={state.name}
          onChange={(event) => State.update({ name: event.target.value })}
        />
      </div>

      <div className="mb-2">
        Description:
        <br />
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
        src={`${ownerId}/widget/Attestation`}
        props={{
          attestation: {
            author_id: context.accountId,
            name: state.name,
            description: state.description,
          },
          isPreview: true,
        }}
      />
    </div>
  </div>
);
