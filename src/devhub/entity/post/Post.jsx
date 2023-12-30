// Ideally, this would be a page

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

const { draftState, onDraftStateChange } = VM.require(
  "${REPL_DEVHUB}/widget/devhub.entity.post.draft"
);

if (!href) {
  return <p>Loading modules...</p>;
}

const ButtonWithHover = styled.button`
  background-color: #fff;
  transition: all 300ms;
  border-radius: 0.5rem;

  &:hover {
    background-color: #e9ecef;
    color: #000;
  }

  &:disabled {
    background-color: #fff;
    color: #b7b7b7;
  }
`;

const postId = props.post.id ?? (props.id ? parseInt(props.id) : 0);

const post =
  props.post ??
  Near.view("${REPL_DEVHUB_CONTRACT}", "get_post", { post_id: postId });

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

const parentId = Near.view("${REPL_DEVHUB_CONTRACT}", "get_parent_id", {
  post_id: postId,
});

const childPostIdsUnordered =
  Near.view("${REPL_DEVHUB_CONTRACT}", "get_children_ids", {
    post_id: postId,
  }) ?? [];

const childPostIds = props.isPreview ? [] : childPostIdsUnordered.reverse();
const expandable = props.isPreview ? false : props.expandable ?? false;
const defaultExpanded = expandable ? props.defaultExpanded : true;

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

    {props.searchKeywords.map((tag) => (
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
        props={{ linkTo: "Feed", tag }}
      />
    ))}
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
  Near.view("${REPL_DEVHUB_CONTRACT}", "is_allowed_to_edit", {
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
      {btnEditorWidget("Solution", "Edit as a solution")}
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
  <Link
    class="card-link text-dark"
    to={href({
      widgetSrc: "${REPL_DEVHUB}/widget/app",
      params: { page: "post", id: postId },
    })}
    role="button"
    target="_blank"
    title="Open in new tab"
  >
    <div class="bi bi-share"></div>
  </Link>
);

const ProfileCardContainer = styled.div`
  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

// card-header
const header = (
  <div key="header">
    <small class="text-muted">
      <div class="row justify-content-between">
        <div class="d-flex align-items-center flex-wrap">
          <ProfileCardContainer>
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.ProfileCard"
              }
              props={{
                accountId: post.author_id,
              }}
            />
          </ProfileCardContainer>

          <div class="d-flex ms-auto">
            {editControl}
            {timestamp}

            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.post.History"}
              props={{
                post,
                timestamp: currentTimestamp,
              }}
            />
            {shareButton}
          </div>
        </div>
      </div>
    </small>
  </div>
);

// const emptyIcons = {
//   Idea: "bi-lightbulb",
//   Comment: "bi-chat",
//   Solution: "bi-rocket",
//   Attestation: "bi-check-circle",
//   Sponsorship: "bi-cash-coin",
//   Github: "bi-github",
//   Like: "bi-heart",
//   Reply: "bi-reply",
// };

const emptyIcons = {
  Idea: "💡",
  Comment: "bi-chat",
  Solution: "🚀",
  Attestation: "✅",
  Sponsorship: "🪙",
  Github: "bi-github",
  Like: "bi-heart",
  Reply: "bi-reply",
};

const fillIcons = {
  Idea: "💡",
  Comment: "bi-chat-fill",
  Solution: "🚀",
  Attestation: "✅",
  Sponsorship: "🪙",
  Github: "bi-github",
  Like: "bi-heart-fill",
  Reply: "bi-reply-fill",
};

// Trigger saving this widget.

const borders = {
  Idea: "border-light",
  Comment: "border-light",
  Solution: "border-light",
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
  predecessor_id: "${REPL_DEVHUB_CONTRACT}",
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
      contractName: "${REPL_DEVHUB_CONTRACT}",
      methodName: "add_like",
      args: {
        post_id: postId,
      },
      gas: Big(10).pow(14),
    },
  ];

  if (grantNotify === false) {
    likeTxn.unshift({
      contractName: "social.near",
      methodName: "grant_write_permission",
      args: {
        predecessor_id: "${REPL_DEVHUB_CONTRACT}",
        keys: [context.accountId + "/index/notify"],
      },
      gas: Big(10).pow(14),
      deposit: Big(10).pow(22),
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

const FooterButtonsContianer = styled.div`
  width: 66.66666667%;

  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

const buttonsFooter = props.isPreview ? null : (
  <div class="row" key="buttons-footer">
    <FooterButtonsContianer>
      <div class="btn-group" role="group" aria-label="Basic outlined example">
        <ButtonWithHover
          type="button"
          class="btn d-flex align-items-center"
          style={{ border: "0px" }}
          onClick={onLike}
        >
          <i class={`bi ${likeBtnClass}`}> </i>
          {post.likes.length == 0 ? (
            "Like"
          ) : (
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.components.layout.LikeButton.Faces"
              props={{
                likesByUsers: Object.fromEntries(
                  post.likes.map(({ author_id }) => [author_id, ""])
                ),
              }}
            />
          )}
        </ButtonWithHover>

        <div class="btn-group" role="group">
          <ButtonWithHover
            type="button"
            class="btn"
            style={{ border: "0px" }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            ↪ Reply
          </ButtonWithHover>
          <ul class="dropdown-menu">
            {btnCreatorWidget(
              "Idea",
              emptyIcons.Idea,
              "Idea",
              "Get feedback from the community about a problem, opportunity, or need."
            )}
            {btnCreatorWidget(
              "Solution",
              emptyIcons.Solution,
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
        {childPostIds.length > 0 && (
          <ButtonWithHover
            type="button"
            class="btn"
            style={{ border: "0px" }}
            data-bs-toggle="collapse"
            href={`#collapseChildPosts${postId}`}
            aria-expanded={defaultExpanded}
            aria-controls={`collapseChildPosts${postId}`}
            onClick={() =>
              State.update({ expandReplies: !state.expandReplies })
            }
          >
            <i
              class={`bi bi-chevron-${state.expandReplies ? "up" : "down"}`}
            ></i>{" "}
            {`${state.expandReplies ? "Collapse" : "Expand"} Replies (${
              childPostIds.length
            })`}
          </ButtonWithHover>
        )}

        {isUnderPost || !parentId ? (
          <div key="link-to-parent"></div>
        ) : (
          <Link
            to={href({
              widgetSrc: "${REPL_DEVHUB}/widget/app",
              params: { page: "post", id: parentId },
            })}
          >
            <ButtonWithHover
              type="button"
              style={{ border: "0px" }}
              className="btn"
              key="link-to-parent"
            >
              <i class="bi bi-arrow-90deg-up"></i>Go to parent
            </ButtonWithHover>
          </Link>
        )}
      </div>
    </FooterButtonsContianer>
  </div>
);

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

const isDraft =
  (draftState?.parent_post_id === postId &&
    draftState?.postType === state.postType) ||
  (draftState?.edit_post_id === postId &&
    draftState?.postType === state.postType);

const setExpandReplies = (value) => {
  State.update({ expandReplies: value });
};

const setEditorState = (value) => {
  if (draftState && !value) {
    // clear the draft state since user initiated cancel
    onDraftStateChange(null);
  }
  State.update({ showEditor: value });
};

let amount = null;
let token = null;
let supervisor = null;

if (state.postType === "Solution") {
  const amountMatch = post.snapshot.description.match(
    /Requested amount: (\d+(\.\d+)?) (\w+)/
  );
  amount = amountMatch ? parseFloat(amountMatch[1]) : null;
  token = amountMatch ? amountMatch[3] : null;

  const sponsorMatch = post.snapshot.description.match(
    /Requested sponsor: @([^\s]+)/
  );
  supervisor = sponsorMatch ? sponsorMatch[1] : null;
}

const seekingFunding = amount !== null || token !== null || supervisor !== null;

function Editor() {
  return (
    <div class="row mt-2" id={`accordion${postId}`} key="editors-footer">
      <div
        key={`${state.postType}${state.editorType}${postId}`}
        className={"w-100"}
      >
        {state.editorType === "CREATE" ? (
          <>
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.post.PostEditor"}
              props={{
                postType: state.postType,
                onDraftStateChange,
                draftState:
                  draftState?.parent_post_id == postId ? draftState : undefined,
                parentId: postId,
                mode: "Create",
                transactionHashes: props.transactionHashes,
                setExpandReplies,
                setEditorState: setEditorState,
              }}
            />
          </>
        ) : (
          <>
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.post.PostEditor"}
              props={{
                postType: state.postType,
                postId,
                mode: "Edit",
                author_id: post.author_id,
                labels: post.snapshot.labels,
                name: post.snapshot.name,
                description: post.snapshot.description,
                amount: post.snapshot.amount || amount,
                token: tokenResolver(post.snapshot.sponsorship_token || token),
                supervisor:
                  post.snapshot.post.snapshot.supervisor || supervisor,
                seekingFunding: seekingFunding,
                githubLink: post.snapshot.github_link,
                onDraftStateChange,
                draftState:
                  draftState?.edit_post_id == postId ? draftState : undefined,
                setEditorState: setEditorState,
                transactionHashes: props.transactionHashes,
                setExpandReplies,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

const renamedPostType =
  snapshot.post_type == "Submission" ? "Solution" : snapshot.post_type;

const tags = post.snapshot.labels ? (
  <div
    class="card-title d-flex flex-wrap align-items-center"
    style={{ margin: "20px 0" }}
    key="post-labels"
  >
    {post.snapshot.labels.map((tag, idx) => (
      <div className="d-flex align-items-center my-3 me-3">
        <Link
          to={href({
            widgetSrc: "${REPL_DEVHUB}/widget/app",
            params: { page: "feed", tag: tag },
          })}
        >
          <div
            onClick={() => {
              if (typeof props.updateTagInParent === "function") {
                props.updateTagInParent(tag);
              }
            }}
            className="d-flex gap-3 align-items-center"
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
              props={{
                tag,
                black: true,
              }}
            />
          </div>
        </Link>
        {idx !== post.snapshot.labels.length - 1 && (
          <span className="ms-3">•</span>
        )}
      </div>
    ))}
  </div>
) : (
  <div key="post-labels"></div>
);

const Title = styled.h5`
  margin: 1rem 0;

  color: #151515;
  font-size: 1.15rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.625rem; /* 55.556% */
`;

const postTitle =
  snapshot.post_type == "Comment" ? (
    <div key="post-title"></div>
  ) : (
    <Title key="post-title">
      {emptyIcons[snapshot.post_type]} {renamedPostType}: {snapshot.name}
    </Title>
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
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.ProfileLine"}
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
        class={`collapse mt-3 ${
          defaultExpanded ||
          childPostHasDraft ||
          state.childrenOfChildPostsHasDraft ||
          state.expandReplies
            ? "show"
            : ""
        }`}
        id={`collapseChildPosts${postId}`}
      >
        {childPostIds.map((childId) => (
          <div key={childId} style={{ marginBottom: "0.5rem" }}>
            <Widget
              src="${REPL_DEVHUB}/widget/devhub.entity.post.Post"
              props={{
                id: childId,
                isUnderPost: true,
                onDraftStateChange,
                draftState,
                expandParent: () =>
                  State.update({ childrenOfChildPostsHasDraft: true }),
                referral: `subpost${childId}of${postId}`,
              }}
            />
          </div>
        ))}
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
  expandReplies: defaultExpanded,
});

const clampedContent = needClamp
  ? contentArray.slice(0, 3).join("\n")
  : snapshot.description;

const SeeMore = styled.a`
  cursor: pointer;
  color: #00b774 !important;
  font-weight: bold;
`;

// Should make sure the posts under the currently top viewed post are limited in size.
const descriptionArea = isUnderPost ? (
  <LimitedMarkdown className="overflow-auto" key="description-area">
    {/* {widget("components.molecule.markdown-viewer", {
      text: snapshot.description,
    })} */}
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"}
      props={{
        text: snapshot.description,
      }}
    />
  </LimitedMarkdown>
) : (
  <div className="w-100 overflow-auto">
    <div class={state.clamp ? "clamp" : ""}>
      {/* {widget("components.molecule.markdown-viewer", {
        text: state.clamp ? clampedContent : snapshot.description,
      })} */}
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"}
        props={{
          text: state.clamp ? clampedContent : snapshot.description,
        }}
      />
    </div>
    {state.clamp ? (
      <div class="d-flex justify-content-start">
        <SeeMore onClick={() => State.update({ clamp: false })}>
          See more
        </SeeMore>
      </div>
    ) : (
      <></>
    )}
  </div>
);

const timestampElement = (_snapshot) => {
  return (
    <Link
      class="text-muted"
      href={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: {
          page: "post",
          id: postId,
          timestamp: _snapshot.timestamp,
          compareTimestamp: null,
          referral,
        },
      })}
    >
      {readableDate(_snapshot.timestamp / 1000000).substring(4)}

      <Widget
        src="${REPL_MOB}/widget/ProfileImage"
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
    </Link>
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

const CardContainer = styled.div`
  padding: 1.5rem 3rem !important;
  border-radius: 16px !important;
  border: 1px solid rgba(129, 129, 129, 0.3) !important;
  background: #fffefe !important;

  @media screen and (max-width: 960px) {
    padding: 1rem !important;
  }
`;

return (
  <CardContainer className={`card ${borders[snapshot.post_type]} attractable`}>
    {header}
    <div className="card-body" style={{ padding: 0 }}>
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
          <div className="w-100 overflow-auto">
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
  </CardContainer>
);
