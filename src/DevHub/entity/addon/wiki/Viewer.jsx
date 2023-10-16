const { title, description, content, nearDevGovGigsWidgetsAccountId } = props;

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

return (
  <Container>
    <Title>{title}</Title>
    <Description>{description}</Description>
    <Content>
      <Widget
        src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.MarkdownViewer`}
        props={{ text: content }}
      />
    </Content>
  </Container>
);
