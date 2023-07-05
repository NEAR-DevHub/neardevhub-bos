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
    transactionHashes: props.transactionHashes,
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

const postId = props.post.id ?? (props.id ? parseInt(props.id) : 0);
const post =
  props.post ??
  Near.view(nearDevGovGigsContractAccountId, "get_post", { post_id: postId });
if (!post) {
  return <div>Loading ...</div>;
}

const snapshot = post.snapshot;
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
    {props.searchKeywords.map((label) => {
      return <span class="badge text-bg-info me-1">{label}</span>;
    })}
  </div>
) : (
  <div key="post-search-keywords"></div>
);

const searchKeywords = props.searchKeywords ? (
  <div class="mb-1" key="search-keywords">
    <small class="text-muted">{postSearchKeywords}</small>
  </div>
) : (
  <div key="search-keywords"></div>
);

const linkToParent =
  isUnderPost || !parentId ? (
    <div key="link-to-parent"></div>
  ) : (
    <div className="card-header" key="link-to-parent">
      <a href={href("Post", { id: parentId })}>
        <i class="bi bi-arrow-90deg-up"></i>Go to parent{" "}
      </a>
    </div>
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
        data-bs-toggle="collapse"
        href={`#collapse${postType}Editor${postId}`}
        role="button"
        aria-expanded="false"
        aria-controls={`collapse${postType}Editor${postId}`}
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
    class="card-link"
    href={href("Post", { id: postId })}
    role="button"
    target="_blank"
    title="Open in new tab"
  >
    <div class="bi bi-share"></div>
  </a>
);

const header = (
  <div className="card-header" key="header">
    <small class="text-muted">
      <div class="row justify-content-between">
        <div class="col-4">
          <Widget
            src={`neardevgov.near/widget/ProfileLine`}
            props={{ accountId: post.author_id }}
          />
        </div>
        <div class="col-5">
          <div class="d-flex justify-content-end">
            {editControl}
            {timestamp}
            <div class="bi bi-clock-history px-2"></div>
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
  Idea: "border-secondary",
  Comment: "border-secondary",
  Submission: "border-secondary",
  Attestation: "border-secondary",
  Sponsorship: "border-secondary",
  Github: "border-secondary",
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
        data-bs-toggle="collapse"
        href={`#collapse${postType}Creator${postId}`}
        role="button"
        aria-expanded="false"
        aria-controls={`collapse${postType}Creator${postId}`}
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
        <button
          type="button"
          class="btn btn-outline-primary"
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
        </button>
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-outline-primary"
            style={{ border: "0px" }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class={`bi ${emptyIcons.Reply}`}> </i> Reply
          </button>
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
        <button
          type="button"
          class="btn btn-outline-primary"
          style={{ border: "0px" }}
          data-bs-toggle="collapse"
          href={`#collapseChildPosts${postId}`}
          aria-expanded={defaultExpanded}
          aria-controls={`collapseChildPosts${postId}`}
        >
          <i class="bi bi-arrows-expand"> </i>{" "}
          {`Expand Replies (${childPostIds.length})`}
        </button>
      </div>
    </div>
  </div>
);

const DRAFT_STATE_STORAGE_KEY = "POST_DRAFT_STATE";
let draftstate;

try {
  draftstate = JSON.parse(Storage.privateGet(DRAFT_STATE_STORAGE_KEY));
  console.log(draftstate);
} catch(e) {}

const CreatorWidget = (postType) => {
  return (
    <div
      class={draftstate?.parent_post_id == postId && draftstate?.postType == postType ? "" : "collapse"}
      id={`collapse${postType}Creator${postId}`}
      data-bs-parent={`#accordion${postId}`}
    >
      {widget("entity.post.PostEditor", {
        postType,
        parentId: postId,
        mode: "Create",
      })}
    </div>
  );
};

const EditorWidget = (postType) => {
  return (
    <div
    class={draftstate?.edit_post_id == postId && draftstate?.postType == postType ? "" : "collapse"}
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
        token: post.snapshot.sponsorship_token,
        supervisor: post.snapshot.supervisor,
        githubLink: post.snapshot.github_link,
      })}
    </div>
  );
};

