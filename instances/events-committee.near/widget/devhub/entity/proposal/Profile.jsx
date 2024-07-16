const accountId = props.accountId;
const size = props.size ?? "md";
const showAccountId = props.showAccountId;
const Avatar = styled.div`
  &.sm {
    min-width: 30px;
    max-width: 30px;
    min-height: 30px;
    max-height: 30px;
  }
  &.md {
    min-width: 40px;
    max-width: 40px;
    min-height: 40px;
    max-height: 40px;
  }
  pointer-events: none;
  flex-shrink: 0;
  border: 1px solid #eceef0;
  overflow: hidden;
  border-radius: 40px;
  transition: border-color 200ms;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    margin: 0 !important;
  }
`;
const profile = Social.get(`${accountId}/profile/**`, "final");
const profileUrl = `/near/widget/ProfilePage?accountId=${accountId}`;
return (
  <Link href={profileUrl}>
    <div className="d-flex gap-2 align-items-center">
      <Avatar className={size}>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: profile.image,
            alt: profile.name,
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
          }}
        />
      </Avatar>
      {showAccountId && (
        <div>
          {(accountId ?? "").substring(0, 20)}
          {(accountId ?? "").length > 20 ? "..." : ""}
        </div>
      )}
    </div>
  </Link>
);
