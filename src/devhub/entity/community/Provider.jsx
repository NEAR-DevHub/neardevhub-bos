const { handle, Children } = props;

const {
  getAccountCommunityPermissions,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  getCommunity,
  setCommunityAddons,
} = VM.require("${REPL_DEVHUB}/widget/core.adapter.devhub-contract");

if (
  !getCommunity ||
  !getAccountCommunityPermissions ||
  !createCommunity ||
  !updateCommunity ||
  !deleteCommunity ||
  !setCommunityAddons
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

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const community = getCommunity({ handle });

const permissions = getAccountCommunityPermissions({
  account_id: context.accountId,
  community_handle: handle,
}) || {
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

function handleUpdateCommunity(v) {
  updateCommunity(v);
}

return (
  <Children
    permissions={permissions}
    community={community}
    setCommunityAddons={setCommunityAddons}
    createCommunity={createCommunity}
    updateCommunity={handleUpdateCommunity}
    deleteCommunity={deleteCommunity}
  />
);
