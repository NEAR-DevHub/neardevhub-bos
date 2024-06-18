const { value } = props;

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.notification.LR"
    props={{
      L: (
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.notification.Left"
          props={{ type: value.type, proposal: value.proposal }}
        />
      ),
      R: (
        <Widget
          src="${REPL_DEVHUB}/widget/DevGov.notification.Right"
          props={{ proposal: value.proposal }}
        />
      ),
      ...props,
    }}
  />
);
