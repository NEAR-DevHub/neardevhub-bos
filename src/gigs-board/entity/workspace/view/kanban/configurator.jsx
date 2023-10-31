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
/* INCLUDE: "core/lib/struct" */
const Struct = {
  deepFieldUpdate: (
    node,
    { input, params, path: [nextNodeKey, ...remainingPath], via: toFieldValue }
  ) => ({
    ...node,

    [nextNodeKey]:
      remainingPath.length > 0
        ? Struct.deepFieldUpdate(
            Struct.typeMatch(node[nextNodeKey]) ||
              Array.isArray(node[nextNodeKey])
              ? node[nextNodeKey]
              : {
                  ...((node[nextNodeKey] ?? null) !== null
                    ? { __archivedLeaf__: node[nextNodeKey] }
                    : {}),
                },

            { input, path: remainingPath, via: toFieldValue }
          )
        : toFieldValue({
            input,
            lastKnownValue: node[nextNodeKey],
            params,
          }),
  }),

  isEqual: (input1, input2) =>
    Struct.typeMatch(input1) && Struct.typeMatch(input2)
      ? JSON.stringify(Struct.toOrdered(input1)) ===
        JSON.stringify(Struct.toOrdered(input2))
      : false,

  toOrdered: (input) =>
    Object.keys(input)
      .sort()
      .reduce((output, key) => ({ ...output, [key]: input[key] }), {}),

  pick: (object, subsetKeys) =>
    Object.fromEntries(
      Object.entries(object ?? {}).filter(([key, _]) =>
        subsetKeys.includes(key)
      )
    ),

  typeMatch: (input) =>
    input !== null && typeof input === "object" && !Array.isArray(input),
};
/* END_INCLUDE: "core/lib/struct" */
/* INCLUDE: "core/lib/gui/form" */
const defaultFieldUpdate = ({
  input,
  lastKnownValue,
  params: { arrayDelimiter },
}) => {
  switch (typeof input) {
    case "boolean":
      return input;

    case "object": {
      if (Array.isArray(input) && typeof lastKnownValue === "string") {
        return input.join(arrayDelimiter ?? ",");
      } else {
        return Array.isArray(lastKnownValue)
          ? [...lastKnownValue, ...input]
          : { ...lastKnownValue, ...input };
      }
    }

    case "string":
      return Array.isArray(lastKnownValue)
        ? input.split(arrayDelimiter ?? ",").map((string) => string.trim())
        : input;

    default: {
      if ((input ?? null) === null) {
        switch (typeof lastKnownValue) {
          case "boolean":
            return !lastKnownValue;

          default:
            return lastKnownValue;
        }
      } else return input;
    }
  }
};

const useForm = ({ initialValues, onUpdate, stateKey, uninitialized }) => {
  const initialFormState = {
    hasUnsubmittedChanges: false,
    values: initialValues ?? {},
  };

  const formState = state[stateKey] ?? null,
    isSynced = Struct.isEqual(formState?.values ?? {}, initialFormState.values);

  const formReset = () =>
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [stateKey]: initialFormState,
      hasUnsubmittedChanges: false,
    }));

  const formUpdate =
    ({ path, via: customFieldUpdate, ...params }) =>
    (fieldInput) => {
      const updatedValues = Struct.deepFieldUpdate(
        formState?.values ?? {},

        {
          input: fieldInput?.target?.value ?? fieldInput,
          params,
          path,

          via:
            typeof customFieldUpdate === "function"
              ? customFieldUpdate
              : defaultFieldUpdate,
        }
      );

      State.update((lastKnownComponentState) => ({
        ...lastKnownComponentState,

        [stateKey]: {
          hasUnsubmittedChanges: !Struct.isEqual(
            updatedValues,
            initialFormState.values
          ),

          values: updatedValues,
        },
      }));

      if (
        typeof onUpdate === "function" &&
        !Struct.isEqual(updatedValues, initialFormState.values)
      ) {
        onUpdate(updatedValues);
      }
    };

  if (
    !uninitialized &&
    (formState === null || (!formState.hasUnsubmittedChanges && !isSynced))
  ) {
    formReset();
  }

  return {
    ...(formState ?? initialFormState),
    isSynced,
    reset: formReset,
    stateKey,
    update: formUpdate,
  };
};
/* END_INCLUDE: "core/lib/gui/form" */
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

const settings = {
  maxColumnsNumber: 10,
};

const KanbanPostBoardBasicInfoSchema = {
  title: { label: "Title", order: 1, placeholder: "Enter board title." },

  description: {
    label: "Description",
    order: 2,
    placeholder: "Enter board description.",
  },
};

const KanbanPostBoardTagsSchema = {
  required: {
    label:
      "Enter tags you want to include. Posts with these tags will display.",

    order: 1,
    placeholder: "tag1, tag2",
  },

  excluded: {
    label:
      "Enter tags you want to exclude. Posts with these tags will not show.",

    order: 2,
    placeholder: "tag3, tag4",
  },
};

