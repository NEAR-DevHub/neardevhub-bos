const { content, title, subtitle, textAlign } = props;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  padding: 0 3rem;

  margin: 0 auto;
  text-align: ${(p) => p.textAlign ?? "left"};

  h1 {
    color: #151515;
    font-size: 3.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 88px */
    margin: 1rem 0;
  }

  p.subtitle {
    color: #555;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 35.2px */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    padding: 0 1rem;

    span.category {
      font-size: 0.75rem;
    }

    h1 {
      font-size: 2rem;
    }

    p.subtitle {
      font-size: 1rem;
    }
  }

  a {
    color: #0000ee;
  }
`;

const Content = styled.div`
  margin: 20px 0;
  text-align: left;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  margin-bottom: 20px;
`;

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
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
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
