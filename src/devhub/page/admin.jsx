const { useQuery, hasModerator, setFeaturedCommunities } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!useQuery || !hasModerator || !href) {
  return <p>Loading modules...</p>;
}

const AdministrationSettings = {
  communities: {
    maxFeatured: 5,
  },
};

const CommunityFeaturingSchema = {
  handle: {
    label: "Pinned handle",
    inputProps: { min: 3, max: 40, required: true },
  },
};

const featuredCommunities = useQuery("featured_communities");
const featuredCommunityList = featuredCommunities.data ?? [];
const isDevHubModerator = hasModerator({
  account_id: context.accountId,
});

const noPermissionBanner = (
  <div
    className="d-flex flex-column justify-content-center align-items-center"
    style={{ height: 384 }}
  >
    <h2 className="alert alert-danger">
      Your account does not have administration permissions.
    </h2>
  </div>
);

if (!isDevHubModerator) {
  return noPermissionBanner;
}

const featuredCommunityHandles = featuredCommunityList.map(
  ({ handle }) => handle
);

const replaceFeaturedCommunity =
  ({ handle: targetHandle }) =>
  ({ handle: replacementHandle }) =>
    setFeaturedCommunities({
      handles: featuredCommunityHandles.map((handle) =>
        handle === targetHandle ? replacementHandle : handle
      ),
    });

return (
  <div className="d-flex flex-column gap-4 p-4">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.components.atom.Spinner"}
      props={{
        isHidden: !featuredCommunities.isLoading,
      }}
    />

    {!featuredCommunities.isLoading && (
      <>
        <h3>Featured communities</h3>

        <div className="d-flex flex-wrap align-content-start gap-4">
          {featuredCommunityList.map((community) => (
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.community.Card"}
              props={{
                actions: (
                  <div className="d-flex justify-content-center align-items-center">
                    <Widget
                      src={
                        "${REPL_DEVHUB}/widget/devhub.components.organism.Configurator"
                      }
                      props={{
                        externalState: community,
                        isActive: true,
                        isUnlocked: true,
                        cancelLabel: "Reset",
                        onSubmit: replaceFeaturedCommunity(community),
                        submitLabel: "Replace",
                        schema: CommunityFeaturingSchema,
                      }}
                    />
                  </div>
                ),

                format: "small",
                metadata: community,
                target: "_blank",
              }}
            />
          ))}
        </div>
      </>
    )}
  </div>
);
