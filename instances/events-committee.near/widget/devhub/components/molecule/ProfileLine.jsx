const accountId = props.accountId ?? context.accountId;

return (
  <span>
    <Widget
      src="${REPL_MOB}/widget/ProfileLine"
      props={{
        ...props,
        accountId,
        link: `#/${REPL_MOB}/widget/ProfilePage?accountId=${accountId}`,
      }}
    />
    <Widget
      src="${REPL_EVENTS}/widget/devhub.components.molecule.BadgesList"
      props={{
        accountId,
        mode: "compact",
      }}
    />
  </span>
);
