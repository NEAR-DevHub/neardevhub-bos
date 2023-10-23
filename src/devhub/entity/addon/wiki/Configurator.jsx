const { data, onChange } = props;

console.log(data);

const [content, setContent] = useState(data.content);

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

return (
  <Container>
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownEditor"}
      props={{ data: { content }, onChange: setContent }}
    />
  </Container>
);
