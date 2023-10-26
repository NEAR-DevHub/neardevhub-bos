/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */

const ButtonWithHover = styled.button`
  background-color: #fff;
  &:hover {
    background-color: #e9ecef;
    color: #000;
  }
`;

const postId = props.post.id ?? (props.id ? parseInt(props.id) : 0);
const post =
  props.post ??
  Near.view(nearDevGovGigsContractAccountId, "get_post", { post_id: postId });
if (!post) {
  return <div>Loading ...</div>;
}

const referral = props.referral;
const currentTimestamp = props.timestamp ?? post.snapshot.timestamp;
const compareTimestamp = props.compareTimestamp ?? "";
const swapTimestamps = currentTimestamp < compareTimestamp;

const snapshotHistory = post.snapshot_history;
const snapshot =
  currentTimestamp === post.snapshot.timestamp
    ? post.snapshot
    : (snapshotHistory &&
        snapshotHistory.find((s) => s.timestamp === currentTimestamp)) ??
      null;
const compareSnapshot =
  compareTimestamp === post.snapshot.timestamp
    ? post.snapshot
    : (snapshotHistory &&
        snapshotHistory.find((s) => s.timestamp === compareTimestamp)) ??
      null;

// If this post is displayed under another post. Used to limit the size.
const isUnderPost = props.isUnderPost ? true : false;
const parentId = Near.view(nearDevGovGigsContractAccountId, "get_parent_id", {
  post_id: postId,
});

const childPostIdsUnordered =
  Near.view(nearDevGovGigsContractAccountId, "get_children_ids", {
    post_id: postId,
  }) ?? [];

const childPostIds = props.isPreview ? [] : childPostIdsUnordered.reverse();
const expandable = props.isPreview ? false : props.expandable ?? false;
const defaultExpanded = expandable ? props.defaultExpanded : true;

const draftState = props.draftState;

function readableDate(timestamp) {
  var a = new Date(timestamp);
  return a.toDateString() + " " + a.toLocaleTimeString();
}

const timestamp = readableDate(
  snapshot.timestamp ? snapshot.timestamp / 1000000 : Date.now()
);

const postSearchKeywords = props.searchKeywords ? (
  <div style={{ "font-family": "monospace" }} key="post-search-keywords">
    <span>Found keywords: </span>
    {props.searchKeywords.map((tag) => {
      return widget("components.atom.tag", { linkTo: "Feed", tag });
    })}
  </div>
) : (
  <div key="post-search-keywords"></div>
);

const searchKeywords = props.searchKeywords ? (
  <div class="mb-4" key="search-keywords">
    <small class="text-muted">{postSearchKeywords}</small>
  </div>
) : (
  <div key="search-keywords"></div>
);

const allowedToEdit =
  !props.isPreview &&
  Near.view(nearDevGovGigsContractAccountId, "is_allowed_to_edit", {
    post_id: postId,
    editor: context.accountId,
  });

const btnEditorWidget = (postType, name) => {
  return (
    <li>
      <a
        class="dropdown-item"
        role="button"
        onClick={() =>
          State.update({ postType, editorType: "EDIT", showEditor: true })
        }
      >
        {name}
      </a>
    </li>
  );
};

const editControl = allowedToEdit ? (
  <div class="btn-group" role="group">
    <a
      class="card-link px-2"
      role="button"
      title="Edit post"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      type="button"
    >
      <div class="bi bi-pencil-square"></div>
    </a>
    <ul class="dropdown-menu">
      {btnEditorWidget("Idea", "Edit as an idea")}
      {btnEditorWidget("Submission", "Edit as a solution")}
      {btnEditorWidget("Attestation", "Edit as an attestation")}
      {btnEditorWidget("Sponsorship", "Edit as a sponsorship")}
      {btnEditorWidget("Comment", "Edit as a comment")}
    </ul>
  </div>
) : (
  <div></div>
);

