const HomeSections = ["hero", "explore", "connect", "contribute", "support"];

return (
  <>
    {HomeSections.map((it) => (
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.entity.home.${it}`}
        props={{ ...props }}
      />
    ))}
  </>
);
