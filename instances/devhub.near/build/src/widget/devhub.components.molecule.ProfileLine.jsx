const accountId = props.accountId ?? context.accountId;
return (
  <span>
    <Widget
      src="mob.near/widget/ProfileLine"
      props={{
        ...props,
        accountId,
        link: `#/mob.near/widget/ProfilePage?accountId=${accountId}`,
      }}
    />
    <Widget
      src="devhub.near/widget/devhub.components.molecule.BadgesList"
      props={{
        accountId,
        mode: "compact",
      }}
    />
  </span>
);
