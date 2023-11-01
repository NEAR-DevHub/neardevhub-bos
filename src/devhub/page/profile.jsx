const accountId = props.accountId || context.accountId;

if (!accountId) {
  return "No Account Logged In!";
}

return (
  <div className="w-100 bg-white overflow-hidden px-3">
    <Widget src="mob.near/widget/ProfilePage" props={{ accountId }} />
  </div>
);
