const ownerId = "devgovgigs.near";

const requiredLabels = props.requiredLabels ?? ["near-social"];
const excludedLabels = props.excludedLabels ?? ["nft"];
const columnLabels = props.columnLabels ?? [
  "widget",
  "integration",
  "feature-request",
];

const labelsToIdSet = (labels) => {
  const ids = labels.map((label) => {
    return (
      Near.view(ownerId, "get_posts_by_label", {
        label,
      }) ?? []
    );
  });
  const idsFlat = ids.flat(1);
  return new Set(idsFlat);
};

const requiredPostsSet = labelsToIdSet(requiredLabels);
const excludedPostsSet = labelsToIdSet(excludedLabels);

const postsPerLabel = columnLabels.map((cl) => {
  let allIds = (
    Near.view(ownerId, "get_posts_by_label", {
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

return (
  <div>
    <div class="row mb-2">
      {props.boardId ? (
        <div class="col">
          <small class="text-muted">
            <a
              class="card-link"
              href={`https://near.social/#/devgovgigs.near/widget/Ideas?selectedBoardId=${props.boardId}`}
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
            {requiredLabels.map((label) => {
              return (
                <a
                  href={`https://near.social/#/devgovgigs.near/widget/Ideas?label=${label}`}
                >
                  <span class="badge text-bg-primary me-1">{label}</span>
                </a>
              );
            })}
          </small>
        </div>
      ) : null}
      {excludedLabels.length > 0 ? (
        <div class="col">
          <small class="text-muted">
            Excluded labels:
            {excludedLabels.map((label) => {
              return (
                <a
                  href={`https://near.social/#/devgovgigs.near/widget/Ideas?label=${label}`}
                >
                  <span class="badge text-bg-primary me-1">{label}</span>
                </a>
              );
            })}
          </small>
        </div>
      ) : null}
    </div>
    <div class="row">
      {postsPerLabel.map((col) => {
        return (
          <div class="col-4">
            <div class="card">
              <div class="card-body border-secondary">
                <h6 class="card-title">
                  {col.label.toUpperCase()}({col.posts.length})
                </h6>
                {col.posts.map((postId) => {
                  return (
                    <Widget
                      src={`${ownerId}/widget/CompactPost`}
                      props={{ id: postId }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
