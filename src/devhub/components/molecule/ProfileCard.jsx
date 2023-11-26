const MutedText = styled.span`
  color: #818181;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 125% */
`;

const AccountName = styled.span`
  color: #818181;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;

  max-width: 30ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileCard = (props) => {
  const accountId = props.accountId ?? context.accountId;
  const link = props.link ?? true;
  // const hideAccountId = props.hideAccountId;
  // const hideName = props.hideName;
  const hideImage = props.hideImage;
  const iconOnly = props.iconOnly;

  const profile = props.profile ?? Social.getr(`${accountId}/profile`);

  const name = profile.name ?? accountId;
  const title = props.title ?? `${name} @${accountId}`;
  const tooltip =
    props.tooltip && (props.tooltip === true ? title : props.tooltip);

  let inner = (
    <div className="d-flex flex-row justify-content-center align-items-center">
      {!hideImage && (
        <Widget
          key="image"
          src="mob.near/widget/ProfileImage"
          props={{
            style: { width: "2.5em", height: "2.5em", marginRight: "0.3em" },
            profile,
            accountId,
            className: "d-inline-block flex-shrink-0",
            imageClassName: "rounded-circle w-100 h-100 align-top",
          }}
        />
      )}
      {!iconOnly && (
        <div className="d-flex flex-column gap-1">
          <AccountName key="accountName">{name}</AccountName>
          <AccountName key="accountId">@{accountId}</AccountName>
        </div>
      )}
    </div>
  );

  inner = link ? (
    <a
      href={
        link !== true
          ? link
          : `/${REPL_MOB}/widget/ProfilePage?accountId=${accountId}`
      }
      className="link-dark text-truncate d-inline-flex"
    >
      {inner}
    </a>
  ) : (
    <span className="text-truncate d-inline-flex">{inner}</span>
  );

  if (props.tooltip === true) {
    return (
      <Widget
        src="mob.near/widget/Profile.OverlayTrigger"
        props={{ accountId, children: inner }}
      />
    );
  }
  if (tooltip) {
    inner = (
      <OverlayTrigger placement="auto" overlay={<Tooltip>{tooltip}</Tooltip>}>
        {inner}
      </OverlayTrigger>
    );
  }
  return (
    <div className="d-flex flex-row align-items-center">
      {inner}
      <Widget
        src="neardevgov.near/widget/BadgesList"
        props={{
          accountId,
          mode: "compact",
        }}
      />
    </div>
  );
};

return ProfileCard(props);
