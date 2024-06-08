const HomeSections = ["hero", "explore", "connect", "participate", "support"];

return (
  <>
    {HomeSections.map((it) => (
      <Widget
        src={`${alias_REPL_DEVHUB}/widget/devhub.components.island.${it}`}
        props={{ ...props }}
      />
    ))}
  </>
);
