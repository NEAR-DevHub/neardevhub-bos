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
/* INCLUDE: "core/lib/data-request" */
const DataRequest = {
  /**
   * Requests all the data from non-empty pages of the paginated API.
   *
   * **Notice: currently expected to work only with array responses.**
   *
   * @param {object} parameters
   * 	Request parameters including the number of page to start with,
   * 	and an accumulated response buffer, if it exists.
   *
   * @param {array | null | undefined} parameters.buffer
   * @param {number} parameters.startWith
   *
   * @param {(pageNumber: number) => array} requestByNumber
   *
   * @returns {array} The final accumulated response.
   */
  paginated: (requestByNumber, { buffer, startWith }) => {
    const startPageNumber = startWith ?? 1,
      accumulatedResponse = buffer ?? [];

    const latestResponse = requestByNumber(startPageNumber) ?? [];

    if (latestResponse.length === 0) {
      return accumulatedResponse;
    } else {
      return DataRequest.paginated(requestByNumber, {
        buffer: [...accumulatedResponse, ...latestResponse],
        startWith: startPageNumber + 1,
      });
    }
  },
};
/* END_INCLUDE: "core/lib/data-request" */
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

const configToColumns = (config) =>
  config.columns.map((column) => {
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

const withType = (type) => (data) => ({ ...data, type });

const ProjectKanbanView = ({
  config,
  metadata,
  editorTrigger,
  link,
  permissions,
}) => {
  const columns = configToColumns(config);

  return (
    <div className="d-flex flex-column gap-4 pb-4">
      <div className="d-flex flex-column align-items-center gap-2">
        <h5 className="h5 d-inline-flex gap-2 m-0">
          <i className="bi bi-kanban-fill" />
          <span>
            {(metadata.title?.length ?? 0) > 0
              ? metadata.title
              : "Untitled view"}
          </span>
        </h5>

        <p className="m-0 py-1 text-secondary text-center">
          {metadata.description}
        </p>
      </div>

      <div className="d-flex justify-content-end gap-3">
        {(link ?? null) !== null ? (
          <>
            <a
              className="card-link d-inline-flex me-auto"
              href={link}
              rel="noreferrer"
              role="button"
              target="_blank"
              title="Link to this view"
            >
              <span className="hstack gap-2">
                <i className="bi bi-share" />
                <span>Open in new tab</span>
              </span>
            </a>

            <button
              className="btn shadow btn-sm btn-outline-secondary d-inline-flex gap-2"
              onClick={() => clipboard.writeText(link)}
            >
              <i className="bi bi-clipboard-fill" />
              <span>Copy link</span>
            </button>
          </>
        ) : null}

        {permissions.can_configure ? (
          <button
            className="btn shadow btn-sm btn-primary d-inline-flex gap-2"
            onClick={editorTrigger}
          >
            <i className="bi bi-wrench-adjustable-circle-fill" />
            <span>Configure</span>
          </button>
        ) : null}
      </div>

      <div className="d-flex gap-3" style={{ overflowX: "auto" }}>
        {columns.length > 0 ? (
          columns.map((column) => (
            <div className="col-3" key={column.id}>
              <div className="card rounded-4">
                <div
                  className={[
                    "card-body d-flex flex-column gap-3",
                    "border border-2 border-secondary rounded-4",
                  ].join(" ")}
                >
                  <h6 className="card-title h6 d-flex align-items-center gap-2 m-0">
                    {column.title}

                    <span className="badge rounded-pill bg-secondary">
                      {column.postIds.length}
                    </span>
                  </h6>

                  <p class="text-secondary m-0">{column.description}</p>

                  <div class="d-flex flex-column gap-3">
                    {column.postIds.map((postId) =>
                      widget("entity.post.CompactPost", { id: postId }, postId)
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className={[
              "d-flex align-items-center justify-content-center",
              "w-100 text-black-50 opacity-50",
            ].join(" ")}
            style={{ height: 384 }}
          >
            No columns were created so far.
          </div>
        )}
      </div>
    </div>
  );
};

return ProjectKanbanView(props);
