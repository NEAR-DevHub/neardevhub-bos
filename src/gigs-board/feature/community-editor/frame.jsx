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
/* INCLUDE: "core/lib/hashmap" */
const HashMap = {
  isEqual: (input1, input2) =>
    JSON.stringify(HashMap.toOrdered(input1)) ===
    JSON.stringify(HashMap.toOrdered(input2)),

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
};
/* END_INCLUDE: "core/lib/hashmap" */
/* INCLUDE: "core/adapter/dev-hub" */
const contractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  edit_community_github: ({ handle, github }) =>
    Near.call(contractAccountId, "edit_community_github", { handle, github }) ??
    null,

  get_access_control_info: () =>
    Near.view(contractAccountId, "get_access_control_info") ?? null,

  get_all_authors: () =>
    Near.view(contractAccountId, "get_all_authors") ?? null,

  get_all_communities: () =>
    Near.view(contractAccountId, "get_all_communities") ?? null,

  get_all_labels: () => Near.view(contractAccountId, "get_all_labels") ?? null,

  get_community: ({ handle }) =>
    Near.view(contractAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(contractAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(contractAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(contractAccountId, "get_root_members") ?? null,

  useQuery: ({ name, params, initialData }) => {
    const initialState = { data: null, error: null, isLoading: true };

    return useCache(
      () =>
        Near.asyncView(contractAccountId, name, params ?? {})
          .then((response) => ({
            ...initialState,

            data:
              (initialData ?? null) !== null
                ? { ...initialData, ...(response ?? {}) }
                : response ?? null,

            error: null,
            isLoading: false,
          }))
          .catch((error) => ({
            data: initialData ?? initialState.data,
            error: props?.error ?? error,
            isLoading: false,
          })),

      name,
      { subscribe: true }
    );
  },
};
/* END_INCLUDE: "core/adapter/dev-hub" */

const CommunityEditorFrame = ({ handle }) => {
  const accessControlInfo = DevHub.get_access_control_info();

  if (accessControlInfo === null) {
    return <div>Loading...</div>;
  }

  const isSupervisionAllowed =
    accessControlInfo.members_list["team:moderators"]?.children?.includes?.(
      context.accountId
    ) ?? false;

  const communityState = DevHub.useQuery({
    name: "get_community",
    params: { handle },

    initialData: {
      handle: null,
      admins: [context.accountId],
      name: "",
      description: "",
      bio_markdown: null,
      logo_url: null,
      banner_url: null,
      tag: "",
      github_handle: null,
      telegram_handle: null,
      twitter_handle: null,
      website_url: null,
      github: null,
      sponsorship: null,
      wiki1: null,
      wiki2: null,
    },
  });

  State.init({
    data: null,
    hasUncommittedChanges: false,
    isCommunityNew: true,
    isEditingAllowed: false,
  });

  const isSynced = HashMap.isEqual(communityState.data, state.data ?? {});

  if (state.data === null) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      data: { ...communityState.data },
      hasUncommittedChanges: false,
      isCommunityNew: typeof handle !== "string",

      isEditingAllowed:
        typeof handle !== "string" ||
        (communityState.data?.admins ?? []).includes(context.accountId) ||
        isSupervisionAllowed,
    }));
  } else if (
    typeof handle === "string" &&
    !state.hasUncommittedChanges &&
    !isSynced
  ) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      data: { ...communityState.data },
      hasUncommittedChanges: false,
      isCommunityNew: false,
    }));
  }

  console.log({ communityData: communityState.data, editorState: state.data });

  console.log({
    isSynced,
    hasUncommittedChanges: state.hasUncommittedChanges,
    isCommunityNew: state.isCommunityNew,
  });

  const onSubformSubmit = (partial) => {
    State.update((lastKnownState) => {
      const dataUpdate = Object.entries(partial).reduce(
        (update, [key, value]) => ({
          ...update,

          [key]:
            typeof value !== "string" || (value?.length ?? 0) > 0
              ? value ?? null
              : null,
        }),
        {}
      );

      const data = {
        ...lastKnownState.data,
        ...dataUpdate,
      };

      return {
        ...lastKnownState,
        data,

        hasUncommittedChanges:
          JSON.stringify(HashMap.toOrdered(communityState.data)) !==
          JSON.stringify(HashMap.toOrdered(data)),
      };
    });
  };

  const onSubmit = () =>
    Near.call(
      nearDevGovGigsContractAccountId,
      state.isCommunityNew ? "add_community" : "edit_community",

      {
        handle: state.isCommunityNew ? state.data.handle : handle,

        community: {
          ...state.data,

          admins: state.data.admins.filter(
            (maybeAccountId) => maybeAccountId.length > 0
          ),
        },
      }
    );

  const onDelete = () =>
    Near.call(nearDevGovGigsContractAccountId, "delete_community", { handle });

  return (
    <div className="d-flex flex-column align-items-center gap-4 p-4">
      {communityState.data.handle !== null || state.isCommunityNew ? (
        <>
          {widget("feature.community-editor.branding-section", {
            description: state.data?.description,
            initialData: state.data,
            isEditingAllowed: state.isEditingAllowed,
            name: state.data?.name,
            onSubmit: onSubformSubmit,
          })}

          {widget("components.organism.form", {
            classNames: {
              submit: "btn-primary",
              submitAdornment: "bi-check-circle-fill",
            },

            initialData: state.data,
            heading: "Basic information",
            isEditorActive: state.isCommunityNew,
            isMutable: state.isEditingAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: "Accept",

            schema: {
              name: {
                inputProps: {
                  min: 2,
                  max: 30,
                  placeholder: "Community name.",
                  required: true,
                },

                label: "Name",
                order: 1,
              },

              description: {
                inputProps: {
                  min: 2,
                  max: 60,

                  placeholder:
                    "Describe your community in one short sentence that will appear in the discovery communities page.",

                  required: true,
                },

                label: "Description",
                order: 2,
              },

              handle: {
                inputProps: {
                  min: 2,
                  max: 40,

                  placeholder:
                    "Choose unique URL handle for your community by adding letters and numbers. Example: zero-knowledge.",

                  required: true,
                },

                label: "Handle",
                order: 3,
              },

              tag: {
                inputProps: {
                  min: 2,
                  max: 20,

                  placeholder:
                    "Choose one tag for your community. Any posts with this tag will show up in your community feed.",

                  required: true,
                },

                label: "Tag",
                order: 4,
              },
            },
          })}

          {widget("components.organism.form", {
            classNames: {
              submit: "btn-primary",
              submitAdornment: "bi-check-circle-fill",
            },

            initialData: state.data,
            heading: "About",
            isMutable: state.isEditingAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: "Accept",

            schema: {
              bio_markdown: {
                format: "markdown",

                inputProps: {
                  min: 2,
                  max: 200,

                  placeholder:
                    "Tell more about your community. This will appear in the About section of your community’s homepage.",
                },

                label: "Bio",
                multiline: true,
                order: 1,
              },

              twitter_handle: {
                inputProps: { min: 2, max: 60 },
                label: "Twitter handle",
                order: 2,
              },

              github_handle: {
                inputProps: { min: 2, max: 60 },
                label: "Github organization handle",
                order: 3,
              },

              telegram_handle: {
                inputProps: { min: 2, max: 60 },
                label: "Telegram handle",
                order: 4,
              },

              website_url: {
                inputProps: { min: 2, max: 60 },
                label: "Website",
                order: 5,
              },
            },
          })}

          {widget("components.organism.form", {
            classNames: {
              submit: "btn-primary",
              submitAdornment: "bi-check-circle-fill",
            },

            initialData: state.data,
            heading: "Permissions",
            isMutable: state.isEditingAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: "Accept",

            schema: {
              admins: {
                format: "comma-separated",
                inputProps: { required: true },
                label: "Admins",
                order: 1,
              },
            },
          })}

          {widget("components.organism.form", {
            classNames: {
              submit: "btn-primary",
              submitAdornment: "bi-check-circle-fill",
            },

            initialData: state.data?.wiki1 ?? {},
            heading: "Wiki page 1",
            isMutable: state.isEditingAllowed,
            onSubmit: (value) => onSubformSubmit({ wiki1: value }),
            submitLabel: "Accept",

            schema: {
              name: {
                label: "Name",
                order: 1,
              },

              content_markdown: {
                format: "markdown",
                label: "Content",
                multiline: true,
                order: 2,
              },
            },
          })}

          {widget("components.organism.form", {
            classNames: {
              submit: "btn-primary",
              submitAdornment: "bi-check-circle-fill",
            },

            initialData: state.data?.wiki2 ?? {},
            heading: "Wiki page 2",
            isMutable: state.isEditingAllowed,
            onSubmit: (value) => onSubformSubmit({ wiki2: value }),
            submitLabel: "Accept",

            schema: {
              name: {
                label: "Name",
                order: 1,
              },

              content_markdown: {
                format: "markdown",
                label: "Content",
                multiline: true,
                order: 2,
              },
            },
          })}

          {!state.isCommunityNew && isSupervisionAllowed ? (
            <div
              className="d-flex justify-content-center gap-4 p-4 w-100"
              style={{ maxWidth: 896 }}
            >
              {widget("components.atom.button", {
                classNames: {
                  root: "btn-lg btn-outline-danger border-none",
                },

                label: "Delete community",
                onClick: onDelete,
              })}
            </div>
          ) : null}

          {state.isEditingAllowed && state.hasUncommittedChanges && (
            <div
              className="position-fixed end-0 bottom-0 bg-transparent pe-4 pb-4"
              style={{
                borderTopLeftRadius: "100%",
              }}
            >
              {widget("components.atom.button", {
                classNames: {
                  root: "btn-lg btn-success",

                  adornment: `bi ${
                    state.isCommunityNew
                      ? "bi-rocket-takeoff-fill"
                      : "bi-exclamation-triangle-fill"
                  }`,

                  adornmentHover: `bi ${
                    state.isCommunityNew
                      ? "bi-rocket-takeoff-fill"
                      : "bi-sign-merge-right-fill"
                  }`,
                },

                isCollapsible: true,
                label: state.isCommunityNew ? "Launch" : "Save",
                onClick: onSubmit,
              })}
            </div>
          )}
        </>
      ) : (
        <div
          className="d-flex flex-column justify-content-center align-items-center w-100"
          style={{ height: 384 }}
        >
          <h2 className="h2">Community doesn't exist.</h2>
        </div>
      )}
    </div>
  );
};

return <CommunityEditorFrame {...props} />;
