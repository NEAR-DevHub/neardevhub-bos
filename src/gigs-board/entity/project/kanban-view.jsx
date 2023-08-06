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
/* INCLUDE: "core/lib/uuid" */
const uuid = () =>
  [Date.now().toString(16)]
    .concat(
      Array.from(
        { length: 4 },
        () => Math.floor(Math.random() * 0xffffffff) & 0xffffffff
      ).map((value) => value.toString(16))
    )
    .join("-");

const withUUIDIndex = (data) => {
  const id = uuid();

  return Object.fromEntries([[id, { ...data, id }]]);
};
/* END_INCLUDE: "core/lib/uuid" */

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

const ProjectKanbanView = ({ metadata, config, link, permissions }) => {
  console.log("ProjectKanbanView", { metadata, config, link, permissions });

  const postIdsByColumn = config.columns.map((column) => {
    const postIds = (
      Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
        label: column.tag,
      }) ?? []
    ).reverse();

    return {
      ...column,

      postIds:
        tags.required.length > 0
          ? postIds.filter(
              (postId) =>
                postTagsToIdSet(tags.required).has(postId) &&
                !postTagsToIdSet(tags.excluded).has(postId)
            )
          : postIds,
    };
  });

  return (
    <div>
      <div class="row mb-2">
        {(link ?? null) !== null ? (
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
      </div>

      <div class="row">
        {postIdsByColumn.map((column) => (
          <div class="col-3" key={column.id}>
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
