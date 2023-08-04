/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const ProfileCard = (props) => {
  const accountId = props.accountId ?? context.accountId;
  const link = props.link ?? true;
  const hideAccountId = props.hideAccountId;
  const hideName = props.hideName;
  const hideImage = props.hideImage;

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
            style: { width: "3em", height: "3em", marginRight: "0.3em" },
            profile,
            accountId,
            className: "d-inline-block",
            imageClassName: "rounded-circle w-100 h-100 align-top",
          }}
        />
      )}
      <div className="d-flex flex-column">
        {!hideName && (
          <span key="name" className="fw-bold">
            {name}
          </span>
        )}
        {!hideAccountId && (
          <span key="accountId" className="text-muted">
            @{accountId}
          </span>
        )}
      </div>
    </div>
  );

  inner = link ? (
    <a
      href={
        link !== true
          ? link
          : `#/mob.near/widget/ProfilePage?accountId=${accountId}`
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
