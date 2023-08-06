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

const ProjectConfigurator = ({ metadata, permissions }) => {
  State.init({
    isConfiguratorActive: false,
  });

  const configuratorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isConfiguratorActive: forcedState ?? !lastKnownState.isConfiguratorActive,
    }));

  const form = useForm({ initialValues: { metadata }, stateKey: "project" });

  const onCancel = () => {
    form.reset();
    configuratorToggle(false);
  };

  const onSubmit = () => DevHub.update_project_metadata(form.values);

  return (
    <div className="d-flex justify-content-between gap-3 w-100">
      <div className="d-flex flex-column gap-2 justify-content-end">
        {state.isConfiguratorActive ? (
          widget("components.molecule.text-input", {
            className: "w-100 p-0 gap-0",
            inputProps: { className: "h-75 border-0 bg-dark text-white fs-1" },
            key: `project-${form.values.metadata.id}-name`,
            multiline: false,
            onChange: form.update({ path: ["metadata", "name"] }),
            placeholder: "Project name",
            value: form.values.metadata.name,
            skipPaddingGap: true,
          })
        ) : (
          <h1 className="m-0 px-2 py-2">{metadata.name}</h1>
        )}

        {state.isConfiguratorActive ? (
          widget("components.molecule.text-input", {
            className: "w-100 border-none",
            inputProps: { className: "h-75 border-0 bg-dark text-white" },
            key: `project-${form.values.metadata.id}-description`,
            multiline: false,
            onChange: form.update({ path: ["metadata", "description"] }),
            placeholder: "Project description",
            value: form.values.metadata.description,
            skipPaddingGap: true,
          })
        ) : (
          <p className="m-0 px-2 py-2">{metadata.description}</p>
        )}
      </div>

      <div className="d-flex flex-column gap-3 justify-content-between align-items-end h-100">
        {state.isConfiguratorActive ? (
          widget("components.molecule.text-input", {
            className: "w-100",
            inputProps: {
              className: "h-75 text-end border-0 bg-dark text-white",
            },
            key: `project-${form.values.metadata.id}-tag`,
            multiline: false,
            onChange: form.update({ path: ["metadata", "tag"] }),
            placeholder: "project-tag",
            value: form.values.metadata.tag,
            skipPaddingGap: true,
          })
        ) : (
          <span
            class="badge bg-primary rounded-4 text-decoration-none"
            style={{ cursor: "default" }}
            title="DevHub tag"
          >
            {metadata.tag}
          </span>
        )}

        {permissions.can_configure ? (
          <div className="d-flex gap-3">
            {widget("components.atom.button", {
              classNames: {
                root: [
                  "btn-danger",
                  !state.isConfiguratorActive ? "d-none" : "",
                ].join(" "),
              },
              label: "Cancel",
              onClick: onCancel,
            })}

            {widget("components.atom.button", {
              classNames: {
                root: [
                  "btn-success",
                  !state.isConfiguratorActive ? "d-none" : "",
                ].join(" "),
                adornment: "bi-check-circle-fill",
              },
              disabled: !form.hasUnsubmittedChanges,
              label: "Save",
              onClick: onSubmit,
            })}

            {widget("components.atom.button", {
              classNames: {
                root: [
                  "btn-primary",
                  state.isConfiguratorActive ? "d-none" : "",
                ].join(" "),
                adornment: "bi bi-gear-fill",
              },
              label: "Configure project",
              onClick: () => configuratorToggle(true),
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

return ProjectConfigurator(props);
