const accountId = props.accountId ?? context.accountId;

return (
  <span>
    <Widget
      src="${alias_REPL_MOB}/widget/ProfileLine"
      props={{
        ...props,
        accountId,
        link: `#/${alias_REPL_MOB}/widget/ProfilePage?accountId=${accountId}`,
      }}
    />
    <Widget
      src="${alias_REPL_DEVHUB}/widget/devhub.components.molecule.BadgesList"
      props={{
        accountId,
        mode: "compact",
      }}
    />
  </span>
);
