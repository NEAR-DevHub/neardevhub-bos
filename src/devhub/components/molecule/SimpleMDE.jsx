/**
 * iframe embedding a SimpleMDE component
 * https://github.com/sparksuite/simplemde-markdown-editor
 */

const data = props.data;
const onChange = props.onChange ?? (() => {});
const height = props.height ?? "390";
const className = props.className ?? "w-100";
const embeddCSS = props.embeddCSS;

State.init({
  iframeHeight: height,
  message: props.data,
});

const profilesData = Social.get("*/profile/name", "final");
const followingData = Social.get(
  `${context.accountId}/graph/follow/**`,
  "final"
);

// SIMPLEMDE CONFIG //
const fontFamily = props.fontFamily ?? "sans-serif";
const alignToolItems = props.alignToolItems ?? "right";
const placeholder = props.placeholder ?? "";
const showAutoComplete = props.showAutoComplete ?? false;

const code = `
<!doctype html>
<html>
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <style>
  body {  
      margin: auto;
      font-family: ${fontFamily};
      overflow: visible;
      font-size:14px !important;
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
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<body>
<div class="dropdown">
  <button style="display: none" type="button" data-bs-toggle="dropdown">
    Dropdown button
  </button>

  <ul class="dropdown-menu" id="mentiondropdown" style="position: absolute;">
</div>
</ul>

<textarea></textarea>

<script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>
<script>
let codeMirrorInstance;
let isEditorInitialized = false;
let followingData = {};
let profilesData = {};
let showAutocomplete = ${showAutoComplete}

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

// Initializes SimpleMDE element and attaches to text-area
const simplemde = new SimpleMDE({
  forceSync: true,
  toolbar: [
    "heading",
    "bold",
    "italic",
    "|", // adding | creates a divider in the toolbar
    "quote",
    "code",
    "link",
  ],
  placeholder: \`${placeholder}\`,
  initialValue: "",
  insertTexts: {
    link: ["[", "]()"],
  },
  spellChecker: false,
  renderingConfig: {
		singleLineBreaks: false,
		codeSyntaxHighlighting: true,
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
simplemde.codemirror.on('blur', () => {
  updateContent();
  updateIframeHeight();
});

if (showAutocomplete) {
  let mentionToken;
  let mentionCursorStart;
  const dropdown = document.getElementById("mentiondropdown");

  simplemde.codemirror.on("keydown", () => {
    if (mentionToken && event.key === 'ArrowDown') {
      dropdown.querySelector('button').focus();
      event.preventDefault();
      return false;
    }
  });

  simplemde.codemirror.on("keyup", (cm, event) => {
    const cursor = cm.getCursor();
    const token = cm.getTokenAt(cursor);

    const createMentionDrowDownOptions = () => {
      const mentionInput = cm.getRange(mentionCursorStart, cursor);
      dropdown.innerHTML = getSuggestedAccounts(mentionInput)
      .map(
        (item) =>
          '<li><button class="dropdown-item cursor-pointer w-100 text-wrap">' + item?.accountId + '</button></li>'
      )
      .join("");

      dropdown.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => {
          const selectedText = li.textContent.trim();
          simplemde.codemirror.replaceRange(selectedText, mentionCursorStart, cursor);
          mentionToken = null;
          dropdown.classList.remove("show");
          cm.focus();
        });
      });
    }
    // show dropwdown only when @ is at first place or when there is a space before @
      if (!mentionToken && (token.string === "@" && cursor.ch === 1 || token.string === "@" && cm.getTokenAt({line:cursor.line, ch: cursor.ch - 1}).string == ' ')) {
        mentionToken = token;
        mentionCursorStart = cursor;
        // Calculate cursor position relative to the iframe's viewport
        const rect = cm.charCoords(cursor);
        const x = rect.left;
        const y = rect.bottom;

        // Create dropdown with options
        dropdown.style.top = y + "px";
        dropdown.style.left = x + "px";

        createMentionDrowDownOptions();

        dropdown.classList.add("show");

        // Close dropdown on outside click
        document.addEventListener("click", function(event) {
            if (!dropdown.contains(event.target)) {
                mentionToken = null;
                dropdown.classList.remove("show");
            }
        });
    } else if (mentionToken && token.string.match(/[^@a-z0-9.]/)) {
        mentionToken = null;
        dropdown.classList.remove("show");
    } else if (mentionToken) {
        createMentionDrowDownOptions();
    }
});

}


window.addEventListener("message", (event) => {
  if (!isEditorInitialized && event.data !== "") {
    simplemde.value(event.data.content);
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
</body>
</html>
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
            const offset = 10;
            State.update({ iframeHeight: e.height + offset });
          }
          break;
      }
    }}
  />
);
