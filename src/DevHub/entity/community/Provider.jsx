const {
  handle,
  Children,
  nearDevGovGigsWidgetsAccountId,
  nearDevGovGigsContractAccountId,
} = props;

const {
  useQuery,
  getAccountCommunityPermissions,
  getAvailableAddons,
  getCommunityAddonConfigs,
  createCommunity,
  updateCommunity,
  deleteCommunity,
} = VM.require(
  `${nearDevGovGigsWidgetsAccountId}/widget/DevHub.modules.contract-sdk`
);

if (
  !useQuery ||
  !getAccountCommunityPermissions ||
  !getAvailableAddons ||
  !getCommunityAddonConfigs ||
  !createCommunity ||
  !updateCommunity ||
  !deleteCommunity
) {
  return <p>Loading modules...</p>;
}

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const [community, setCommunity] = useState(null);

// TODO: This doesn't work as expected, it does not catch the error
Near.asyncView(nearDevGovGigsContractAccountId, "get_community", {
  handle,
})
  .then((response) => {
    setCommunity(response ?? null);
    setIsLoading(false);
  })
  .catch((error) => {
    setError(props?.error ?? error);
    setIsLoading(false);
  });

const permissions = getAccountCommunityPermissions(
  nearDevGovGigsContractAccountId,
  {
    account_id: context.accountId,
    community_handle: handle,
  }
) || {
  can_configure: false,
  can_delete: false,
};

if (isLoading) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>Loading...</h2>
    </CenteredMessage>
  );
} else if (!community) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>{`Community with handle "${handle}" not found.`}</h2>
    </CenteredMessage>
  );
}

const availableAddons =
  getAvailableAddons(nearDevGovGigsContractAccountId) || [];
const communityAddonConfigs =
  getCommunityAddonConfigs(nearDevGovGigsContractAccountId, { handle }) || [];

return (
  <Children
    permissions={permissions}
    community={community}
    availableAddons={availableAddons}
    communityAddonConfigs={communityAddonConfigs}
    createCommunity={createCommunity}
    updateCommunity={updateCommunity}
    deleteCommunity={deleteCommunity}
  />
);
