const { useQuery, hasModerator, setFeaturedCommunities } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!useQuery || !hasModerator || !href) {
  return <p>Loading modules...</p>;
}

const AdministrationSettings = {
  communities: {
    maxFeatured: 4,
  },
};

const CommunityFeaturingSchema = {
  handle: {
    label: "Community handle",

    hints: {
      disabled: `You can only add ${AdministrationSettings.communities.maxFeatured} communities at a time`,
    },

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

const addFeaturedCommunity = ({ handle }) =>
  setFeaturedCommunities({
    handles: Array.from(new Set(featuredCommunityHandles).add(handle).values()),
  });

const removeFeaturedCommunity = ({ handle: input }) =>
  setFeaturedCommunities({
    handles: featuredCommunityHandles.filter((handle) => handle !== input),
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
        <div className="d-flex flex-wrap align-content-start gap-4">
          {featuredCommunityList.map((community) => (
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.entity.community.Card"}
              props={{
                actions: (
                  <div className="d-flex justify-content-center align-items-center">
                    <Widget
                      src={
                        "${REPL_DEVHUB}/widget/devhub.components.molecule.Button"
                      }
                      props={{
                        classNames: {
                          root: "btn-outline-danger vertical",
                        },
                        icon: {
                          type: "bootstrap_icon",
                          variant: "bi-x-lg",
                        },
                        title: "Remove from featured",
                        onClick: () => removeFeaturedCommunity(community),
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

        <Tile>
          <Widget
            // TODO: LEGACY.
            src={
              "${REPL_DEVHUB}/widget/gigs-board.components.organism.configurator"
            }
            props={{
              heading: "Add featured community",
              isActive: true,

              isUnlocked:
                featuredCommunityList.length <
                AdministrationSettings.communities.maxFeatured,

              schema: CommunityFeaturingSchema,
              onSubmit: addFeaturedCommunity,
            }}
          />
        </Tile>
      </>
    )}
  </div>
);