const shareButton = props.isPreview ? (
  <div></div>
) : (
  <a
    class="card-link text-dark"
    href={href("Post", { id: postId })}
    role="button"
    target="_blank"
    title="Open in new tab"
  >
    <div class="bi bi-share"></div>
  </a>
);

// card-header
const header = (
  <div className="p-3 pt-4" key="header">
    <small class="text-muted">
      <div class="row justify-content-between">
        <div class="col-4">
          {widget("components.molecule.profile-card", {
            accountId: post.author_id,
          })}
        </div>
        <div class="col-5">
          <div class="d-flex justify-content-end">
            {editControl}
            {timestamp}
            {widget("entity.post.History", {
              post,
              timestamp: currentTimestamp,
            })}
            {shareButton}
          </div>
        </div>
      </div>
    </small>
  </div>
);

const emptyIcons = {
  Idea: "bi-lightbulb",
  Comment: "bi-chat",
  Submission: "bi-rocket",
  Attestation: "bi-check-circle",
  Sponsorship: "bi-cash-coin",
  Github: "bi-github",
  Like: "bi-heart",
  Reply: "bi-reply",
};

const fillIcons = {
  Idea: "bi-lightbulb-fill",
  Comment: "bi-chat-fill",
  Submission: "bi-rocket-fill",
  Attestation: "bi-check-circle-fill",
  Sponsorship: "bi-cash-coin",
  Github: "bi-github",
  Like: "bi-heart-fill",
  Reply: "bi-reply-fill",
};

// Trigger saving this widget.

const borders = {
  Idea: "border-light",
  Comment: "border-light",
  Submission: "border-light",
  Attestation: "border-light",
  Sponsorship: "border-light",
  Github: "border-light",
};

const containsLike = props.isPreview
  ? false
  : post.likes.find((l) => l.author_id == context.accountId);
const likeBtnClass = containsLike ? fillIcons.Like : emptyIcons.Like;
// This must be outside onLike, because Near.view returns null at first, and when the view call finished, it returns true/false.
// If checking this inside onLike, it will give `null` and we cannot tell the result is true or false.
let grantNotify = Near.view("social.near", "is_write_permission_granted", {
  predecessor_id: nearDevGovGigsContractAccountId,
  key: context.accountId + "/index/notify",
});
if (grantNotify === null) {
  return;
}
const onLike = () => {
  if (!context.accountId) {
    return;
  }
  let likeTxn = [
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: "add_like",
      args: {
        post_id: postId,
      },
      deposit: Big(10).pow(21).mul(2),
      gas: Big(10).pow(12).mul(100),
    },
  ];

  if (grantNotify === false) {
    likeTxn.unshift({
      contractName: "social.near",
      methodName: "grant_write_permission",
      args: {
        predecessor_id: nearDevGovGigsContractAccountId,
        keys: [context.accountId + "/index/notify"],
      },
      deposit: Big(10).pow(23),
      gas: Big(10).pow(12).mul(30),
    });
  }
  Near.call(likeTxn);
};

const btnCreatorWidget = (postType, icon, name, desc) => {
  return (
    <li class="py-1">
      <a
        class="dropdown-item text-decoration-none d-flex align-items-center lh-sm"
        style={{ color: "rgb(55,109,137)" }}
        role="button"
        onClick={() =>
          State.update({ postType, editorType: "CREATE", showEditor: true })
        }
      >
        <i class={`bi ${icon}`} style={{ fontSize: "1.5rem" }}>
          {" "}
        </i>
        <div class="ps-2 text-wrap" style={{ width: "18rem" }}>
          <div>{name}</div>
          <small class="fw-light text-secondary">{desc}</small>
        </div>
      </a>
    </li>
  );
};

