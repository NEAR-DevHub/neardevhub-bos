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
/* INCLUDE: "core/lib/record" */
const pick = (object, subsetKeys) =>
  Object.fromEntries(
    Object.entries(object ?? {}).filter(([key, _]) => subsetKeys.includes(key))
  );
/* END_INCLUDE: "core/lib/record" */
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
};
/* END_INCLUDE: "core/adapter/dev-hub" */

const communityDefaults = {
  handle: "",
  name: "",
  description: "",
  tag: "",
  bio_markdown: "",
  admins: [context.accountId],
};

const CommunityEditorFrame = ({ handle }) => {
  const accessControlInfo = DevHub.get_access_control_info();

  if (accessControlInfo === null || communityData === null) {
    return <div>Loading...</div>;
  }

  State.init({
    activeSection: 0,
    data: null,
    isCommunityNew: true,
    isEditingAllowed: false,

    isSupervisionAllowed:
      accessControlInfo.members_list["team:moderators"]?.children?.includes?.(
        context.accountId
      ) ?? false,
  });

  if (typeof handle === "string" && state.data === null) {
    const data = DevHub.get_community({ handle });

    State.update((lastKnownState) => ({
      ...lastKnownState,
      data,
      isCommunityNew: false,
      isEditingAllowed: (data?.admins ?? []).includes(context.accountId),
    }));
  } else if (typeof handle !== "string" && state.data === null) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      data: communityDefaults,
      isCommunityNew: true,
      isEditingAllowed: true,
    }));
  }

  const onSubformSubmit = (partial) => {
    State.update((lastKnownState) => ({
      ...lastKnownState,

      data: {
        ...lastKnownState.data,

        ...Object.entries(partial).reduce(
          (update, [key, value]) => ({
            ...update,

            [key]:
              typeof value !== "string" || (value?.length ?? 0) > 0
                ? value
                : null,
          }),
          {}
        ),
      },
    }));
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
      {state.data !== null ? (
        <>
          {widget("feature.community-editor.branding-section", {
            data: state.data,
            isEditingAllowed: state.isEditingAllowed,
            onSubmit: onSubformSubmit,
          })}

          {widget("components.organism.form", {
            classNames: { submitAdornment: "bi-arrow-down-circle-fill" },
            data: state.data,
            heading: "Basic information",
            isEditorActive: state.isCommunityNew,
            isMutable: state.isEditingAllowed || state.isSupervisionAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: state.isCommunityNew ? "Next" : "Save",

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
            classNames: { submitAdornment: "bi-arrow-down-circle-fill" },
            data: state.data,
            heading: "About",
            isMutable: state.isEditingAllowed || state.isSupervisionAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: state.isCommunityNew ? "Next" : "Save",

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
            classNames: { submitAdornment: "bi-arrow-down-circle-fill" },
            data: state.data,
            heading: "Permissions",
            isMutable: state.isEditingAllowed || state.isSupervisionAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: state.isCommunityNew ? "Next" : "Save",

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
            classNames: { submitAdornment: "bi-arrow-down-circle-fill" },
            data: state.data?.wiki1 ?? {},
            heading: "Wiki page 1",
            isMutable: state.isEditingAllowed || state.isSupervisionAllowed,
            onSubmit: (value) => onSubformSubmit({ wiki1: value }),
            submitLabel: state.isCommunityNew ? "Next" : "Save",

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
            classNames: { submitAdornment: "bi-arrow-down-circle-fill" },
            data: state.data?.wiki2 ?? {},
            heading: "Wiki page 2",
            isMutable: state.isEditingAllowed || state.isSupervisionAllowed,
            onSubmit: (value) => onSubformSubmit({ wiki2: value }),
            submitLabel: state.isCommunityNew ? "Next" : "Save",

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

          {state.isSupervisionAllowed || state.isEditingAllowed ? (
            <div
              className="d-flex justify-content-center gap-4 p-4 w-100"
              style={{ maxWidth: 896 }}
            >
              {state.isSupervisionAllowed && !state.isCommunityNew
                ? widget("components.atom.button", {
                    classNames: {
                      root: "btn-lg btn-outline-danger border-none",
                    },

                    disabled: !state.isSupervisionAllowed,
                    label: "Delete community",
                    onClick: onDelete,
                  })
                : null}

              {widget("components.atom.button", {
                classNames: {
                  root: "btn-lg btn-success",
                  adornment: [
                    "bi",
                    state.isCommunityNew
                      ? "bi-rocket-takeoff-fill"
                      : "bi-cloud-arrow-up-fill",
                  ].join(" "),
                },

                disabled: !(state.isCommunityNew
                  ? true
                  : state.isSupervisionAllowed || state.isEditingAllowed),

                label: state.isCommunityNew ? "Launch" : "Save",
                onClick: onSubmit,
              })}
            </div>
          ) : null}
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

return CommunityEditorFrame(props);
