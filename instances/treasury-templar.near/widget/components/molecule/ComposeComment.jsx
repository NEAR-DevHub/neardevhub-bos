const proposalId = props.proposalId;
const rfpId = props.rfpId;
const draftKey = "INFRA_COMMENT_DRAFT" + proposalId;
let draftComment = "";

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

const notifyAccountIds = props.notifyAccountIds ?? [];
const accountId = context.accountId;
const item = props.item;
const [allowGetDraft, setAllowGetDraft] = useState(true);
const [comment, setComment] = useState(null);
const [isTxnCreated, setTxnCreated] = useState(false);
const [handler, setHandler] = useState("update"); // to update editor state on draft and txn approval
const [showCommentToast, setCommentToast] = useState(false);

if (allowGetDraft) {
  draftComment = Storage.privateGet(draftKey);
}

useEffect(() => {
  if (draftComment) {
    setComment(draftComment);
    setAllowGetDraft(false);
    setHandler("refreshEditor");
  }
}, [draftComment]);

useEffect(() => {
  if (draftComment === comment) {
    return;
  }
  const handler = setTimeout(() => {
    Storage.privateSet(draftKey, comment);
  }, 1000);

  return () => {
    clearTimeout(handler);
  };
}, [comment]);

useEffect(() => {
  if (handler === "update") {
    return;
  }
  const handler = setTimeout(() => {
    setHandler("update");
  }, 3000);

  return () => {
    clearTimeout(handler);
  };
}, [handler]);

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
          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
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

  if (notifyAccountIds.length > 0) {
    notifyAccountIds.map((account) => {
      if (account !== context.accountId) {
        notifications.push({
          key: account,
          value: proposalId
            ? {
                type: "proposal/reply",
                item,
                proposal: proposalId,
                widgetAccountId: "${REPL_TREASURY_TEMPLAR}",
              }
            : {
                type: "rfp/reply",
                item,
                rfp: rfpId,
                widgetAccountId: "${REPL_TREASURY_TEMPLAR}",
              },
        });
      }
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
      setCommentToast(true);
      setComment("");
      Storage.privateSet(draftKey, "");
      setHandler("committed");
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
    class="comment-btn-spinner spinner-border spinner-border-sm"
    role="status"
    aria-hidden="true"
  ></span>
);

const Compose = useMemo(() => {
  return (
    <Widget
      src={`${REPL_TREASURY_TEMPLAR}/widget/components.molecule.Compose`}
      props={{
        data: comment,
        onChangeKeyup: setComment,
        autocompleteEnabled: true,
        placeholder: "Add your comment here...",
        height: "250",
        embeddCSS: ComposeEmbeddCSS,
        handler: handler,
        showProposalIdAutoComplete: true,
        sortedRelevantUsers: props.sortedRelevantUsers,
      }}
    />
  );
}, [draftComment, handler, props.sortedRelevantUsers]);

return (
  <div className="d-flex gap-2">
    <Widget
      src={`${REPL_NEAR}/widget/DIG.Toast`}
      props={{
        title: "Comment Submitted Successfully",
        type: "success",
        open: showCommentToast,
        onOpenChange: (v) => setCommentToast(v),
        trigger: <></>,
        providerProps: { duration: 3000 },
      }}
    />
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile`}
      props={{
        accountId: accountId,
      }}
    />
    <div className="d-flex flex-column gap-2 w-100">
      <b className="mt-1">Add a comment</b>
      {Compose}
      <div className="d-flex gap-2 align-content-center justify-content-end">
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
          props={{
            label: isTxnCreated ? LoadingButtonSpinner : "Comment",
            ["data-testid"]: "compose-comment",
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
