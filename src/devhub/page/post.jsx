const { id } = props;

const Container = styled.div`
  padding: 0 3rem 3rem 3rem;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding: 0 1rem 1rem 1rem;
  }
`;

return (
  <Container>
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.post.Post"}
      props={{
        id,
      }}
    />
  </Container>
);
