// TODO
context.accountId = "theori.near";

const { hasModerator, getFeaturedCommunities, getRootMembers } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!getFeaturedCommunities || !hasModerator || !getRootMembers || !href) {
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

const featuredCommunityList = getFeaturedCommunities();

const isDevHubModerator = hasModerator({
  account_id: context.accountId,
});

const rootMembers = getRootMembers();

const teamNames = Object.keys(rootMembers || {});

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
  Near.call(devHubAccountId, "set_featured_communities", {
    handles: Array.from(new Set(featuredCommunityHandles).add(handle).values()),
  });

const removeFeaturedCommunity = ({ handle: input }) =>
  Near.call(devHubAccountId, "set_featured_communities", {
    handles: featuredCommunityHandles.filter((handle) => handle !== input),
  });

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
`;

function createNewTeam({ teamName, label, editPost, useLabels, members }) {
  // TODO make multiple calls if necessary
  Near.call([
    {
      contractName: nearDevGovGigsContractAccountId,
      methodName: "add_member",
      args: {
        member: `team:${teamName}`,
        metadata: {
          member_metadata_version: "V0",
          description: "",
          permissions: {
            [label]: [editPost && "edit-post", useLabels && "use-labels"],
          },
          children: members,
          parents: [],
        },
      },
      deposit: Big(0).pow(21),
      gas: Big(10).pow(12).mul(100),
    },
  ]);
}

const [createTeam, setCreateTeam] = useState(false);

return (
  <div className="d-flex flex-column gap-4 p-4">
    {featuredCommunityList ? (
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
    ) : (
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.atom.Spinner"}
        props={{
          isHidden: false,
        }}
      />
    )}
    {!createTeam && (
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"}
        props={{
          onClick: () => setCreateTeam(true),
          title: "Create team",
        }}
      />
    )}
    {createTeam && (
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.team.Configurator"}
        props={{
          onCancel: () => setCreateTeam(false),
          onSubmit: () => createNewTeam(),
        }}
      />
    )}
    {(teamNames || []).map((teamName) => {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.entity.team.TeamInfo"}
          props={{
            teamName,
          }}
        />
      );
    })}
  </div>
);
