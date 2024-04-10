/**
 * iframe embedding a SimpleMDE component
 * https://github.com/sparksuite/simplemde-markdown-editor
 */

function defaultOnChange(content) {
  console.log(content);
}

const data = props.data;
const onChange = props.onChange ?? defaultOnChange;
const height = props.height ?? "390";
const className = props.className ?? "w-100";
const embeddCSS = props.embeddCSS;

State.init({
  iframeHeight: height,
  message: { handler: "init", content: props.data },
});

const profilesData = Social.get("*/profile/name", "final");
const followingData = Social.get(
  `${context.accountId}/graph/follow/**`,
  "final"
);

// SIMPLEMDE CONFIG //
const fontFamily = props.fontFamily ?? "sans-serif";
const alignToolItems = props.alignToolItems ?? "right";
const autoFocus = props.autoFocus ?? true;
const renderingConfig = JSON.stringify(
  props.renderingConfig ?? {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true,
  }
);
const placeholder = props.placeholder ?? "";
const statusConfig = JSON.stringify(
  props.statusConfig ?? ["lines", "words", "cursor"]
);
const spellChecker = props.spellChecker ?? true;
const tabSize = props.tabSize ?? 4;
const showAutoComplete = props.showAutoComplete ?? false;

// Add or remove toolbar items
// For adding unique items, configure the switch-case within the iframe
const toolbarConfig = JSON.stringify(
  props.toolbar ?? [
    "heading",
    "bold",
    "italic",
    "|", // adding | creates a divider in the toolbar
    "quote",
    "code",
    "link",
    "image",
    "mention",
    "reference",
    "unordered-list",
    "ordered-list",
    "checklist",
    "table",
    "horizontal-rule",
    "guide",
    "preview",
  ]
);

