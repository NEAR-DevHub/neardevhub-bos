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
/* INCLUDE: "core/adapter/dev-hub" */
const devHubAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  has_moderator: ({ account_id }) =>
    Near.view(devHubAccountId, "has_moderator", { account_id }) ?? null,

  edit_community: ({ handle, community }) =>
    Near.call(devHubAccountId, "edit_community", { handle, community }),

  delete_community: ({ handle }) =>
    Near.call(devHubAccountId, "delete_community", { handle }),

  edit_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "edit_community_github", { handle, github }) ??
    null,

  edit_community_board: ({ handle, board }) =>
    Near.call(devHubAccountId, "edit_community_board", { handle, board }) ??
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
const Viewer = {
  can: {
    editCommunity: (communityData) =>
      Struct.typeMatch(communityData) &&
      (communityData.admins.includes(context.accountId) ||
        Viewer.role.isDevHubModerator),
  },

  communityPermissions: ({ handle }) =>
    DevHub.useQuery("account_community_permissions", {
      account_id: context.account_id,
      community_handle: handle,
    }).data ?? {
      can_configure: false,
      can_delete: false,
    },

  role: {
    isDevHubModerator:
      DevHub.has_moderator({ account_id: context.accountId }) ?? false,
  },
};
/* END_INCLUDE: "entity/viewer" */

const communityMetadataFormatter = ({ admins, ...otherMetadata }) => ({
  ...otherMetadata,
  admins: (array) => array.filter((string) => string.length > 0),
});

const CommunityMetadataSchema = {
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
        "Describe your community in one short sentence that will appear in the communities discovery page.",

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
        "Choose unique URL handle for your community. Example: zero-knowledge.",

      required: true,
    },

    label: "URL handle",
    order: 3,
  },

  tag: {
    inputProps: {
      min: 2,
      max: 20,

      placeholder:
        "Any posts with this tag will show up in your community feed.",

      required: true,
    },

    label: "Tag",
    order: 4,
  },

  bio_markdown: {
    format: "markdown",

    inputProps: {
      min: 3,
      max: 200,

      placeholder:
        "Tell more about your community. This will appear on your community’s homepage.",
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
    format: "comma-separated",
    label: "Telegram handles",
    order: 4,
  },

  website_url: {
    inputProps: { min: 2, max: 60 },
    label: "Website",
    order: 5,
  },

  admins: {
    format: "comma-separated",
    inputProps: { required: true },
    label: "Admins",
    order: 1,
  },
};

const CommunityConfigurator = ({ handle, link }) => {
  State.init({
    communityData: null,
    hasUnsavedChanges: false,
  });

  const community = DevHub.useQuery({ name: "community", params: { handle } }),
    permissions = Viewer.communityPermissions({ handle }),
    isSynced = Struct.isEqual(state.communityData, community.data);

  if (!state.hasUnsavedChanges && !community.isLoading && !isSynced) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      communityData: community.data,
      hasUnsavedChanges: false,
    }));
  }

  const sectionSubmit = (sectionData) => {
    State.update((lastKnownState) => {
      const communityDataUpdate = {
        ...Object.entries(sectionData).reduce(
          (update, [propertyKey, propertyValue]) => ({
            ...update,

            [propertyKey]:
              typeof propertyValue !== "string" ||
              (propertyValue?.length ?? 0) > 0
                ? propertyValue ?? null
                : null,
          }),

          lastKnownState.communityData
        ),
      };

      return {
        ...lastKnownState,
        communityData: communityDataUpdate,
        hasUnsavedChanges: !Struct.isEqual(communityDataUpdate, community.data),
      };
    });
  };

  const changesSave = () =>
    DevHub.edit_community({ handle, community: state.communityData });

  const onDelete = () => DevHub.delete_community({ handle });

  return community.isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="d-flex flex-column align-items-center gap-4 p-4">
      {community.data === null ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center w-100"
          style={{ height: 384 }}
        >
          <h2 className="h2">{`Community with handle "${handle}" not found.`}</h2>
        </div>
      ) : (
        <>
          {widget("feature.community.branding-configurator", {
            isUnlocked: permissions.can_configure,
            link,
            onChangesSubmit: sectionSubmit,
            values: state.communityData,
          })}

          {widget("components.organism.configurator", {
            heading: "Basic information and settings",
            data: state.communityData,
            formatter: communityMetadataFormatter,
            isUnlocked: permissions.can_configure,
            onChangesSubmit: sectionSubmit,
            schema: CommunityMetadataSchema,
            submitLabel: "Accept",
          })}

          {widget("components.organism.configurator", {
            heading: "Wiki page 1",
            isUnlocked: permissions.can_configure,
            onChangesSubmit: onWiki1Submit,
            submitLabel: "Accept",
            data: state.communityData?.wiki1,

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

          {widget("components.organism.configurator", {
            heading: "Wiki page 2",
            isUnlocked: permissions.can_configure,
            onChangesSubmit: (value) => sectionSubmit({ wiki2: value }),
            submitLabel: "Accept",
            data: state.communityData?.wiki2,

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

          {permissions.can_delete ? (
            <div
              className="d-flex justify-content-center gap-4 p-4 w-100"
              style={{ maxWidth: 896 }}
            >
              {widget("components.atom.button", {
                classNames: { root: "btn-lg btn-outline-danger border-none" },
                label: "Delete community",
                onClick: onDelete,
              })}
            </div>
          ) : null}

          {permissions.can_configure && state.hasUnsavedChanges && (
            <div
              className="position-fixed end-0 bottom-0 bg-transparent pe-4 pb-4"
              style={{ borderTopLeftRadius: "100%" }}
            >
              {widget("components.atom.button", {
                adornment: widget("components.atom.icon", {
                  kind: "svg",
                  variant: "floppy-drive",
                }),

                classNames: { root: "btn-lg btn-success" },
                label: "Save",
                onClick: changesSave,
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

return CommunityConfigurator(props);
