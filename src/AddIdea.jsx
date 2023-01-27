initState({ name: "", description: "" });

const onClick = () => {
  Near.call("devgovgigs.near", "add_idea", {
    name: state.name,
    description: state.description,
  });
};

const handleChange = (event) => {
  State.update({ description: event.target.value });
};

return (
  <div>
    <h2>Add Idea</h2>
    <p>
      Title: <input type="text" value={state.name} />
    </p>
    <p>Description:</p>
    <textarea value={state.description} onChange={handleChange} />
    <p>
      <a className="btn btn-outline-primary ms-2" onClick={onClick}>
        Submit
      </a>
    </p>
  </div>
);
