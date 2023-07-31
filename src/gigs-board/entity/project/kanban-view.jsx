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

const postTagsToIdSet = (tags) =>
  new Set(
    tags
      .map(
        (tag) =>
          Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
            label: tag,
          }) ?? []
      )
      .flat(1)
  );

const ProjectKanbanView = ({ id, columns, link, tags }) => {
  const postIdsByColumn = columns.map((column) => {
    const postIds = (
      Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
        label: column.tag,
      }) ?? []
    ).reverse();

    if (tags.required.length > 0) {
      return {
        ...column,

        posts: postIds.filter(
          (postId) =>
            postTagsToIdSet(tags.required).has(postId) &&
            !postTagsToIdSet(tags.excluded).has(postId)
        ),
      };
    } else {
      return { ...column, posts: postIds };
    }
  });

  return (
    <div>
      <div class="row mb-2">
        {id ? (
          <div class="col">
            <small class="text-muted">
              <a
                class="card-link"
                href={link}
                role="button"
                target="_blank"
                title="Link to this view"
              >
                <div class="hstack gap-3">
                  <div class="bi bi-share"></div>
                  <div>Link to this view</div>
                </div>
              </a>
            </small>
          </div>
        ) : null}

        {tags.required.length > 0 ? (
          <div class="col">
            <small class="text-muted">
              <span>Required tags:</span>

              {tags.required.map((tag) => (
                <a href={href("Feed", { tag })} key={tag}>
                  <span class="badge text-bg-primary me-1">{tag}</span>
                </a>
              ))}
            </small>
          </div>
        ) : null}

        {tags.excluded.length > 0 ? (
          <div class="col">
            <small class="text-muted">
              <span>Excluded tags:</span>

              {tags.excluded.map((tag) => (
                <a href={href("Feed", { tag })} key={tag}>
                  <span class="badge text-bg-primary me-1">{tag}</span>
                </a>
              ))}
            </small>
          </div>
        ) : null}
      </div>

      <div class="row">
        {postIdsByColumn.map((column) => (
          <div class="col-3" key={column.tag}>
            <div class="card">
              <div class="card-body border-secondary">
                <h6 class="card-title">
                  {column.title}({column.postIds.length})
                </h6>

                {column.postIds.map((postId) =>
                  widget("entity.post.CompactPost", { id: postId }, postId)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

return ProjectKanbanView(props);
