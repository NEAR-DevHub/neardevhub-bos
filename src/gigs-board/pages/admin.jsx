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

const AdministrationSettings = {
  communities: {
    maxFeatured: 4,
  },
};

const CommunityFeaturingSchema = {
  handle: {
    label: "Community handle",
    inputProps: { min: 3, max: 40, required: true },
  },
};

const AdminPage = () => {
  const featuredCommunities = DevHub.useQuery("featured_communities"),
    featuredCommunityList = featuredCommunities.data ?? [];

  const featuredCommunityHandles = featuredCommunityList.map(
    ({ handle }) => handle
  );

  const addFeaturedCommunity = ({ handle }) =>
    Near.call(devHubAccountId, "set_featured_communities", {
      handles: new Set(featuredCommunityHandles).add(handle).values().toArray(),
    });

  const removeFeaturedCommunity = ({ handle: input }) =>
    Near.call(devHubAccountId, "set_featured_communities", {
      handles: featuredCommunityHandles.filter((handle) => handle !== input),
    });

  return widget("components.template.app-layout", {
    path: [{ label: "Administration", pageId: "admin" }],
    viewer: Viewer,

    children: (
      <div className="d-flex flex-column gap-4 p-4">
        {widget("components.atom.spinner", {
          isHidden: !featuredCommunities.isLoading,
        })}

        {widget("components.molecule.tile", {
          heading: "Featured communities",
          isHidden: featuredCommunities.isLoading,
          noBorder: true,
          noFrame: true,

          children: (
            <>
              <div className="d-flex flex-wrap align-content-start gap-4">
                {featuredCommunityList.map((community) =>
                  widget("entity.community.card", {
                    actions: (
                      <div className="d-flex justify-content-center align-items-center">
                        {widget("components.molecule.button", {
                          classNames: { root: "btn-outline-danger vertical" },
                          icon: { type: "bootstrap_icon", variant: "bi-x-lg" },
                          isHidden: !Viewer.role.isDevHubModerator,
                          title: "Remove from featured",
                          onClick: () => removeFeaturedCommunity(community),
                        })}
                      </div>
                    ),

                    format: "small",
                    metadata: community,
                    target: "_blank",
                  })
                )}
              </div>

              {widget("components.organism.configurator", {
                heading: "Add featured community",
                isActive: true,

                isHidden: !(
                  Viewer.role.isDevHubModerator &&
                  featuredCommunityList.length <
                    AdministrationSettings.communities.maxFeatured
                ),

                isUnlocked: Viewer.role.isDevHubModerator,
                schema: CommunityFeaturingSchema,
                onSubmit: addFeaturedCommunity,
              })}
            </>
          ),
        })}
      </div>
    ),
  });
};

return AdminPage(props);