const editorsFooter = props.isPreview ? null : (
  <div class="row" id={`accordion${postId}`} key="editors-footer">
    {CreatorWidget("Comment")}
    {EditorWidget("Comment")}
    {CreatorWidget("Idea")}
    {EditorWidget("Idea")}
    {CreatorWidget("Submission")}
    {EditorWidget("Submission")}
    {CreatorWidget("Attestation")}
    {EditorWidget("Attestation")}
    {CreatorWidget("Sponsorship")}
    {EditorWidget("Sponsorship")}
    {CreatorWidget("Github")}
    {EditorWidget("Github")}
  </div>
);

const renamedPostType =
  snapshot.post_type == "Submission" ? "Solution" : snapshot.post_type;

const postLabels = post.snapshot.labels ? (
  <div class="card-title" key="post-labels">
    {post.snapshot.labels.map((label) => {
      return (
        <a href={href("Feed", { label }, label)}>
          <span class="badge text-bg-primary me-1">{label}</span>
        </a>
      );
    })}
  </div>
) : (
  <div key="post-labels"></div>
);

const postTitle =
  snapshot.post_type == "Comment" ? (
    <div key="post-title"></div>
  ) : (
    <h5 class="card-title" key="post-title">
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
        Maximum amount: {snapshot.amount} {snapshot.sponsorship_token}
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

const postsList =
  props.isPreview || childPostIds.length == 0 ? (
    <div key="posts-list"></div>
  ) : (
    <div class="row" key="posts-list">
      <div
        class={`collapse ${defaultExpanded ? "show" : ""}`}
        id={`collapseChildPosts${postId}`}
      >
        {childPostIds.map((childId) =>
          widget(
            "entity.post.Post",
            { id: childId, isUnderPost: true },
            `subpost${childId}of${postId}`
          )
        )}
      </div>
    </div>
  );

const limitedMarkdown = styled.div`
  max-height: 20em;
`;

const clampMarkdown = styled.div`
  .clamp {
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0)
    );
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }
`;

// Determine if located in the post page.
const isInList = props.isInList;
const contentArray = snapshot.description.split("\n");
const needClamp = isInList && contentArray.length > 5;

initState({
  clamp: needClamp,
});

const clampedContent = needClamp
  ? contentArray.slice(0, 5).join("\n")
  : snapshot.description;

const onMention = (accountId) => (
  <span key={accountId} className="d-inline-flex" style={{ fontWeight: 500 }}>
    <Widget
      src="neardevgov.near/widget/ProfileLine"
      props={{
        accountId: accountId.toLowerCase(),
        hideAccountId: true,
        tooltip: true,
      }}
    />
  </span>
);

// Should make sure the posts under the currently top viewed post are limited in size.
const descriptionArea = isUnderPost ? (
  <limitedMarkdown className="overflow-auto" key="description-area">
    <Markdown
      class="card-text"
      text={snapshot.description}
      onMention={onMention}
    />
  </limitedMarkdown>
) : (
  <clampMarkdown>
    <div class={state.clamp ? "clamp" : ""}>
      <Markdown
        class="card-text"
        text={state.clamp ? clampedContent : snapshot.description}
        onMention={onMention}
        key="description-area"
      ></Markdown>
    </div>
    {state.clamp ? (
      <div class="d-flex justify-content-center">
        <a
          class="btn btn-link text-secondary"
          onClick={() => State.update({ clamp: false })}
        >
          Read More
        </a>
      </div>
    ) : (
      <></>
    )}
  </clampMarkdown>
);

return (
  <AttractableDiv className={`card my-2 ${borders[snapshot.post_type]}`}>
    {linkToParent}
    {header}
    <div className="card-body">
      {searchKeywords}
      {postLabels}
      {postTitle}
      {postExtra}
      {descriptionArea}
      {buttonsFooter}
      {editorsFooter}
      {postsList}
    </div>
  </AttractableDiv>
);
