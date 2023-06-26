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
            ...initialState,
            error: props?.error ?? error,
            isLoading: false,
          })),

      JSON.stringify({ name, params }),
      { subscribe: true }
    );
  },
};
/* END_INCLUDE: "core/adapter/dev-hub" */

if (!props.handle) {
  return (
    <div class="alert alert-danger" role="alert">
      Error: community handle not found in URL parameters
    </div>
  );
}

const communityData = DevHub.get_community({ handle: props.handle });

if (communityData === null) {
  return <div>Loading...</div>;
}

const postIdsWithTags = (tags) => {
  const ids = tags
    .map(
      (tag) =>
        Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
          label: tag,
        }) ?? []
    )
    .map((ids) => new Set(ids))
    .reduce((previous, current) => {
      let res = new Set();
      for (let id of current) {
        if (previous.has(id)) {
          res.add(id);
        }
      }
      return res;
    });

  return [...ids].reverse();
};

const sponsorshipRequiredTags = ["funding", communityData.tag];
const sponsorshipRequiredPosts = postIdsWithTags(sponsorshipRequiredTags);

const Sponsorship = (
  <div>
    <div class="row mb-2 justify-content-center">
      <div class="col-md-auto">
        <small class="text-muted">
          Post Type: <b>Sponsorship</b>
        </small>
      </div>
      <div class="col-md-auto">
        <small class="text-muted">
          Required tags:
          {sponsorshipRequiredTags.map((tag) => (
            <a href={href("Feed", { tag })} key={tag}>
              <span class="badge text-bg-primary me-1">{tag}</span>
            </a>
          ))}
        </small>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body border-secondary">
            <h6 class="card-title">
              Sponsored Projects ({sponsorshipRequiredPosts.length})
            </h6>
            <div class="row">
              {sponsorshipRequiredPosts.map((postId) => (
                <div class="col-3">
                  {widget("entity.post.CompactPost", { id: postId }, postId)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

return widget("components.template.community-page", {
  handle: props.handle,
  title: "Sponsorship",
  children: Sponsorship,
});
