const { widget } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
const { getPostsByLabel } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);
getPostsByLabel || (getPostsByLabel = () => {});
widget || (widget = () => {});

const postTagsToIdSet = (tags) => {
  return new Set(
    tags.map((tag) => getPostsByLabel({ label: tag }) ?? []).flat(1)
  );
};

const configToColumnData = ({ columns, tags }) =>
  Object.entries(columns).reduce((registry, [columnId, column]) => {
    const postIds = (getPostsByLabel({ label: column.tag }) ?? []).reverse();
    return {
      ...registry,
      [columnId]: {
        ...column,
        postIds:
          tags.required.length > 0
            ? postIds.filter(
                (postId) =>
                  postTagsToIdSet(tags.required).has(postId) &&
                  !postTagsToIdSet(tags.excluded).has(postId)
              )
            : postIds,
      },
    };
  }, {});

const KanbanPostBoard = ({
  metadata,
  payload,
  configurationControls,
  isConfiguratorActive,
  isSynced,
  link,
  onCancel,
  onConfigure,
  onDelete,
  onSave,
  permissions,
}) => {
  const columns = Object.entries(configToColumnData(payload)).map(
    ([columnId, column]) => (
      <div className="col-3" key={`column-${columnId}-view`}>
        <div className="card rounded-4">
          <div
            className={[
              "card-body d-flex flex-column gap-3 p-2",
              "border border-2 border-secondary rounded-4",
            ].join(" ")}
          >
            <span className="d-flex flex-column py-1">
              <h6 className="card-title h6 d-flex align-items-center gap-2 m-0">
                {column.title}

                <span className="badge rounded-pill bg-secondary">
                  {column.postIds.length}
                </span>
              </h6>

              <p class="text-secondary m-0">{column.description}</p>
            </span>

            <div class="d-flex flex-column gap-2">
              {column.postIds.map((postId) =>
                widget(
                  `entity.addon.${metadata.ticket.type}`,
                  { metadata: { id: postId, ...metadata.ticket } },
                  postId
                )
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );

  return widget("entity.layout", {
    configurationControls,
    isConfiguratorActive,
    isSynced,
    link,
    metadata,
    onCancel,
    onConfigure,
    onDelete,
    onSave,
    permissions,
    children: (
      <>
        <div
          className={[
            "d-flex align-items-center justify-content-center w-100 text-black-50 opacity-50",
            columns.length === 0 ? "" : "d-none",
          ].join(" ")}
          style={{ height: 384 }}
        >
          No columns were created so far.
        </div>

        {columns}
      </>
    ),
  });
};

return KanbanPostBoard(props);
