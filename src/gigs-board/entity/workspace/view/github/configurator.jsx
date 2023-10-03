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
  maxColumnsNumber: 20,
};

const GithubKanbanBoardTicketFeaturesSchema = {
  id: { label: "GitHub ID" },
  author: { label: "Author" },
  labels: { label: "Labels" },
  type: { label: "Type" },
};

const GithubKanbanBoardTicketTypesSchema = {
  Issue: { label: "Issue" },
  PullRequest: { label: "Pull Request" },
};

const GithubKanbanBoardDefaults = {
  columns: {},
  dataTypesIncluded: { Issue: false, PullRequest: true },
  description: "",
  repoURL: "",
  ticketState: "all",
  title: "",

  metadata: {
    id: uuid(),
    type: "github.kanban_board",

    ticket: {
      type: "github.kanban_ticket",
      features: { id: true, author: true, labels: true, type: true },
    },
  },
};

const toMigrated = ({ metadata, id, ...restParams }) => ({
  metadata: {
    ...GithubKanbanBoardDefaults.metadata,
    ...metadata,
    id: id ?? metadata.id,
  },

  ...restParams,
});

const GithubViewConfigurator = ({ communityHandle, link, permissions }) => {
  State.init({
    editingMode: "form",
    isActive: false,
  });

  const community = DevHub.useQuery("community", { handle: communityHandle });

  const data = Object.values(
    ((community?.data?.github ?? null) === null
      ? {}
      : JSON.parse(community.data.github)
    )?.kanbanBoards ?? {}
  )[0];

  const form = useForm({
    initialValues: Struct.typeMatch(data) ? toMigrated(data) : {},
    stateKey: "view",
    uninitialized: !Struct.typeMatch(data),
  });

  const isViewInitialized = (form.values.metadata.id ?? null) !== null;

  const formToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isActive: forcedState ?? !lastKnownState.isActive,
    }));

  const onEditingModeChange = ({ target: { value } }) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      editingMode: value,
    }));

  const newViewInit = () =>
    State.update((lastKnownState) => ({
      ...lastKnownState,

      board: {
        hasUnsubmittedChanges: false,
        values: GithubKanbanBoardDefaults,
      },

      isActive: true,
    }));

  const columnsCreateNew = ({ lastKnownValue }) =>
    Object.keys(lastKnownValue).length < settings.maxColumnsNumber
      ? {
          ...(lastKnownValue ?? {}),

          ...withUUIDIndex({
            description: "",
            labelSearchTerms: [],
            title: "New column",
          }),
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
    DevHub.update_community_github({
      handle: communityHandle,

      github: JSON.stringify({
        kanbanBoards: { [form.values.metadata.id]: form.values },
      }),
    });

  const formElement = isViewInitialized ? (
    <>
      <div className="d-flex flex-column">
        <div className="d-flex gap-1 flex-column flex-xl-row">
          {widget("components.molecule.text-input", {
            className: "w-100",
            key: `${form.values.metadata.id}-repoURL`,
            label: "Repository URL",
            onChange: form.update({ path: ["repoURL"] }),
            placeholder: "https://github.com/example-org/example-repo",
            value: form.values.repoURL,
          })}

          {widget("components.molecule.text-input", {
            className: "w-100",
            key: `${form.values.metadata.id}-title`,
            label: "Title",
            onChange: form.update({ path: ["title"] }),
            placeholder: "NEAR Protocol NEPs",
            value: form.values.title,
          })}
        </div>

        {widget("components.molecule.text-input", {
          className: "w-100",
          key: `${form.values.metadata.id}-description`,
          label: "Description",
          onChange: form.update({ path: ["description"] }),
          placeholder: "Latest NEAR Enhancement Proposals by status.",
          value: form.values.description,
        })}
      </div>

      <div className="d-flex gap-4 flex-row flex-wrap justify-content-between">
        {widget("components.organism.configurator", {
          heading: "Ticket types",
          classNames: { root: "col-12 col-md-4 h-auto" },
          externalState: form.values.dataTypesIncluded,
          isActive: true,
          isEmbedded: true,
          isUnlocked: permissions.can_configure,
          onChange: form.update({ path: ["dataTypesIncluded"] }),
          schema: GithubKanbanBoardTicketTypesSchema,
        })}

        <div
          className={[
            "col-12 col-md-3",
            "d-flex gap-3 flex-column justify-content-center p-4",
          ].join(" ")}
        >
          <span
            className="d-inline-flex gap-2"
            id={`${form.values.metadata.id}-ticketState`}
          >
            <i class="bi bi-cone-striped" />
            <span>Ticket state</span>
          </span>

          {widget("components.molecule.button-switch", {
            currentValue: form.values.ticketState,
            key: "ticketState",
            onChange: form.update({ path: ["ticketState"] }),

            options: [
              { label: "All", value: "all" },
              { label: "Open", value: "open" },
              { label: "Closed", value: "closed" },
            ],
          })}
        </div>

        {widget("components.organism.configurator", {
          heading: "Card fields",
          classNames: { root: "col-12 col-md-4 h-auto" },
          externalState: form.values.metadata.ticket.features,
          isActive: true,
          isEmbedded: true,
          isUnlocked: permissions.can_configure,
          onChange: form.update({ path: ["metadata", "ticket", "features"] }),
          schema: GithubKanbanBoardTicketFeaturesSchema,
        })}
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <span className="d-inline-flex gap-2 m-0">
          <i className="bi bi-list-task" />
          <span>{`Columns ( max. ${settings.maxColumnsNumber} )`}</span>
        </span>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 w-100">
        {Object.values(form.values.columns ?? {}).map(
          ({ id, description, labelSearchTerms, title }) => (
            <AttractableDiv
              className="d-flex gap-3 rounded-4 border p-3 w-100"
              key={`column-${id}-configurator`}
            >
              <div className="d-flex flex-column gap-1 w-100">
                {widget("components.molecule.text-input", {
                  className: "flex-grow-1",
                  key: `${form.values.metadata.id}-column-${id}-title`,
                  label: "Title",
                  onChange: form.update({ path: ["columns", id, "title"] }),
                  placeholder: "👀 Review",
                  value: title,
                })}

                {widget("components.molecule.text-input", {
                  format: "comma-separated",
                  key: `${form.values.metadata.id}-column-${title}-labelSearchTerms`,

                  label: `Search terms for all the labels
											MUST be presented in included tickets`,

                  onChange: form.update({
                    path: ["columns", id, "labelSearchTerms"],
                  }),

                  placeholder: "WG-, draft, review, proposal, ...",
                  value: labelSearchTerms.join(", "),
                })}

                {widget("components.molecule.text-input", {
                  className: "flex-grow-1",
                  key: `${form.values.metadata.id}-column-${id}-description`,
                  label: "Description",

                  onChange: form.update({
                    path: ["columns", id, "description"],
                  }),

                  placeholder:
                    "NEPs that need a review by Subject Matter Experts.",

                  value: description,
                })}
              </div>

              <div
                className="d-flex flex-column gap-3 border-start p-3 pe-0"
                style={{ marginTop: -16, marginBottom: -16 }}
              >
                <button
                  className="btn btn-outline-danger"
                  onClick={form.update({
                    path: ["columns"],
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

  return community.data === null ? (
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
              <span>GitHub board configuration</span>
            </h5>

            {widget("components.molecule.button-switch", {
              currentValue: state.editingMode,
              isHidden: true,
              key: "editingMode",
              onChange: onEditingModeChange,

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

      {Object.keys(form.values).length > 0 ? (
        widget(`entity.workspace.view.${form.values.metadata.type}`, {
          ...form.values,

          configurationControls: [
            {
              label: "New column",

              disabled:
                Object.keys(form.values.columns).length >=
                settings.maxColumnsNumber,

              icon: { type: "bootstrap_icon", variant: "bi-plus-lg" },

              onClick: form.update({
                path: ["columns"],
                via: columnsCreateNew,
              }),
            },
          ],

          isConfiguratorActive: state.isActive,
          isSynced: form.isSynced,
          link,
          onConfigure: () => formToggle(true),
          permissions,
        })
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center gap-4"
          style={{ height: 384 }}
        >
          <h5 className="h5 d-inline-flex gap-2 m-0">
            This community doesn't have a GitHub board
          </h5>

          {widget("components.molecule.button", {
            icon: { type: "bootstrap_icon", variant: "bi-github" },
            isHidden: !permissions.can_configure,
            label: "Create GitHub board",
            onClick: newViewInit,
          })}
        </div>
      )}
    </div>
  );
};

return GithubViewConfigurator(props);
