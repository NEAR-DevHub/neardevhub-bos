const profile = Social.getr(
  `${REPL_TREASURY_TEMPLAR_CONTRACT}/profile`,
  "final",
  {
    subscribe: true,
  }
);

if (!profile) {
  <div
    style={{ height: "50vh" }}
    className="d-flex justify-content-center align-items-center w-100"
  >
    <Widget src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner`} />
  </div>;
}

return (
  <div style={{ width: "-webkit-fill-available" }} className="p-3">
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDEViewer`}
      props={{
        content: profile.description,
      }}
    />
  </div>
);