const code = `
  <style>
  body {  
      margin: auto;
      font-family: ${fontFamily};
      overflow: visible;
      font-size:14px;
  }

  @media screen and (max-width: 768px) {
    body {
      font-size: 12px;
    }
  }
  
  .cursor-pointer {
    cursor: pointer;
  }

  .text-wrap {
    overflow: hidden;
    white-space: normal;
  }

  .dropdown-item:hover{
    background-color:rgb(0, 236, 151) !important;
    color:white !important;
  }

  .editor-toolbar {
      text-align: ${alignToolItems};
  }

  ${embeddCSS}

  </style>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
  <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
  <script src="https://cdn.jsdelivr.net/highlight.js/latest/highlight.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

  
  <div id="react-root"></div>
  
  <script>
  let codeMirrorInstance;
  let isEditorInitialized = false;
  let followingData = {};
  let profilesData = {};
  
  function getSuggestedAccounts(term) {
    let results = [];

    term = (term || "").replace(/\W/g, "").toLowerCase();
    const limit = 5;
  
    const profiles = Object.entries(profilesData);

    for (let i = 0; i < profiles.length; i++) {
      let score = 0;
      const accountId = profiles[i][0];
      const accountIdSearch = profiles[i][0].replace(/\W/g, "").toLowerCase();
      const nameSearch = (profiles[i][1]?.profile?.name || "")
        .replace(/\W/g, "")
        .toLowerCase();
      const accountIdSearchIndex = accountIdSearch.indexOf(term);
      const nameSearchIndex = nameSearch.indexOf(term);
  
      if (accountIdSearchIndex > -1 || nameSearchIndex > -1) {
        score += 10;
  
        if (accountIdSearchIndex === 0) {
          score += 10;
        }
        if (nameSearchIndex === 0) {
          score += 10;
        }
        if (followingData[accountId] === "") {
          score += 30;
        }
  
        results.push({
          accountId,
          score,
        });
      }
    }
  
    results.sort((a, b) => b.score - a.score);
    results = results.slice(0, limit);
  
    return results;
  }

  function MarkdownEditor(props) {
      const [value, setValue] = React.useState(props.initialText || "");
  
      React.useEffect(() => {
          const generateToolbarItems = () => {
              return ${toolbarConfig}.map((item) => {
                  switch(item) {
                      // CONFIGURE CUSTOM IMPLEMENTATIONS HERE
                      case "checklist": {
                          function handleChecklist(editor) {
                              const cursorPos = editor.codemirror.getCursor();
                              const lineText = editor.codemirror.getLine(cursorPos.line);
                              if (lineText.trim() === "") {
                                  editor.codemirror.replaceRange(" - [ ] ", cursorPos);
                              } else {
                                  editor.codemirror.replaceRange("\\n - [ ] ", cursorPos);
                              }
                          }
                          return {
                              name: "checklist",
                              action: handleChecklist,
                              className: "fa fa-check-square",
                              title: "Insert Checklist"
                          }
                      }
                      case "mention": {
                          function handleMention(editor) {
                              const cursorPos = editor.codemirror.getCursor();
                              editor.codemirror.replaceRange("@", cursorPos);

                          }
                          return {
                              name: "mention",
                              action: handleMention,
                              className: "fa fa-at",
                              title: "Insert Mention"
                          }
                      }
                      case "reference": {
                          function handleReference(editor) {
                              const cursorPos = editor.codemirror.getCursor();
                              editor.codemirror.replaceRange("bos://", cursorPos);
                          }
                          return {
                              name: "reference",
                              action: handleReference,
                              className: "fa fa-external-link-square",
                              title: "Reference Thing"
                          }
                      }
                      case "image": {
                          // TODO: convert to upload to IPFS
                          return {
                              name: "image",
                              action: SimpleMDE.drawImage,
                              className: "fa fa-picture-o",
                              title: "Insert Image"
                          }
                      }
                      default: {
                          return item;
                      }
                  }
              });
          };
  
          function renderPreview(plainText, preview) {
              // TODO: can we place custom preview element? Perhaps install VM into this iframe?
              setTimeout(function(){
                      preview.innerHTML = "<p>hello</p>";
                  }, 250);
              return "loading";
          }
          
          // Initializes SimpleMDE element and attaches to text-area
          const simplemde = new SimpleMDE({
              element: document.getElementById("markdown-input"),
              forceSync: true,
              autofocus: ${autoFocus},
              renderingConfig: ${renderingConfig},
              placeholder: \`${placeholder}\`,
              status: ${statusConfig},
              spellChecker: ${spellChecker},
              tabSize: ${tabSize},
              toolbar: generateToolbarItems(),
              initialValue: value,
              previewRender: renderPreview,
              insertTexts: {
                image: ["![](https://", ")"],
                link: ["[", "](https://)"],
              },
          });
  
          codeMirrorInstance = simplemde.codemirror;
  
          /**
           * Sends message to Widget to update content
           */
          const updateContent = () => {
              const content = simplemde.value();
              window.parent.postMessage({ handler: "update", content }, "*");
          };
  
          /**
           * Sends message to Widget to update iframe height
           */
          const updateIframeHeight = () => {
              const iframeHeight = document.body.scrollHeight;
              window.parent.postMessage({ handler: "resize", height: iframeHeight }, "*");
          };
  
          // On Change
          simplemde.codemirror.on('change', () => {
            updateContent();
            updateIframeHeight();
            
          });

          if (${showAutoComplete}) {
            let mentionToken;
            let dropdown;

            
            simplemde.codemirror.on("keyup", function (cm, event) {
              const cursor = cm.getCursor();
              const token = cm.getTokenAt(cursor);

              if (!mentionToken && token.string === "@") {
                mentionToken = token;
                // Calculate cursor position relative to the iframe's viewport
                const rect = cm.charCoords(cursor);
                const x = rect.left;
                const y = rect.bottom;

                // Create dropdown with options
                dropdown = document.createElement("div");
                dropdown.className =
                "autocomplete-dropdown dropdown-menu rounded-2 dropdown-menu-end dropdown-menu-lg-start px-2 shadow show";
                dropdown.style.position = "absolute";
                dropdown.style.top = y + "px";
                dropdown.style.left = x + "px";
                dropdown.style.background = "#f9f9f9";
        
                dropdown.innerHTML = "<div>"+getSuggestedAccounts("")
                 .map(
                   (item) =>
                     "<li class='dropdown-item cursor-pointer w-100 text-wrap'>"+item?.accountId+"</li>"
                 )
                 .join("")+"</div>";
                document.body.appendChild(dropdown);
            
                // Handle dropdown selection
                dropdown.querySelectorAll("li").forEach((li) => {
                  li.addEventListener("click", function () {
                    const selectedText = this.textContent.trim();
                    simplemde.codemirror.replaceSelection(selectedText);
                    mentionToken = null;
                    dropdown.remove();
                  });
                });
            
                // Close dropdown on outside click
                document.addEventListener("click", function (event) {
                  if (!dropdown.contains(event.target)) {
                    mentionToken = null;
                    dropdown.remove();
                  }
                });
              } else if (mentionToken && token.string.match(/[^a-z0-9]/)) {
                mentionToken = null;
                dropdown.remove();
              } else if (mentionToken) {
                const mentionInput = simplemde.value().split("@").pop();
                dropdown.innerHTML = "<div>"+getSuggestedAccounts(mentionInput)
                 .map(
                   (item) =>
                     "<li class='dropdown-item cursor-pointer w-100 text-wrap'>"+item?.accountId+"</li>"
                 )
                 .join("")+"</div>";

                 dropdown.querySelectorAll("li").forEach((li) => {
                  li.addEventListener("click", function () {
                    const selectedText = this.textContent.trim();
                    simplemde.codemirror.replaceSelection(selectedText);
                    mentionToken = null;
                    dropdown.remove();
                  });
                });
            
              }

            });
          }
      }, []);
  
      return React.createElement('textarea', { id: 'markdown-input', value: value, onChange: setValue });
  }
  
  const domContainer = document.querySelector('#react-root');
  const root = ReactDOM.createRoot(domContainer);
  
  window.addEventListener("message", (event) => {
    if (!isEditorInitialized && event.data !== "") {
      root.render(React.createElement(MarkdownEditor, {
          initialText: event.data.content }));
          isEditorInitialized = true;
    } else {
      if (event.data.handler === 'autocompleteSelected') {
          codeMirrorInstance.getDoc().setValue(event.data.content);
        }
    }
    if (event.data.followingData) {
      followingData = event.data.followingData;
    }
    if (event.data.profilesData) {
      profilesData = JSON.parse(event.data.profilesData);
    }
  });
  </script>
  `;
return (
  <iframe
    className={className}
    style={{
      height: `${state.iframeHeight}px`,
    }}
    srcDoc={code}
    message={{
      content: props.data?.content ?? "",
      followingData,
      profilesData: JSON.stringify(profilesData),
    }}
    onMessage={(e) => {
      switch (e.handler) {
        case "update":
          {
            onChange(e.content);
          }
          break;
        case "resize":
          {
            const offset = 0;
            if (statusConfig.length) {
              offset = 10;
            }
            State.update({ iframeHeight: e.height + offset });
          }
          break;
      }
    }}
  />
);
