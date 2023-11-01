const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
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
