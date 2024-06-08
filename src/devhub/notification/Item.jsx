const { value } = props;

return (
  <Widget
    src="devhub.near/widget/devhub.notification.LR"
    props={{
      L: (
        <Widget
          src="devhub.near/widget/devhub.notification.Left"
          props={value}
        />
      ),
      R: (
        <Widget
          src="devhub.near/widget/DevGov.notification.Right"
          props={value}
        />
      ),
      ...props,
    }}
  />
);
