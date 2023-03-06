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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const requiredLabels = props.requiredLabels ?? ["near-social"];
const excludedLabels = props.excludedLabels ?? ["nft"];
const columnLabels = props.columnLabels ?? [
  "widget",
  "integration",
  "feature-request",
];

const labelsToIdSet = (labels) => {
  const ids = labels.map(
    (label) =>
      Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
        label,
      }) ?? []
  );
  const idsFlat = ids.flat(1);
  return new Set(idsFlat);
};

const requiredPostsSet = labelsToIdSet(requiredLabels);
const excludedPostsSet = labelsToIdSet(excludedLabels);

const postsPerLabel = columnLabels.map((cl) => {
  let allIds = (
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label: cl,
    }) ?? []
  ).reverse();
  if (requiredLabels.length > 0) {
    return {
      label: cl,
      posts: allIds.filter(
        (i) => requiredPostsSet.has(i) && !excludedPostsSet.has(i)
      ),
    };
  } else {
    // No extra filtering is required.
    return { label: cl, posts: allIds };
  }
});

function updatePostLabels(postId, oldLabel, newLabel) {
  const post = Near.view(nearDevGovGigsContractAccountId, "get_post", {
    post_id: postId,
  });
  if (!post) {
    console.log("There is no post to update labels for with the ID", postId);
    return;
  }
  const postBody = post.snapshot;
  const postLabels = postBody.labels;
  const removeLabelIndex = postLabels.indexOf(oldLabel);
  if (removeLabelIndex === -1) {
    console.log(
      "The post has already been moved (it is potentially a stale tab)."
    );
    // TODO: We should reload the board.
    return;
  }
  postLabels[removeLabelIndex] = newLabel;
  Near.call(
    nearDevGovGigsContractAccountId,
    "edit_post",
    { id: postId, body: postBody, labels: postLabels },
    100_000_000_000_000n,
    2_000_000_000_000_000_000_000n
  );
}

return (
  <div>
    <div class="row mb-2">
      {props.boardId ? (
        <div class="col">
          <small class="text-muted">
            <a
              class="card-link"
              href={href("Boards", { selectedBoardId: props.boardId })}
              role="button"
              target="_blank"
              title="Link to this board"
            >
              <div class="hstack gap-3">
                <div class="bi bi-share"></div>
                <div>Link to this board</div>
              </div>
            </a>
          </small>
        </div>
      ) : null}

      {requiredLabels.length > 0 ? (
        <div class="col">
          <small class="text-muted">
            Required labels:
            {requiredLabels.map((label) => (
              <a href={href("Feed", { label })} key={label}>
                <span class="badge text-bg-primary me-1">{label}</span>
              </a>
            ))}
          </small>
        </div>
      ) : null}
      {excludedLabels.length > 0 ? (
        <div class="col">
          <small class="text-muted">
            Excluded labels:
            {excludedLabels.map((label) => (
              <a href={href("Feed", { label })} key={label}>
                <span class="badge text-bg-primary me-1">{label}</span>
              </a>
            ))}
          </small>
        </div>
      ) : null}
    </div>
    <div class="row">
      {postsPerLabel.map((col, colIndex) => (
        <div class="col-4" key={col.label}>
          <div class="card">
            <div class="card-body border-secondary">
              <h6 class="card-title">
                {col.label.toUpperCase()}({col.posts.length})
              </h6>
              {col.posts.map((postId) => {
                const nextColumnLabel = columnLabels[colIndex + 1];
                let footer;
                if (nextColumnLabel) {
                  footer = (
                    <div class="btn-group" role="group">
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        style={{ border: "0px" }}
                        onClick={() =>
                          updatePostLabels(postId, col.label, nextColumnLabel)
                        }
                      >
                        <i class={`bi ${emptyIcons.Reply}`}> </i> Move to{" "}
                        {nextColumnLabel}
                      </button>
                    </div>
                  );
                }
                return widget(
                  "components.posts.CompactPost",
                  { id: postId, footer },
                  postId
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
