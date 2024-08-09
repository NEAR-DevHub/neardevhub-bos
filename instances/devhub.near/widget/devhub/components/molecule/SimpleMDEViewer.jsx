const content = props.content ?? "";
const height = props.height ?? "200px";

const code = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {  
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      height: ${height};
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
        color: #3c697d;
        font-weight: 500 !important;
      }
  </style>
</head>
<body>
  <div id="content"></div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script>
    let isViewerInitialized = false;

    function updateContent(content) {
      document.getElementById('content').innerHTML = marked.parse(content);
    }

    window.addEventListener("message", (event) => {
      updateContent(event.data.content);
    });
  </script>
</body>
</html>
`;

return (
  <iframe
    srcDoc={code}
    message={{
      content: content,
    }}
    style={{ height: height }}
    className="w-100"
  />
);
