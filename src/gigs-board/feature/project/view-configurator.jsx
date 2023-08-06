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

const useForm = ({ initialValues, stateKey: formStateKey, uninitialized }) => {
  const initialFormState = {
    hasUnsubmittedChanges: false,
    values: initialValues ?? {},
  };

  const formState = state[formStateKey] ?? null,
    isSynced = Struct.isEqual(formState?.values ?? {}, initialFormState.values);

  const formReset = () =>
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [formStateKey]: initialFormState,
      hasUnsubmittedChanges: false,
    }));

  const formUpdate = ({ path, via: customFieldUpdate, ...params }) => (
    fieldInput
  ) => {
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

      [formStateKey]: {
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
    (formState === null ||
      (Object.keys(formState?.values ?? {}).length > 0 &&
        !formState.hasUnsubmittedChanges &&
        !isSynced))
  ) {
    formReset();
  }

  return {
    ...(formState ?? initialFormState),
    isSynced,
    reset: formReset,
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
  edit_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "edit_community_github", { handle, github }) ??
    null,

  create_project: ({ tag, name, description }) =>
    Near.call(devHubAccountId, "create_project", { tag, name, description }) ??
    null,

  update_project_metadata: ({ metadata }) =>
    Near.call(devHubAccountId, "update_project_metadata", { metadata }) ?? null,

  get_project_views_metadata: ({ project_id }) =>
    Near.view(devHubAccountId, "get_project_views_metadata", { project_id }) ??
    null,

  create_project_view: ({ project_id, view }) =>
    Near.call(devHubAccountId, "create_project_view", { project_id, view }) ??
    null,

  get_project_view: ({ project_id, view_id }) =>
    Near.view(devHubAccountId, "get_project_view", { project_id, view_id }) ??
    null,

  update_project_view: ({ project_id, view }) =>
    Near.call(devHubAccountId, "create_project_view", { project_id, view }) ??
    null,

  get_access_control_info: () =>
    Near.view(devHubAccountId, "get_access_control_info") ?? null,

  get_all_authors: () => Near.view(devHubAccountId, "get_all_authors") ?? null,

  get_all_communities: () =>
    Near.view(devHubAccountId, "get_all_communities") ?? null,

  get_all_labels: () => Near.view(devHubAccountId, "get_all_labels") ?? null,

  get_community: ({ handle }) =>
    Near.view(devHubAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(devHubAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(devHubAccountId, "get_root_members") ?? null,

  useQuery: ({ name, params }) => {
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
/* INCLUDE: "entity/viewer" */
const access_control_info = DevHub.useQuery({
  name: "access_control_info",
});

const Viewer = {
  can: {
    editCommunity: (communityData) =>
      Struct.typeMatch(communityData) &&
      (communityData.admins.includes(context.accountId) ||
        Viewer.role.isDevHubModerator),
  },

  projectPermissions: (projectId) =>
    Near.view(devHubAccountId, "get_project_permissions", {
      id: projectId,
    }) ?? { can_configure: false },

  role: {
    isDevHubModerator:
      access_control_info.data === null || access_control_info.isLoading
        ? false
        : access_control_info.data.members_list[
            "team:moderators"
          ]?.children?.includes?.(context.accountId) ?? false,
  },
};
/* END_INCLUDE: "entity/viewer" */

const view_configs_mock = {
  fj3938fh: JSON.stringify({
    tags: {
      excluded: [],
      required: ["near-social"],
    },

    columns: [
      { id: "hr839hf2", tag: "widget", title: "Widget" },
      { id: "iu495g95", tag: "integration", title: "Integration" },
      { id: "i5hy2iu3", tag: "feature-request", title: "Feature Request" },
    ],
  }),

  f34tf3ea45: JSON.stringify({
    tags: {
      excluded: [],
      required: ["gigs-board"],
    },

    columns: [
      { id: "l23r34t4", tag: "nep", title: "NEP" },
      { id: "f5rn09i4", tag: "badges", title: "Badges" },
      { id: "v33xj3u8", tag: "feature-request", title: "Feature Request" },
    ],
  }),

  y45iwt4e: JSON.stringify({
    tags: {
      excluded: [],
      required: ["funding"],
    },

    columns: [
      { id: "gf39lk82", tag: "funding-new-request", title: "New Request" },

      {
        id: "dg39i49b",
        tag: "funding-information-collection",
        title: "Information Collection",
      },

      { id: "e3if93ew", tag: "funding-processing", title: "Processing" },
      { id: "u8t3gu9f", tag: "funding-funded", title: "Funded" },
    ],
  }),
};

const ProjectViewConfiguratorSettings = {
  maxColumnsNumber: 20,
};

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const ProjectViewMetadataDefaults = {
  id: null,
  kind: "kanban-view",
  title: "",
  description: "",
};

const ProjectViewConfigDefaults = {
  tags: { excluded: [], required: [] },
  columns: [],
};

const ProjectViewConfigurator = ({
  link,
  metadata,
  permissions,
  projectId,
}) => {
  State.init({
    editingMode: "form",
    isEditorActive: false,
  });

  const isNewView = (metadata ?? null) === null;

  const config =
    { data: view_configs_mock[metadata.id] } ?? // !TODO: delete this line before release
    DevHub.useQuery({
      name: "project_view_config",
      params: { project_id: projectId, view_id: metadata.id },
    });

  const form = useForm({
    initialValues: {
      metadata: metadata ?? ProjectViewMetadataDefaults,
      config: isNewView ? ProjectViewConfigDefaults : JSON.parse(config.data),
    },

    stateKey: "form",
  });

  const errors = {
    noProjectId: typeof projectId !== "string",
  };

  const editorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isEditorActive: forcedState ?? !lastKnownState.isEditorActive,
    }));

  const editingModeSwitch = ({ target: { value } }) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      editingMode: value,
    }));

  const columnsCreateNew = ({ lastKnownValue }) =>
    lastKnownValue.length < ProjectViewConfiguratorSettings.maxColumnsNumber
      ? [...lastKnownValue, { id: uuid(), tag: "", title: "New column" }]
      : lastKnownValue;

  const columnsDeleteById = (targetId) => ({ lastKnownValue }) =>
    lastKnownValue.filter(({ id }) => targetId !== id);

  const onCancel = () => {
    form.reset();
    editorToggle(false);
  };

  const onSubmit = () =>
    DevHub.update_project_view({
      project_id: projectId,

      view: {
        metadata: { ...ProjectViewMetadataDefaults, ...form.values.metadata },

        config: JSON.stringify({
          ...ProjectViewConfigDefaults,
          ...form.values.config,
        }),
      },
    });

  const formElement =
    Object.keys(form.values).length > 0 ? (
      <>
        <div className="d-flex gap-3 flex-column flex-lg-row">
          {widget("components.molecule.text-input", {
            className: "flex-shrink-0",
            key: `${form.values.metadata.id ?? "new-view"}-title`,
            label: "Name",
            onChange: form.update({ path: ["metadata", "title"] }),
            placeholder: "NEAR Protocol NEPs",
            value: form.values.metadata.title,
          })}
        </div>

        {widget("components.molecule.text-input", {
          className: "w-100",
          inputProps: { className: "h-75" },
          key: `${form.values.metadata.id ?? "new-view"}-description`,
          label: "Description",
          multiline: true,
          onChange: form.update({ path: ["metadata", "description"] }),
          placeholder: "Latest NEAR Enhancement Proposals by status.",
          value: form.values.metadata.description,
        })}

        <div className="d-flex gap-3 flex-column flex-lg-row">
          {widget("components.molecule.text-input", {
            className: "flex-shrink-0",
            format: "comma-separated",
            key: `${form.values.metadata.id ?? "new-view"}-tags-required`,
            label: "Search terms for all the tags MUST be presented in posts",
            onChange: form.update({ path: ["config", "tags", "required"] }),
            placeholder: "near-protocol-neps, ",
            value: form.values.config.tags.required.join(", "),
          })}
        </div>

        <div className="d-flex gap-3 flex-column flex-lg-row">
          {widget("components.molecule.text-input", {
            className: "flex-shrink-0",
            format: "comma-separated",
            key: `${form.values.metadata.id ?? "new-view"}-tags-excluded`,

            label:
              "Search terms for all the tags MUST NOT be presented in posts",

            onChange: form.update({ path: ["config", "tags", "excluded"] }),
            placeholder: "near-protocol-neps, ",
            value: form.values.config.tags.excluded.join(", "),
          })}
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <span className="d-inline-flex gap-2 m-0">
            <i className="bi bi-list-task" />

            <span>
              {`Columns ( max. ${ProjectViewConfiguratorSettings.maxColumnsNumber} )`}
            </span>
          </span>
        </div>

        <div className="d-flex flex-column align-items-center gap-3">
          {form.values.config.columns.map(
            ({ id, description, tag, title }, columnIdx) => (
              <div
                className="d-flex gap-3 border border-secondary rounded-4 p-3 w-100"
                key={id}
              >
                <div className="d-flex flex-column gap-1 w-100">
                  {widget("components.molecule.text-input", {
                    className: "flex-grow-1",
                    key: `column-${id}-title`,
                    label: "Title",

                    onChange: form.update({
                      path: ["columns", columnIdx, "title"],
                    }),

                    placeholder: "👀 Review",
                    value: title,
                  })}

                  {widget("components.molecule.text-input", {
                    className: "flex-grow-1",
                    key: `column-${id}-description`,
                    label: "Description",

                    onChange: form.update({
                      path: ["columns", columnIdx, "description"],
                    }),

                    placeholder:
                      "NEPs that need a review by Subject Matter Experts.",

                    value: description,
                  })}

                  {widget("components.molecule.text-input", {
                    format: "comma-separated",

                    key: `${
                      form.values.metadata.id ?? "new-view"
                    }-column-${id}-tag`,

                    label: `Search terms for all the tags
											MUST be presented in included posts`,

                    onChange: form.update({
                      path: ["columns", columnIdx, "tag"],
                    }),

                    placeholder: "",
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

  return config.data === null ? (
    <div>Loading...</div>
  ) : (
    <div className="d-flex flex-column gap-4 py-4">
      {state.isEditorActive && form.values.length > 0 ? (
        <AttractableDiv className="d-flex flex-column gap-3 p-3 w-100 rounded-4">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-wrench-adjustable-circle-fill" />
              <span>View configuration</span>
            </h5>

            {widget("components.molecule.button-switch", {
              currentValue: state.editingMode,
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
                ProjectViewConfiguratorSettings.maxColumnsNumber
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

      {widget(["entity.project", form.values.metadata.kind].join("."), {
        ...form.values,
        editorTrigger: () => editorToggle(true),
        link,
        permissions,
      })}
    </div>
  );
};

return ProjectViewConfigurator(props);
