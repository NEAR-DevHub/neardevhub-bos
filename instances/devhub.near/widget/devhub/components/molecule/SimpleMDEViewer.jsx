const content = props.content ?? "";
const height = props.height;
const [iframeHeight, setIframeHeight] = useState("100px");

const code = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {  
          margin: 0;
          overflow: ${height ? "auto" : "hidden"};
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          font-size:14px;
          line-height:1.5;
        }

        blockquote {
          margin: 1em 0;
          padding-left: 1.5em;
          border-left: 4px solid #ccc;
          color: #666;
          font-style: italic;
          font-size: inherit;
        }
    
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    </head> 
    <body>
      <div id="content"></div>
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      <script>
      
      function convertNewlinesToBr(text) {
        // Replace all newline characters with <br>
        return text.replace(/(?:\\r\\n|\\r|\\n)/g, '<p></p>');
      }

      function updateContent(content) {
        const html = marked.parse(content);
        const parsedContent = convertNewlinesToBr(html);
        document.getElementById('content').innerHTML = parsedContent;

        const newHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        
        window.parent.postMessage({
          handler: 'IFRAME_HEIGHT',
          height: newHeight
        }, '*');
      }

      window.addEventListener('message', (event) => {
        if (event.data.content) {
          updateContent(event.data.content);
        }
      });

      window.addEventListener('load', () => {
        window.parent.postMessage({
          handler: 'IFRAME_HEIGHT',
          height: document.body.scrollHeight
        }, '*');
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
    style={{ height: height ?? iframeHeight }}
    className="w-100"
    onMessage={(e) => {
      switch (e.handler) {
        case "IFRAME_HEIGHT":
          setIframeHeight(`${e.height}px`);
          break;
      }
    }}
  />
);
