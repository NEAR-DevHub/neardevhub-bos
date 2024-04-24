const proposalId = props.id;
const draftKey = "COMMENT_DRAFT" + proposalId;
const draftComment = Storage.privateGet(draftKey);

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
    max-height: 300px !important;
  }
`;
const notifyAccountId = props.notifyAccountId;
const accountId = context.accountId;
const item = props.item;
const [allowGetDraft, setAllowGetDraft] = useState(true);
const [comment, setComment] = useState(null);
const [isTxnCreated, setTxnCreated] = useState(false);

useEffect(() => {
  if (draftComment && allowGetDraft) {
    setComment(draftComment);
    setAllowGetDraft(false);
  }
}, [draftComment]);

useEffect(() => {
  const handler = setTimeout(() => {
    if (comment !== draftComment) Storage.privateSet(draftKey, comment);
  }, 2000);

  return () => {
    clearTimeout(handler);
  };
}, [comment, draftKey]);

if (!accountId) {
  return (
    <div
      style={{
        marginLeft: 10,
        backgroundColor: "#ECF8FB",
        border: "1px solid #E2E6EC",
      }}
      className="d-flex align-items-center gap-1 p-4 rounded-2 flex-wrap flex-md-nowrap"
    >
      <Link to="https://near.org/signup">
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "grey-btn" },
            label: "Sign up",
          }}
        />
      </Link>
      <div className="fw-bold">to join this conversation.</div>
      <div>Already have an account?</div>
      <a className="text-decoration-underline" href="https://near.org/signin">
        Log in to comment
      </a>
    </div>
  );
}

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
  setTxnCreated(true);
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
        type: "devhub/reply",
        item,
        proposal: proposalId,
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
    onCommit: () => {
      setComment("");
      setTxnCreated(false);
    },
    onCancel: () => {
      setTxnCreated(false);
    },
  });
}

useEffect(() => {
  if (props.transactionHashes && comment) {
    setComment("");
  }
}, [props.transactionHashes]);

const LoadingButtonSpinner = (
  <span
    class="spinner-border spinner-border-sm"
    role="status"
    aria-hidden="true"
  ></span>
);

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
          onChangeKeyup: setComment,
          autocompleteEnabled: true,
          placeholder: "Add your comment here...",
          height: "180",
          embeddCSS: ComposeEmbeddCSS,
          showProposalIdAutoComplete: true,
        }}
      />
      <div className="d-flex gap-2 align-content-center justify-content-end">
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            label: isTxnCreated ? LoadingButtonSpinner : "Comment",
            disabled: !comment || isTxnCreated,
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