const KanbanPostBoardTicketFeaturesSchema = {
  author: { label: "Author" },
  like_count: { label: "Likes" },
  reply_count: { label: "Replies", noop: true },
  sponsorship_request_indicator: { label: "Sponsorship request indicator" },
  requested_sponsorship_value: { label: "Amount of requested funds" },
  requested_sponsor: { label: "Requested sponsor" },
  approved_sponsorship_value: { label: "Approved amount" },
  sponsorship_supervisor: { label: "Supervisor" },
  tags: { label: "Tags" },
  type: { label: "Post type" },
};

const KanbanPostBoardDefaults = {
  metadata: {
    id: uuid(),
    type: "kanban.post_board",
    title: "",
    description: "",

    ticket: {
      type: "kanban.post_ticket",

      features: {
        author: true,
        like_count: true,
        reply_count: false,
        sponsorship_request_indicator: false,
        requested_sponsorship_value: false,
        requested_sponsor: false,
        approved_sponsorship_value: true,
        sponsorship_supervisor: true,
        tags: true,
        type: true,
      },
    },
  },

  payload: {
    columns: {},
    tags: { excluded: [], required: [] },
  },
};

const toMigrated = ({ config, metadata, payload }) => ({
  metadata: {
    ...KanbanPostBoardDefaults.metadata,
    ...metadata,

    ticket: {
      ...KanbanPostBoardDefaults.metadata.ticket,
      ...metadata.ticket,

      features: {
        ...KanbanPostBoardDefaults.metadata.ticket.features,
        ...metadata.ticket.features,
      },
    },
  },

  payload: {
    ...KanbanPostBoardDefaults.payload,
    ...payload,
    ...config,
  },
});

