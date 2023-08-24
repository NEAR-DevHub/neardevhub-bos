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
/* INCLUDE: "core/adapter/dev-hub" */
const devHubAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  get_root_members: () =>
    Near.view(devHubAccountId, "get_root_members") ?? null,

  has_moderator: ({ account_id }) =>
    Near.view(devHubAccountId, "has_moderator", { account_id }) ?? null,

  create_community: ({ inputs }) =>
    Near.call(devHubAccountId, "create_community", { inputs }),

  get_community: ({ handle }) =>
    Near.view(devHubAccountId, "get_community", { handle }) ?? null,

  get_account_community_permissions: ({ account_id, community_handle }) =>
    Near.view(devHubAccountId, "get_account_community_permissions", {
      account_id,
      community_handle,
    }) ?? null,

  update_community: ({ handle, community }) =>
    Near.call(devHubAccountId, "update_community", { handle, community }),

  delete_community: ({ handle }) =>
    Near.call(devHubAccountId, "delete_community", { handle }),

  update_community_board: ({ handle, board }) =>
    Near.call(devHubAccountId, "update_community_board", { handle, board }),

  update_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "update_community_github", { handle, github }),

  get_access_control_info: () =>
    Near.view(devHubAccountId, "get_access_control_info") ?? null,

  get_all_authors: () => Near.view(devHubAccountId, "get_all_authors") ?? null,

  get_all_communities_metadata: () =>
    Near.view(devHubAccountId, "get_all_communities_metadata") ?? null,

  get_all_labels: () => Near.view(devHubAccountId, "get_all_labels") ?? null,

  get_post: ({ post_id }) =>
    Near.view(devHubAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  useQuery: (name, params) => {
    const initialState = { data: null, error: null, isLoading: true };

    const cacheState = useCache(
      () =>
        Near.asyncView(devHubAccountId, ["get", name].join("_"), params ?? {})
          .then((response) => ({
            ...initialState,
            data: response ?? null,
            isLoading: false,
          }))
          .catch((error) => ({
            ...initialState,
            error: props?.error ?? error,
            isLoading: false,
          })),

      JSON.stringify({ name, params }),
      { subscribe: true }
    );

    return cacheState === null ? initialState : cacheState;
  },
};
/* END_INCLUDE: "core/adapter/dev-hub" */

const postTagsToIdSet = (tags) => {
  return new Set(
    tags
      .map(
        (tag) =>
          Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
            label: tag,
          }) ?? []
      )
      .flat(1)
  );
};

const configToColumns = ({ columns, tags }) =>
  Object.entries(columns).reduce((registry, [columnId, column]) => {
    const postIds = (
      Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
        label: column.tag,
      }) ?? []
    ).reverse();

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

const KanbanView = ({
  config,
  metadata,
  isUnderConfiguration,
  link,
  onConfigureClick,
  onDeleteClick,
  permissions,
}) => {
  const columns = configToColumns(config);

  return (
    <div className="d-flex flex-column gap-4">
      <div
        className={"d-flex justify-content-end gap-3 p-3 rounded-4"}
        style={{ backgroundColor: "#181818" }}
      >
        {typeof link === "string" && link.length > 0 ? (
          <>
            {false && // Disabled until workspaces are introduced
              widget("components.molecule.button", {
                classNames: { root: "btn-sm btn-outline-secondary" },
                href: link,
                icon: { kind: "bootstrap-icon", variant: "box-arrow-up-right" },
                label: "Open in new tab",
                rel: "noreferrer",
                role: "button",
                target: "_blank",
                type: "link",
              })}

            {widget("components.molecule.button", {
              classNames: {
                root: "btn-sm btn-outline-secondary me-auto text-white",
              },

              icon: { kind: "bootstrap-icon", variant: "bi-clipboard-fill" },
              label: "Copy link",
              onClick: () => clipboard.writeText(link),
            })}
          </>
        ) : null}

        {permissions.can_configure && (
          <>
            {widget("components.molecule.button", {
              classNames: { root: "btn-sm btn-primary" },

              icon: {
                kind: "bootstrap-icon",
                variant: "bi-gear-wide-connected",
              },

              isHidden:
                typeof onConfigureClick !== "function" || isUnderConfiguration,

              label: "Configure",
              onClick: onConfigureClick,
            })}

            {widget("components.molecule.button", {
              classNames: {
                root: "btn-sm btn-outline-danger shadow-none border-0",
              },

              icon: { kind: "bootstrap-icon", variant: "bi-recycle" },
              isHidden: "Disabled for MVP", // typeof onDeleteClick !== "function",
              label: "Delete",
              onClick: onDeleteClick,
            })}
          </>
        )}
      </div>

      <div className="d-flex flex-column align-items-center gap-2 pt-4">
        <h5 className="h5 d-inline-flex gap-2 m-0">
          <i className="bi bi-kanban-fill" />

          <span>
            {(metadata.title?.length ?? 0) > 0
              ? metadata.title
              : "Untitled view"}
          </span>
        </h5>

        <p className="m-0 py-1 text-secondary text-center">
          {(metadata.description?.length ?? 0) > 0
            ? metadata.description
            : "No description provided"}
        </p>
      </div>

      <div className="d-flex gap-3" style={{ overflowX: "auto" }}>
        {Object.keys(columns).length > 0 ? (
          Object.values(columns).map((column) => (
            <div className="col-3" key={column.id}>
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
                        ["entity.workspace", config.ticket_kind].join("."),
                        { id: postId },
                        postId
                      )
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

return KanbanView(props);
