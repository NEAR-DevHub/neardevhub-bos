const accountId = props.accountId;
const Avatar = styled.div`
  min-width: 40px;
  max-width: 40px;
  min-height: 40px;
  max-height: 40px;
  pointer-events: none;

  img {
    object-fit: cover;
    border-radius: 40px;
    width: 100%;
    height: 100%;
  }
`;
const profile = Social.get(`${accountId}/profile/**`, "final");

return (
  <Avatar>
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
);
