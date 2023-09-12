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

    case "object":
      return Array.isArray(input) && typeof lastKnownValue === "string"
        ? input.join(arrayDelimiter ?? ",")
        : input;

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

const useForm = ({ initialValues, stateKey, uninitialized }) => {
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

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const KanbanViewConfiguratorSettings = {
  maxColumnsNumber: 10,
};

const KanbanViewDefaults = {
  metadata: {
    kind: "kanban-view",
    title: "",
    description: "",
  },

  config: {
    ticket_kind: "post-ticket",
    tags: { excluded: [], required: [] },
    columns: {},
  },
};

const KanbanViewConfigurator = ({ communityHandle, link, permissions }) => {
  State.init({
    editingMode: "form",
    isActive: false,
  });

  const community = DevHub.useQuery("community", { handle: communityHandle });

  const view =
    (community.data?.board ?? null) === null
      ? {}
      : JSON.parse(community.data.board);

  const form = useForm({
    initialValues: Struct.pick(view, ["config", "metadata"]),
    stateKey: "view",
    uninitialized: (view.metadata ?? null) === null,
  });

  const isViewInitialized = (form.values.metadata ?? null) !== null;

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
        values: KanbanViewDefaults,
      },

      isActive: true,
    }));

  const columnsCreateNew = ({ lastKnownValue }) =>
    Object.keys(lastKnownValue).length <
    KanbanViewConfiguratorSettings.maxColumnsNumber
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

  const onSubmit = () =>
    DevHub.update_community_board({
      handle: communityHandle,
      board: JSON.stringify(form.values),
    });

  const viewDelete = () =>
    DevHub.update_community_board({ handle: communityHandle, board: null });

  const formElement = isViewInitialized ? (
    <>
      <div className="d-flex gap-3 flex-column flex-lg-row">
        {widget("components.molecule.text-input", {
          className: "flex-shrink-0",
          key: "kanban-view-title",
          label: "Board title",
          onChange: form.update({ path: ["metadata", "title"] }),
          placeholder: "Enter board title.",
          value: form.values.metadata.title,
        })}
      </div>

      {widget("components.molecule.text-input", {
        className: "w-100",
        inputProps: { className: "h-75" },
        key: "kanban-view-description",
        label: "Board description",
        multiline: true,
        onChange: form.update({ path: ["metadata", "description"] }),
        placeholder: "Enter board description.",
        value: form.values.metadata.description,
      })}

      <CompactContainer>
        <div className="d-flex gap-3 flex-column flex-lg-row">
          {widget("components.molecule.text-input", {
            className: "flex-shrink-0",
            format: "comma-separated",
            key: "kanban-view-tags-required",

            label:
              "Enter tags you want to include. Posts with these tags will display.",

            onChange: form.update({ path: ["config", "tags", "required"] }),
            placeholder: "tag1, tag2",
            value: form.values.config.tags.required.join(", "),
          })}
        </div>

        <div className="d-flex gap-3 flex-column flex-lg-row">
          {widget("components.molecule.text-input", {
            className: "flex-shrink-0",
            format: "comma-separated",
            key: "kanban-view-tags-excluded",

            label:
              "Enter tags you want to exclude. Posts with these tags will not show.",

            onChange: form.update({ path: ["config", "tags", "excluded"] }),
            placeholder: "tag3, tag4",
            value: form.values.config.tags.excluded.join(", "),
          })}
        </div>
      </CompactContainer>

      <div className="d-flex align-items-center justify-content-between">
        <span className="d-inline-flex gap-2 m-0">
          <i className="bi bi-list-task" />

          <span>
            {`Columns ( max. ${KanbanViewConfiguratorSettings.maxColumnsNumber} )`}
          </span>
        </span>
      </div>

      <div className="d-flex flex-column align-items-center gap-3">
        {Object.values(form.values.config.columns ?? {}).map(
          ({ id, description, tag, title }) => (
            <div
              className="d-flex gap-3 border border-secondary rounded-4 p-3 w-100"
              key={id}
            >
              <div className="d-flex flex-column gap-1 w-100">
                {widget("components.molecule.text-input", {
                  className: "flex-grow-1",
                  key: `column-${id}-title`,
                  label: "Column title",

                  onChange: form.update({
                    path: ["config", "columns", id, "title"],
                  }),

                  placeholder: "Enter column title.",
                  value: title,
                })}

                {widget("components.molecule.text-input", {
                  className: "flex-grow-1",
                  key: `column-${id}-description`,
                  label: "Description",

                  onChange: form.update({
                    path: ["config", "columns", id, "description"],
                  }),

                  placeholder: "Enter a brief description of the column.",
                  value: description,
                })}

                {widget("components.molecule.text-input", {
                  key: `kanban-view-column-${id}-tag`,
                  label: "Enter a single tag to show posts in this column",

                  onChange: form.update({
                    path: ["config", "columns", id, "tag"],
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
                  className="btn btn-outline-danger shadow"
                  onClick={form.update({
                    path: ["config", "columns"],
                    via: columnsDeleteById(id),
                  })}
                  title="Delete column"
                >
                  <i className="bi bi-trash-fill" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </>
  ) : null;

  return isViewInitialized && community.isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="d-flex flex-column gap-4">
      {isViewInitialized && state.isActive ? (
        <AttractableDiv className="d-flex flex-column gap-3 p-3 w-100 rounded-4">
          <div className="d-flex align-items-center justify-content-between gap-3">
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

          <div className="d-flex align-items-center justify-content-end gap-3">
            <button
              className="btn shadow btn-outline-secondary d-inline-flex gap-2 me-auto"
              disabled={
                form.values.columns.length >=
                KanbanViewConfiguratorSettings.maxColumnsNumber
              }
              onClick={form.update({
                path: ["config", "columns"],
                via: columnsCreateNew,
              })}
            >
              <i className="bi bi-plus-lg" />
              <span>New column</span>
            </button>

            <button
              className="btn btn-outline-danger border-0 d-inline-flex gap-2 align-items-center"
              onClick={onCancel}
              style={{ width: "fit-content" }}
            >
              <span>Cancel</span>
            </button>

            <button
              disabled={!form.hasUnsubmittedChanges}
              className="btn shadow btn-success d-inline-flex gap-2 align-items-center"
              onClick={onSubmit}
              style={{ width: "fit-content" }}
            >
              <i className="bi bi-cloud-arrow-up-fill" />
              <span>Save</span>
            </button>
          </div>
        </AttractableDiv>
      ) : null}

      {isViewInitialized ? (
        widget(["entity.workspace", form.values.metadata.kind].join("."), {
          ...form.values,
          isUnderConfiguration: state.isActive,
          onConfigureClick: () => formToggle(true),
          onDeleteClick: isViewInitialized ? viewDelete : null,
          link,
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
            icon: { kind: "bootstrap-icon", variant: "bi-kanban-fill" },
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
