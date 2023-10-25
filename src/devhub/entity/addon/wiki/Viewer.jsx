const { title, description, content } = props;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 10px 0;
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
  margin: 10px 0;
`;

const Content = styled.div`
  margin: 20px 0;
  text-align: left;
`;
const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

if (!title || !content) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>No Wiki Configured</h2>
    </CenteredMessage>
  );
} else {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Content>
        <Widget
          src={
            "${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"
          }
          props={{ text: content }}
        />
      </Content>
    </Container>
  );
}