const buttonsFooter = props.isPreview ? null : (
  <div class="row" key="buttons-footer">
    <div class="col-8">
      <div class="btn-group" role="group" aria-label="Basic outlined example">
        <ButtonWithHover
          type="button"
          class="btn"
          style={{ border: "0px" }}
          onClick={onLike}
        >
          <i class={`bi ${likeBtnClass}`}> </i>
          {post.likes.length == 0
            ? "Like"
            : widget("components.layout.LikeButton.Faces", {
                likesByUsers: Object.fromEntries(
                  post.likes.map(({ author_id }) => [author_id, ""])
                ),
              })}
        </ButtonWithHover>
        <div class="btn-group" role="group">
          <ButtonWithHover
            type="button"
            class="btn"
            style={{ border: "0px" }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class={`bi ${emptyIcons.Reply}`}> </i> Reply
          </ButtonWithHover>
          <ul class="dropdown-menu">
            {btnCreatorWidget(
              "Idea",
              emptyIcons.Idea,
              "Idea",
              "Get feedback from the community about a problem, opportunity, or need."
            )}
            {btnCreatorWidget(
              "Submission",
              emptyIcons.Submission,
              "Solution",
              "Provide a specific proposal or implementation to an idea, optionally requesting funding."
            )}
            {btnCreatorWidget(
              "Attestation",
              emptyIcons.Attestation,
              "Attestation",
              "Formally review or validate a solution as a recognized expert."
            )}
            {btnCreatorWidget(
              "Sponsorship",
              emptyIcons.Sponsorship,
              "Sponsorship",
              "Offer to fund projects, events, or proposals that match your needs."
            )}
            <li>
              <hr class="dropdown-divider" />
            </li>
            {btnCreatorWidget(
              "Comment",
              emptyIcons.Comment,
              "Comment",
              "Ask a question, provide information, or share a resource that is relevant to the thread."
            )}
          </ul>
        </div>
        <ButtonWithHover
          type="button"
          class="btn"
          style={{ border: "0px" }}
          data-bs-toggle="collapse"
          href={`#collapseChildPosts${postId}`}
          aria-expanded={defaultExpanded}
          aria-controls={`collapseChildPosts${postId}`}
        >
          <i class="bi bi-arrows-expand"> </i>{" "}
          {`Expand Replies (${childPostIds.length})`}
        </ButtonWithHover>

        {isUnderPost || !parentId ? (
          <div key="link-to-parent"></div>
        ) : (
          <a href={href("Post", { id: parentId })}>
            <ButtonWithHover
              type="button"
              style={{ border: "0px" }}
              className="btn"
              key="link-to-parent"
            >
              <i class="bi bi-arrow-90deg-up"></i>Go to parent
            </ButtonWithHover>
          </a>
        )}
      </div>
    </div>
  </div>
);

const CreatorWidget = (postType) => {
  return (
    <div
      class={`collapse ${
        draftState?.parent_post_id == postId && draftState?.postType == postType
          ? "show"
          : ""
      }`}
      id={`collapse${postType}Creator${postId}`}
      data-bs-parent={`#accordion${postId}`}
    >
      {widget("entity.post.PostEditor", {
        postType,
        onDraftStateChange: props.onDraftStateChange,
        draftState:
          draftState?.parent_post_id == postId ? draftState : undefined,
        parentId: postId,
        mode: "Create",
      })}
    </div>
  );
};

const tokenMapping = {
  NEAR: "NEAR",
  USDT: {
    NEP141: {
      address: "usdt.tether-token.near",
    },
  },
  USDC: {
    NEP141: {
      address:
        "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    },
  },
  // Add more tokens here as needed
};

const reverseTokenMapping = Object.keys(tokenMapping).reduce(
  (reverseMap, key) => {
    const value = tokenMapping[key];
    if (typeof value === "object") {
      reverseMap[JSON.stringify(value)] = key;
    }
    return reverseMap;
  },
  {}
);

function tokenResolver(token) {
  if (typeof token === "string") {
    return token;
  } else if (typeof token === "object") {
    const tokenString = reverseTokenMapping[JSON.stringify(token)];
    return tokenString || null;
  } else {
    return null; // Invalid input
  }
}

const EditorWidget = (postType) => {
  return (
    <div
      class={`collapse ${
        draftState?.edit_post_id == postId && draftState?.postType == postType
          ? "show"
          : ""
      }`}
      id={`collapse${postType}Editor${postId}`}
      data-bs-parent={`#accordion${postId}`}
    >
      {widget("entity.post.PostEditor", {
        postType,
        postId,
        mode: "Edit",
        author_id: post.author_id,
        labels: post.snapshot.labels,
        name: post.snapshot.name,
        description: post.snapshot.description,
        amount: post.snapshot.amount,
        token: tokenResolver(post.snapshot.sponsorship_token),
        supervisor: post.snapshot.supervisor,
        githubLink: post.snapshot.github_link,
        onDraftStateChange: props.onDraftStateChange,
        draftState: draftState?.edit_post_id == postId ? draftState : undefined,
      })}
    </div>
  );
};

const isDraft =
  (draftState?.parent_post_id === postId &&
    draftState?.postType === state.postType) ||
  (draftState?.edit_post_id === postId &&
    draftState?.postType === state.postType);

function Editor() {
  return (
    <div class="row" id={`accordion${postId}`} key="editors-footer">
      <div
        key={`${state.postType}${state.editorType}${postId}`}
        className={"w-100"}
      >
        {state.editorType === "CREATE" ? (
          <>
            {widget("entity.post.PostEditor", {
              postType: state.postType,
              onDraftStateChange: props.onDraftStateChange,
              draftState:
                draftState?.parent_post_id == postId ? draftState : undefined,
              parentId: postId,
              mode: "Create",
            })}
          </>
        ) : (
          <>
            {widget("entity.post.PostEditor", {
              postType: state.postType,
              postId,
              mode: "Edit",
              author_id: post.author_id,
              labels: post.snapshot.labels,
              name: post.snapshot.name,
              description: post.snapshot.description,
              amount: post.snapshot.amount,
              token: tokenResolver(post.snapshot.sponsorship_token),
              supervisor: post.snapshot.supervisor,
              githubLink: post.snapshot.github_link,
              onDraftStateChange: props.onDraftStateChange,
              draftState:
                draftState?.edit_post_id == postId ? draftState : undefined,
            })}
          </>
        )}
      </div>
    </div>
  );
}

const renamedPostType =
  snapshot.post_type == "Submission" ? "Solution" : snapshot.post_type;

const tags = post.snapshot.labels ? (
  <div class="card-title" style={{ margin: "20px 0" }} key="post-labels">
    {post.snapshot.labels.map((tag) => {
      return widget("components.atom.tag", { linkTo: "Feed", tag });
    })}
  </div>
) : (
  <div key="post-labels"></div>
);

const postTitle =
  snapshot.post_type == "Comment" ? (
    <div key="post-title"></div>
  ) : (
    <h5 class="card-title mb-4" key="post-title">
      <div className="row justify-content-between">
        <div class="col-9">
          <i class={`bi ${emptyIcons[snapshot.post_type]}`}> </i>
          {renamedPostType}: {snapshot.name}
        </div>
      </div>
    </h5>
  );

const postExtra =
  snapshot.post_type == "Sponsorship" ? (
    <div key="post-extra">
      <h6 class="card-subtitle mb-2 text-muted">
        Maximum amount: {snapshot.amount}{" "}
        {tokenResolver(snapshot.sponsorship_token)}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Supervisor:{" "}
        <Widget
          src={`neardevgov.near/widget/ProfileLine`}
          props={{ accountId: snapshot.supervisor }}
        />
      </h6>
    </div>
  ) : (
    <div></div>
  );

const childPostHasDraft = childPostIds.find(
  (childId) =>
    childId == draftState?.edit_post_id || childId == draftState?.parent_post_id
);
if (
  (childPostHasDraft || state.childrenOfChildPostsHasDraft) &&
  props.expandParent
) {
  props.expandParent();
}

const postsList =
  props.isPreview || childPostIds.length == 0 ? (
    <div key="posts-list"></div>
  ) : (
    <div class="row" key="posts-list">
      <div
        class={`collapse ${
          defaultExpanded ||
          childPostHasDraft ||
          state.childrenOfChildPostsHasDraft
            ? "show"
            : ""
        }`}
        id={`collapseChildPosts${postId}`}
      >
        {childPostIds.map((childId) =>
          widget(
            "entity.post.Post",
            {
              id: childId,
              isUnderPost: true,
              onDraftStateChange: props.onDraftStateChange,
              draftState,
              expandParent: () =>
                State.update({ childrenOfChildPostsHasDraft: true }),
            },
            `subpost${childId}of${postId}`
          )
        )}
      </div>
    </div>
  );

const LimitedMarkdown = styled.div`
  max-height: 20em;
`;

// Determine if located in the post page.
const isInList = props.isInList;
const contentArray = snapshot.description.split("\n");
const needClamp = isInList && contentArray.length > 5;

initState({
  clamp: needClamp,
});

const clampedContent = needClamp
  ? contentArray.slice(0, 3).join("\n")
  : snapshot.description;

// Should make sure the posts under the currently top viewed post are limited in size.
const descriptionArea = isUnderPost ? (
  <LimitedMarkdown className="overflow-auto" key="description-area">
    {widget("components.molecule.markdown-viewer", {
      text: snapshot.description,
    })}
  </LimitedMarkdown>
) : (
  <div>
    <div class={state.clamp ? "clamp" : ""}>
      {widget("components.molecule.markdown-viewer", {
        text: state.clamp ? clampedContent : snapshot.description,
      })}
    </div>
    {state.clamp ? (
      <div class="d-flex justify-content-start">
        <a
          class="btn-link text-dark fw-bold text-decoration-none"
          onClick={() => State.update({ clamp: false })}
        >
          See more
        </a>
      </div>
    ) : (
      <></>
    )}
  </div>
);

const timestampElement = (_snapshot) => {
  return (
    <a
      class="text-muted"
      href={href("Post", {
        id: postId,
        timestamp: _snapshot.timestamp,
        compareTimestamp: null,
        referral,
      })}
    >
      {readableDate(_snapshot.timestamp / 1000000).substring(4)}

      <Widget
        src="mob.near/widget/ProfileImage"
        props={{
          accountId: _snapshot.editor_id,
          style: {
            width: "1.25em",
            height: "1.25em",
          },
          imageStyle: {
            transform: "translateY(-12.5%)",
          },
        }}
      />
      {_snapshot.editor_id.substring(0, 8)}
    </a>
  );
};

function combineText(_snapshot) {
  return (
    "## " +
    _snapshot.post_type +
    ": " +
    _snapshot.name +
    "\n" +
    _snapshot.description
  );
}

return (
  <AttractableDiv className={`card ${borders[snapshot.post_type]}`}>
    {header}
    <div className="card-body">
      {searchKeywords}
      {compareSnapshot ? (
        <div
          class="border rounded"
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
          <div class="d-flex justify-content-end" style={{ fontSize: "12px" }}>
            <div class="d-flex w-50 justify-content-end mt-1 me-2">
              {timestampElement(snapshot)}
              {snapshot !== compareSnapshot && (
                <>
                  <div class="mx-1 align-self-center">
                    <i class="bi bi-file-earmark-diff" />
                  </div>
                  {timestampElement(compareSnapshot)}
                </>
              )}
            </div>
          </div>

          <Widget
            src="markeljan.near/widget/MarkdownDiff"
            props={{
              post: post,
              currentCode: combineText(
                swapTimestamps ? compareSnapshot : snapshot
              ),
              prevCode: combineText(
                swapTimestamps ? snapshot : compareSnapshot
              ),
              showLineNumber: true,
            }}
          />
        </div>
      ) : (
        <>
          {postTitle}
          {postExtra}
          {descriptionArea}
        </>
      )}
      {tags}
      {buttonsFooter}
      {!props.isPreview && (isDraft || state.showEditor) && <Editor />}
      {postsList}
    </div>
  </AttractableDiv>
);
