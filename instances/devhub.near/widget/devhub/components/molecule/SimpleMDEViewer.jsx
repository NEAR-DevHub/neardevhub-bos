const content = props.content ?? "";
const embeddCSS = props.embeddCSS;

const simplemdeCss = fetch(
  "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css"
).body;
const githubCss = fetch(
  "https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css"
).body;

const bootstrapCss = fetch(
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
).body;

if (!simplemdeCss || !githubCss || !bootstrapCss) return "";

const CssContainer = styled.div`
  ${githubCss}
  ${simplemdeCss}
  
  font-size:14px;
  p {
    span {
      white-space: normal;
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

  a {
    color: #04a46e;
  }

  .remove-underline a {
    text-decoration: none !important;
  }

  ${embeddCSS}
`;

const renderMention =
  props.renderMention ??
  ((accountId) => (
    <span
      key={accountId}
      className="d-inline-flex remove-underline"
      style={{ fontWeight: 500 }}
    >
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.molecule.ProfileLine"
        props={{
          accountId: accountId.toLowerCase(),
          hideAccountId: true,
          tooltip: true,
        }}
      />
    </span>
  ));

const processedContent = content
  .replace(/<br\s*\/?>/gi, "  \n")
  .replace(/\n/g, "  \n");
return (
  <CssContainer>
    <Markdown text={processedContent} onMention={renderMention} />
  </CssContainer>
);
