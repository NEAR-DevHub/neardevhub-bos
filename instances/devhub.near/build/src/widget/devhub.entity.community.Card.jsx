const { href } = VM.require("devhub.near/widget/core.lib.url");
if (!href) {
  return <></>;
}
const Card = styled.div`
  cursor: pointer;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  gap: 1rem;
  height: 100%;
  min-height: 12rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 300ms;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
  img.logo {
    height: 6rem;
    width: 6rem;
    border-radius: 50%;
    object-fit: cover;
  }
  h3,
  p {
    margin: 0;
  }
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }
  p {
    font-size: 1rem;
    font-weight: 400;
  }
`;
const CommunityCard = ({ metadata }) => {
  const { handle, logo_url, name, description } = metadata;
  const link = href({
    widgetSrc: "devhub.near/widget/app",
    params: { page: "community", handle: handle },
  });
  return (
    <Link to={link} style={{ all: "unset" }}>
      <Card>
        <img className="logo" src={logo_url} />
        <div className="d-flex flex-column justify-content-center gap-1 w-100">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </Card>
    </Link>
  );
};
return CommunityCard(props);
