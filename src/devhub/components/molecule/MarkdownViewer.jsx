const Wrapper = styled.div`
  p {
    white-space: pre-line; // This ensures text breaks to new line

    span {
      white-space: normal; // and this ensures profile links look normal
    }
  }

  blockquote {
    margin: 1em 0;
    padding-left: 1.5em;
    border-left: 4px solid #ccc;
    color: #666;
    font-style: italic;
    font-size: inherit;
  }

  pre {
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1em;
    overflow-x: auto;
    font-family: "Courier New", Courier, monospace;
  }
`;

const Embedded = styled.span`
  white-space: normal;

  p {
    white-space: normal;
  }
`;

const renderMention =
  props.renderMention ??
  ((accountId) => (
    <span key={accountId} className="d-inline-flex" style={{ fontWeight: 500 }}>
      <Widget
        src="neardevgov.near/widget/ProfileLine"
        props={{
          accountId: accountId.toLowerCase(),
          hideAccountId: true,
          tooltip: true,
        }}
      />
    </span>
  ));

return (
  <Wrapper>
    <Markdown text={props.text} onMention={renderMention} />
  </Wrapper>
);
