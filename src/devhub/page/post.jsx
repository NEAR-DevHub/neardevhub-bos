const { id } = props;

const Container = styled.div`
  padding: 1rem 3rem;

  @media screen and (max-width: 768px) {
    padding: 1rem;
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
