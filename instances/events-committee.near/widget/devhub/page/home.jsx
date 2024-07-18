const HomeSections = ["hero", "explore", "connect", "participate", "support"];

return (
  <>
    {HomeSections.map((it) => (
      <Widget
        src={`${REPL_EVENTS}/widget/devhub.components.island.${it}`}
        props={{ ...props }}
      />
    ))}
  </>
);
