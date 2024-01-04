const { getPostsByLabel } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);
getPostsByLabel || (getPostsByLabel = () => {});

const postTagsToIdSet = (tags) => {
  return new Set(
    (tags ?? [])?.map((tag) => getPostsByLabel({ label: tag }) ?? []).flat(1)
  );
};

const [showTable, setShowTable] = useState(false);
const [expandTables, setExpandTables] = useState({});
// we have heading in this component but the logic to display them is in child
const [showDescription, setDescriptionDisplay] = useState({});
const [showFunding, setFundingDisplay] = useState({});
const [showTags, setTagsDisplay] = useState({});
const [showSponsor, setSponsorDisplay] = useState({});

const configToColumnData = ({ columns, tags }) =>
  Object.entries(columns).reduce((registry, [columnId, column]) => {
    const postIds = (getPostsByLabel({ label: column.tag }) ?? []).reverse();
    return {
      ...registry,
      [columnId]: {
        ...column,
        postIds: postIds,
      },
    };
  }, {});

const KanbanPostBoard = ({ metadata, payload }) => {
  const boardData = Object.entries(configToColumnData(payload) ?? {});

  const tableView = boardData.map(([columnId, column]) => {
    return (
      <div className="card p-2">
        <div className="d-flex justify-content-between p-3 align-items-center">
          <div className="d-flex gap-2 align-items-center">
            <div style={{ fontSize: 20, fontWeight: 700 }}>{column.title}</div>
            <div className="badge rounded-pill bg-secondary">
              {column.postIds.length}
            </div>
          </div>
          {column.postIds?.length > 0 && (
            <div
              onClick={() => {
                const data = { ...expandTables };
                data[columnId] =
                  typeof data[columnId] === "boolean" ? !data[columnId] : false;

                setExpandTables(data);
              }}
            >
              {expandTables[columnId] !== false ? (
                <i class="bi bi-caret-up"></i>
              ) : (
                <i class="bi bi-caret-down"></i>
              )}
            </div>
          )}
        </div>

        {expandTables[columnId] !== false && column.postIds?.length > 0 && (
          <div className="card-body w-100" style={{ overflow: "scroll" }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Title</th>
                  {showDescription[columnId] && <th>Description</th>}
                  {showFunding[columnId] && <th>Amount</th>}
                  {showSponsor[columnId] && <th>Sponser/Supervisor</th>}
                  {showTags[columnId] && <th>Tags</th>}
                </tr>
              </thead>
              <tbody>
                {column.postIds?.map((postId) => (
                  <Widget
                    src={`${REPL_DEVHUB}/widget/devhub.entity.addon.${metadata.ticket.type}`}
                    props={{
                      setDescriptionDisplay,
                      setFundingDisplay,
                      setSponsorDisplay,
                      setTagsDisplay,
                      showDescriptionState: showDescription,
                      showFundingState: showFunding,
                      showSponsorState: showSponsor,
                      showTagsState: showTags,
                      metadata: { id: postId, ...metadata.ticket },
                      isTableView: true,
                      columnId,
                    }}
                    key={postId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  });

  const columnView = boardData.map(([columnId, column]) => (
    <div
      className="col-3"
      style={{ minWidth: "300px" }}
      key={`column-${columnId}-view`}
    >
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
                props={{
                  metadata: { id: postId, ...metadata.ticket },
                  isTableView: false,
                }}
                key={postId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div>
      <div className="d-flex flex-column align-items-center gap-2 py-4 w-100">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value={showTable}
            id={"table"}
            checked={showTable === true}
            onChange={() => setShowTable(!showTable)}
          />
          <label class="form-check-label" for={`table`}>
            Table View
          </label>
        </div>
        <h5 className="h4 d-inline-flex gap-2 m-0">
          <span>{metadata?.title}</span>
        </h5>

        <p className="h6 m-0 py-1 text-secondary text-center">
          {metadata?.description}
        </p>
      </div>
      <div className="d-flex gap-3 w-100" style={{ overflow: "scroll" }}>
        <div
          className={[
            "d-flex align-items-center justify-content-center w-100 text-black-50 opacity-50",
            columns.length === 0 ? "" : "d-none",
          ].join(" ")}
          style={{ height: 384 }}
        >
          No columns were created so far.
        </div>

        {showTable ? (
          <div className="w-100 d-flex flex-column gap-3">{tableView} </div>
        ) : (
          columnView
        )}
      </div>
    </div>
  );
};

return KanbanPostBoard(props);
