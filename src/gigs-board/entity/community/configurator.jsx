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
/* INCLUDE: "entity/viewer" */
const Viewer = {
  communityPermissions: ({ handle }) =>
    DevHub.get_account_community_permissions({
      account_id: context.accountId,
      community_handle: handle,
    }) ?? {
      can_configure: false,
      can_delete: false,
    },

  role: {
    isDevHubModerator:
      DevHub.has_moderator({ account_id: context.accountId }) ?? false,
  },
};
/* END_INCLUDE: "entity/viewer" */

const communityAccessControlFormatter = ({ admins, ...otherFields }) => ({
  ...otherFields,
  admins: admins.filter((string) => string.length > 0),
});

const CommunityInformationSchema = {
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

  tag: {
    inputProps: {
      min: 2,
      max: 30,

      placeholder:
        "Any posts with this tag will show up in your community feed.",

      required: true,
    },

    label: "Tag",
    order: 4,
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
};

const CommunityAboutSchema = {
  bio_markdown: {
    format: "markdown",

    inputProps: {
      min: 3,
      max: 200,

      placeholder:
        "Tell people about your community. This will appear on your community’s homepage.",

      resize: "none",
    },

    label: "Bio",
    multiline: true,
    order: 1,
  },

  twitter_handle: {
    inputProps: { prefix: "https://twitter.com/", min: 2, max: 60 },
    label: "Twitter",
    order: 2,
  },

  github_handle: {
    inputProps: { prefix: "https://github.com/", min: 2, max: 60 },
    label: "Github",
    order: 3,
  },

  telegram_handle: {
    inputProps: { prefix: "https://t.me/", min: 2, max: 60 },
    format: "comma-separated",
    label: "Telegram",
    order: 4,
  },

  website_url: {
    inputProps: { prefix: "https://", min: 2, max: 60 },
    label: "Website",
    order: 5,
  },
};

const CommunityAccessControlSchema = {
  admins: {
    format: "comma-separated",
    inputProps: { required: true },
    label: "Admins",
    order: 1,
  },
};

const CommunityWikiPageSchema = {
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
};

const CommunityConfigurator = ({ handle, link }) => {
  State.init({
    communityData: null,
    hasUnsavedChanges: false,
  });

  const community = DevHub.useQuery("community", { handle }),
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
    DevHub.update_community({ handle, community: state.communityData });

  const onDelete = () => DevHub.delete_community({ handle });

  return community.isLoading ? (
    <div>Loading...</div>
  ) : (
    <div
      className="d-flex flex-column align-items-center gap-4 w-100"
      style={{ maxWidth: 960 }}
    >
      {community.data === null ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center w-100"
          style={{ height: 384 }}
        >
          <h2 className="h2">{`Community with handle "${handle}" not found.`}</h2>
        </div>
      ) : (
        <>
          {widget("entity.community.branding-configurator", {
            isUnlocked: permissions.can_configure,
            link,
            onSubmit: sectionSubmit,
            values: state.communityData,
          })}

          {widget("components.organism.configurator", {
            heading: "Community information",
            externalState: state.communityData,
            fullWidth: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: sectionSubmit,
            schema: CommunityInformationSchema,
            submitLabel: "Accept",
          })}

          {widget("components.organism.configurator", {
            heading: "About",
            externalState: state.communityData,
            fullWidth: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: sectionSubmit,
            schema: CommunityAboutSchema,
            submitLabel: "Accept",
          })}

          {widget("components.organism.configurator", {
            heading: "Access control",
            externalState: state.communityData,
            fullWidth: true,
            formatter: communityAccessControlFormatter,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: sectionSubmit,
            schema: CommunityAccessControlSchema,
            submitLabel: "Accept",
          })}

          {widget("components.organism.configurator", {
            heading: "Wiki page 1",
            externalState: state.communityData?.wiki1,
            fullWidth: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: (value) => sectionSubmit({ wiki1: value }),
            submitLabel: "Accept",
            schema: CommunityWikiPageSchema,
          })}

          {widget("components.organism.configurator", {
            heading: "Wiki page 2",
            externalState: state.communityData?.wiki2,
            fullWidth: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onSubmit: (value) => sectionSubmit({ wiki2: value }),
            submitLabel: "Accept",
            schema: CommunityWikiPageSchema,
          })}

          {permissions.can_delete ? (
            <div
              className="d-flex justify-content-center gap-4 p-4 w-100"
              style={{ maxWidth: 896 }}
            >
              {widget("components.molecule.button", {
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
              {widget("components.molecule.button", {
                classNames: { root: "btn-lg btn-success" },
                icon: { type: "svg_icon", variant: "floppy_drive" },
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
