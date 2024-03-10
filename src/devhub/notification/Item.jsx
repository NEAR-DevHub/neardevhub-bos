const { value } = props;

return (
  <Widget
    src="mob.near/widget/Notification.Item.LR"
    props={{
      L: (
        <Widget
          src="devhub.near/widget/devhub.notification.Left"
          props={{ type: value.type, proposal: value.proposal }}
        />
      ),
      R: (
        <Widget
          src="devhub.near/widget/DevGov.notification.Right"
          props={{ proposal: value.proposal }}
        />
      ),
      ...props,
    }}
  />
);
