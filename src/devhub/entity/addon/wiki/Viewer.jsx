const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

const { content, title, description, textAlign } = props;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: ${(p) => p.textAlign ?? "left"};
`;

const Content = styled.div`
  margin: 20px 0;
  text-align: left;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const Description = styled.p`
  margin-bottom: 20px;
`;

if (!content) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>No Wiki Configured</h2>
    </CenteredMessage>
  );
} else {
  return (
    <Container textAlign={textAlign}>
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
