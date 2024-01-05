const { getPostsByLabel } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);
const { getPost } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);
getPost || (getPost = () => {});
getPostsByLabel || (getPostsByLabel = () => {});

const postTagsToIdSet = (tags) => {
  return new Set(
    (tags ?? [])?.map((tag) => getPostsByLabel({ label: tag }) ?? []).flat(1)
  );
};

const sortByValues = {
  descendingAmount: "descending-amount",
  ascendingAmount: "ascending-amount",
  descendingDate: "descending-date",
  ascendingDate: "ascending-date",
  ascendingAuthor: "ascending-author",
  descendingAuthor: "descending-author",
  ascendingSponsor: "ascending-sponsor",
  descendingSponsor: "descending-sponsor",
  descendingLikes: "descending-likes",
  ascendingLikes: "ascending-likes",
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

const basicAlphabeticalComparison = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

const KanbanPostBoard = ({ metadata, payload }) => {
  const boardData = Object.entries(configToColumnData(payload) ?? {});

  const view = boardData.map(([columnId, column]) => {
    const data = [];
    column.postIds?.map((postId) => {
      if (postId) {
        const postData = getPost({
          post_id: postId ? parseInt(postId) : 0,
        });
        data.push(postData);
      }
    });

    // sort data by selected sorting mechanism
    switch (metadata.ticket.sortBy) {
      case sortByValues.descendingAmount:
        data.sort((a, b) => b?.snapshot?.amount - a?.snapshot?.amount);
        break;
      case sortByValues.ascendingAmount:
        data.sort((a, b) => a?.snapshot?.amount - b?.snapshot?.amount);
        break;
      case sortByValues.descendingDate:
        data.sort(
          (a, b) =>
            parseInt(b?.snapshot?.timestamp) - parseInt(a?.snapshot?.timestamp)
        );
        break;
      case sortByValues.ascendingDate:
        data.sort(
          (a, b) =>
            parseInt(a?.snapshot?.timestamp) - parseInt(b?.snapshot?.timestamp)
        );
        break;
      case sortByValues.ascendingAuthor:
        data.sort((a, b) =>
          basicAlphabeticalComparison(a.author_id, b.author_id)
        );
        break;
      case sortByValues.descendingAuthor:
        data.sort((a, b) =>
          basicAlphabeticalComparison(b.author_id, a.author_id)
        );
        break;
      case sortByValues.ascendingSponsor:
        data.sort((a, b) =>
          basicAlphabeticalComparison(
            a?.snapshot?.requested_sponsor || a?.snapshot?.supervisor,
            b?.snapshot?.requested_sponsor || b?.snapshot?.supervisor
          )
        );
        break;
      case sortByValues.descendingSponsor:
        data.sort((a, b) =>
          basicAlphabeticalComparison(
            b?.snapshot?.requested_sponsor || b?.snapshot?.supervisor,
            a?.snapshot?.requested_sponsor || a?.snapshot?.supervisor
          )
        );
        break;
      case sortByValues.descendingLikes:
        data.sort((a, b) => b.likes.length - a.likes.length);
        break;
      case sortByValues.ascendingLikes:
        data.sort((a, b) => a.likes.length - b.likes.length);
        break;
      default:
        data;
        break;
    }

    if (showTable) {
      return (
        <div className="card p-2">
          <div className="d-flex justify-content-between p-3 align-items-center">
            <div className="d-flex gap-2 align-items-center">
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {column.title}
              </div>
              <div className="badge rounded-pill bg-secondary">
                {column.postIds.length}
              </div>
            </div>
            {column.postIds?.length > 0 && (
              <div
                onClick={() => {
                  const data = { ...expandTables };
                  data[columnId] =
                    typeof data[columnId] === "boolean"
                      ? !data[columnId]
                      : false;

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
            <div className="card-body w-100">
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
                  {data.length === column.postIds.length &&
                    data.map((postData) => (
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
                          metadata: { id: postData.id, ...metadata.ticket },
                          isTableView: true,
                          columnId,
                          data: postData,
                        }}
                        key={postData.id}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className="col-3"
          style={{ minWidth: "300px" }}
          key={`column-${columnId}-view`}
        >
          <div className="card rounded-4">
            <div
              className={[
                "card-body d-flex flex-column gap-3 p-2",
                "border border-1 border-secondary rounded-4",
              ].join(" ")}
              style={{ height: "75vh" }}
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

              <div
                class="d-flex flex-column gap-2"
                style={{ overflow: "scroll" }}
              >
                {data.length === column.postIds.length &&
                  data.map((postData) => (
                    <Widget
                      src={`${REPL_DEVHUB}/widget/devhub.entity.addon.${metadata.ticket.type}`}
                      props={{
                        metadata: { id: postData.postId, ...metadata.ticket },
                        isTableView: false,
                        data: postData,
                      }}
                      key={postData.postId}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  return (
    <div>
      <div className="d-flex flex-column align-items-center gap-2 pb-4 w-100">
        {/* <div class="form-check">
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
        </div> */}
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
        <span
          className={
            showTable ? "w-100 d-flex flex-column gap-3" : "d-flex gap-3 w-100"
          }
        >
          {view}
        </span>
      </div>
    </div>
  );
};

return KanbanPostBoard(props);
