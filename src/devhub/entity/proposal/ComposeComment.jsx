const ComposeEmbeddCSS = `
  .CodeMirror {
    border: none !important;
    min-height: 50px !important;
  }

  .editor-toolbar {
    border: none !important;
  }

  .CodeMirror-scroll{
    min-height: 50px !important;
  }
`;
const notifyAccountId = props.notifyAccountId;
const accountId = context.accountId;
const item = props.item;
const [comment, setComment] = useState(null);

function extractMentions(text) {
  const mentionRegex =
    /@((?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)/gi;
  mentionRegex.lastIndex = 0;
  const accountIds = new Set();
  for (const match of text.matchAll(mentionRegex)) {
    if (
      !/[\w`]/.test(match.input.charAt(match.index - 1)) &&
      !/[/\w`]/.test(match.input.charAt(match.index + match[0].length)) &&
      match[1].length >= 2 &&
      match[1].length <= 64
    ) {
      accountIds.add(match[1].toLowerCase());
    }
  }
  return [...accountIds];
}

function extractTagNotifications(text, item) {
  return extractMentions(text || "")
    .filter((accountId) => accountId !== context.accountId)
    .map((accountId) => ({
      key: accountId,
      value: {
        type: "mention",
        item,
      },
    }));
}

function composeData() {
  const data = {
    post: {
      comment: JSON.stringify({
        type: "md",
        text: comment,
        item,
      }),
    },
    index: {
      comment: JSON.stringify({
        key: item,
        value: {
          type: "md",
        },
      }),
    },
  };

  const notifications = extractTagNotifications(comment, {
    type: "social",
    path: `${accountId}/post/comment`,
  });

  if (notifyAccountId && notifyAccountId !== context.accountId) {
    notifications.push({
      key: notifyAccountId,
      value: {
        type: "comment",
        item,
      },
    });
  }

  if (notifications.length) {
    data.index.notify = JSON.stringify(
      notifications.length > 1 ? notifications : notifications[0]
    );
  }

  Social.set(data, {
    force: true,
    onCommit: () => {},
    onCancel: () => {},
  });
}

return (
  <div className="d-flex gap-2">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
      props={{
        accountId: accountId,
      }}
    />
    <div className="d-flex flex-column gap-2 w-100">
      <b className="mt-1">Add a comment</b>
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Compose"}
        props={{
          data: comment,
          onChange: setComment,
          autocompleteEnabled: true,
          autoFocus: false,
          placeholder: "Add your comment here...",
          height: "160",
          embeddCSS: ComposeEmbeddCSS,
        }}
      />
      <div className="d-flex gap-2 align-content-center justify-content-end">
        {/* <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            label: "Cancel",
            classNames: { root: "btn-outline-danger border-0 shadow-none btn-sm" },
            onClick: () => {
              setComment(null);
            }
          }}
        /> */}
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            label: "Comment",
            classNames: { root: "green-btn btn-sm" },
            onClick: () => {
              composeData();
            },
          }}
        />
      </div>
    </div>
  </div>
);