const KanbanViewConfigurator = ({ communityHandle, link, permissions }) => {
  State.init({
    editingMode: "form",
    isActive: false,
  });

  const community = DevHub.useQuery("community", { handle: communityHandle });

  const data =
    (community.data?.board ?? null) === null
      ? {}
      : JSON.parse(community.data.board);

  const form = useForm({
    initialValues: Struct.pick(
      data.metadata === undefined ? {} : toMigrated(data),
      ["metadata", "payload"]
    ),

    stateKey: "view",
    uninitialized: (data.metadata ?? null) === null,
  });

  const isViewInitialized = Object.keys(form.values.metadata ?? {}).length > 0;

  const formToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isActive: forcedState ?? !lastKnownState.isActive,
    }));

  const editingModeSwitch = ({ target: { value } }) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      editingMode: value,
    }));

  const newViewInit = () =>
    State.update((lastKnownState) => ({
      ...lastKnownState,

      [form.stateKey]: {
        hasUnsubmittedChanges: false,
        values: KanbanPostBoardDefaults,
      },

      isActive: true,
    }));

  const columnsCreateNew = ({ lastKnownValue }) =>
    Object.keys(lastKnownValue).length < settings.maxColumnsNumber
      ? {
          ...(lastKnownValue ?? {}),
          ...withUUIDIndex({ tag: "", title: "New column", description: "" }),
        }
      : lastKnownValue;

  const columnsDeleteById =
    (id) =>
    ({ lastKnownValue }) =>
      Object.fromEntries(
        Object.entries(lastKnownValue).filter(([columnId]) => columnId !== id)
      );

  const onCancel = () => {
    form.reset();
    formToggle(false);
  };

  const onSave = () =>
    DevHub.update_community_board({
      handle: communityHandle,
      board: JSON.stringify(form.values),
    });

  const viewDelete = () =>
    DevHub.update_community_board({ handle: communityHandle, board: null });

  const formElement = isViewInitialized ? (
    <>
      <div className="d-flex flex-column flex-lg-row align-items-stretch gap-4 w-100">
        <div className="d-flex flex-column gap-4 w-100">
          {widget("components.organism.configurator", {
            heading: "Basic information",
            externalState: form.values.metadata,
            isActive: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onChange: form.update({ path: ["metadata"] }),
            schema: KanbanPostBoardBasicInfoSchema,
          })}

          {widget("components.organism.configurator", {
            heading: "Tags",
            externalState: form.values.payload.tags,
            isActive: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onChange: form.update({ path: ["payload", "tags"] }),
            schema: KanbanPostBoardTagsSchema,
          })}
        </div>

        {widget("components.organism.configurator", {
          heading: "Card fields",
          classNames: { root: "w-auto h-auto" },
          externalState: form.values.metadata.ticket.features,
          isActive: true,
          isEmbedded: true,
          isUnlocked: permissions.can_configure,
          onChange: form.update({ path: ["metadata", "ticket", "features"] }),
          schema: KanbanPostBoardTicketFeaturesSchema,
          style: { minWidth: "36%" },
        })}
      </div>

      <div className="d-flex align-items-center justify-content-between w-100">
        <span className="d-inline-flex gap-2 m-0">
          <i className="bi bi-list-task" />
          <span>{`Columns ( max. ${settings.maxColumnsNumber} )`}</span>
        </span>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 w-100">
        {Object.values(form.values.payload.columns ?? {}).map(
          ({ id, description, tag, title }) => (
            <AttractableDiv
              className="d-flex gap-3 rounded-4 border p-3 w-100"
              key={`column-${id}-configurator`}
            >
              <div className="d-flex flex-column gap-1 w-100">
                {widget("components.molecule.text-input", {
                  className: "flex-grow-1",
                  key: `column-${id}-title`,
                  label: "Column title",

                  onChange: form.update({
                    path: ["payload", "columns", id, "title"],
                  }),

                  placeholder: "Enter column title.",
                  value: title,
                })}

                {widget("components.molecule.text-input", {
                  className: "flex-grow-1",
                  key: `column-${id}-description`,
                  label: "Description",

                  onChange: form.update({
                    path: ["payload", "columns", id, "description"],
                  }),

                  placeholder: "Enter a brief description of the column.",
                  value: description,
                })}

                {widget("components.molecule.text-input", {
                  key: `kanban-view-column-${id}-tag`,
                  label: "Enter a single tag to show posts in this column",

                  onChange: form.update({
                    path: ["payload", "columns", id, "tag"],
                  }),

                  placeholder: "Tag-Name",
                  value: tag,
                })}
              </div>

              <div
                className="d-flex flex-column gap-3 border-start p-3 pe-0"
                style={{ marginTop: -16, marginBottom: -16 }}
              >
                <button
                  className="btn btn-outline-danger"
                  onClick={form.update({
                    path: ["payload", "columns"],
                    via: columnsDeleteById(id),
                  })}
                  title="Delete column"
                >
                  <i className="bi bi-trash-fill" />
                </button>
              </div>
            </AttractableDiv>
          )
        )}

        <div className="d-flex gap-3 justify-content-end w-100">
          {widget("components.molecule.button", {
            classNames: {
              root: "d-flex btn btn-outline-danger shadow-none border-0",
            },

            isHidden: typeof onCancel !== "function" || !state.isActive,
            label: "Cancel",
            onClick: onCancel,
          })}

          {widget("components.molecule.button", {
            classNames: { root: "btn btn-success" },
            disabled: form.isSynced,

            icon: {
              type: "svg_icon",
              variant: "floppy_drive",
              width: 14,
              height: 14,
            },

            isHidden: typeof onSave !== "function" || !state.isActive,
            label: "Save",
            onClick: onSave,
          })}
        </div>
      </div>
    </>
  ) : null;

  return !isViewInitialized && community.data === null ? (
    <div class="alert alert-danger" role="alert">
      {community.isLoading
        ? "Loading..."
        : `Community with handle ${communityHandle} not found.`}
    </div>
  ) : (
    <div
      className="d-flex flex-column gap-4 w-100"
      style={{ maxWidth: "100%" }}
    >
      {isViewInitialized ? (
        <div
          className={[
            "d-flex flex-column gap-4 w-100",
            state.isActive ? "" : "d-none",
          ].join(" ")}
        >
          <div className="d-flex align-items-center justify-content-between gap-3 w-100">
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-gear-wide-connected" />
              <span>Kanban board configuration</span>
            </h5>

            {widget("components.molecule.button-switch", {
              currentValue: state.editingMode,
              isHidden: true,
              key: "editingMode",
              onChange: editingModeSwitch,

              options: [
                { label: "Form", value: "form" },
                { label: "JSON", value: "JSON" },
              ],

              title: "Editing mode selection",
            })}
          </div>

          {state.editingMode === "form" ? (
            formElement
          ) : (
            <div className="d-flex flex-column flex-grow-1 border-0 bg-transparent w-100">
              <textarea
                className="form-control"
                disabled
                rows="12"
                type="text"
                value={JSON.stringify(form.values ?? {}, null, "\t")}
              />
            </div>
          )}
        </div>
      ) : null}

      {isViewInitialized ? (
        widget(`entity.workspace.view.${form.values.metadata.type}`, {
          ...form.values,

          configurationControls: [
            {
              label: "New column",

              disabled:
                Object.keys(form.values.payload.columns).length >=
                settings.maxColumnsNumber,

              icon: { type: "bootstrap_icon", variant: "bi-plus-lg" },

              onClick: form.update({
                path: ["payload", "columns"],
                via: columnsCreateNew,
              }),
            },
          ],

          isConfiguratorActive: state.isActive,
          isSynced: form.isSynced,
          link,
          onConfigure: () => formToggle(true),
          onDelete: isViewInitialized ? viewDelete : null,
          permissions,
        })
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center gap-4"
          style={{ height: 384 }}
        >
          <h5 className="h5 d-inline-flex gap-2 m-0">
            This community doesn't have a kanban board
          </h5>

          {widget("components.molecule.button", {
            icon: { type: "bootstrap_icon", variant: "bi-kanban-fill" },
            isHidden: !permissions.can_configure,
            label: "Create kanban board",
            onClick: newViewInit,
          })}
        </div>
      )}
    </div>
  );
};

return KanbanViewConfigurator(props);
