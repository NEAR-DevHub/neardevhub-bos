const { getPostsByLabel } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);
getPostsByLabel || (getPostsByLabel = () => {});

const postTagsToIdSet = (tags) => {
  return new Set(
    (tags ?? [])?.map((tag) => getPostsByLabel({ label: tag }) ?? []).flat(1)
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

const KanbanPostBoard = ({ metadata, payload }) => {
  const columns = Object.entries(configToColumnData(payload) ?? {}).map(
    ([columnId, column]) => (
      <div className="col-3" key={`column-${columnId}-view`}>
        <div className="card rounded-4">
          <div
            className={[
              "card-body d-flex flex-column gap-3 p-2",
              "border border-2 border-secondary rounded-4",
            ].join(" ")}
            style={{ height: "75vh", overflow: "scroll" }}
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
              {column.postIds?.map((postId) => (
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.entity.addon.${metadata.ticket.type}`}
                  props={{ metadata: { id: postId, ...metadata.ticket } }}
                  key={postId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div>
      <div className="d-flex flex-column align-items-center gap-2 py-4">
        <h5 className="h5 d-inline-flex gap-2 m-0">
          <span>{metadata?.title}</span>
        </h5>

        <p className="m-0 py-1 text-secondary text-center">
          {metadata?.description}
        </p>
      </div>
      <div className="d-flex gap-3 w-100">
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
      </div>
    </div>
  );
};

return KanbanPostBoard(props);
