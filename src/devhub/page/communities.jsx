const { getAllCommunitiesMetadata, createCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

if (!getAllCommunitiesMetadata || !createCommunity) {
  return <p>Loading modules...</p>;
}

const onCommunitySubmit = (inputs) =>
  createCommunity({
    inputs: {
      ...inputs,

      bio_markdown: [
        "This is a sample text about your community.",
        "You can change it on the community configuration page.",
      ].join("\n"),

      logo_url:
        "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu",

      banner_url:
        "https://ipfs.near.social/ipfs/bafkreic4xgorjt6ha5z4s5e3hscjqrowe5ahd7hlfc5p4hb6kdfp6prgy4",
    },
  });

const [showSpawner, setShowSpawner] = useState(false);

const [searchKey, setSearchKey] = useState("");
const [sort, setSort] = useState("");

const communitiesMetadata = getAllCommunitiesMetadata();

if (!communitiesMetadata) {
  return <p>Loading...</p>;
}

const SortedAndFiltered = (searchKey, sortBy) => {
  let communities = (communitiesMetadata ?? []).reverse();

  let filtered = [...communities];
  if (searchKey !== "") {
    filtered = communities.filter((community) =>
      community.name.toLowerCase().includes(searchKey.toLowerCase())
    );
  }

  let sortedCommunities = [...filtered];
  if (sortBy !== "") {
    sortedCommunities.sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    if (sortBy === "z-a") {
      sortedCommunities.reverse();
    }
  }

  return sortedCommunities;
};

const CardGrid = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;

  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;

const StyledDropdown = styled.div`
  button {
    text-align: left;

    &::after {
      position: absolute;
      right: 8px;
      top: 45%;
      transform: translateX(-50%);
    }
  }
`;

return (
  <div className="w-100">
    <Widget src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`} />
    <div style={{ background: "#f4f4f4" }}>
      <div
        className="d-flex justify-content-between p-4"
        style={{ backgroundColor: "" }}
      >
        <div className="d-flex flex-column gap-3 w-100">
          <h1
            className="m-0 fs-4"
            style={{ color: "#555555", fontSize: "1.5rem" }}
          >
            Communities
          </h1>

          <div className="d-flex col-12 flex-column flex-sm-row gap-4 justify-content-between align-items-center">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 col-12 col-sm-6">
              <InputContainer className="border rounded-2">
                <div className="position-absolute d-flex ps-3 flex-column h-100 justify-center">
                  <i class="bi bi-search m-auto"></i>
                </div>
                <input
                  type="search"
                  className="ps-5 form-control border border-0"
                  value={searchKey ?? ""}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder={props.placeholder ?? `Search by name`}
                />
              </InputContainer>
              <div class="dropdown w-100">
                <StyledDropdown>
                  <button
                    class="btn dropdown-toggle border rounded-2 bg-white w-100"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Sort: {sort?.toUpperCase() || "Latest"}
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start px-2 shadow">
                    <li
                      onClick={() => setSort("")}
                      class="dropdown-item link-underline link-underline-opacity-0"
                    >
                      Latest
                    </li>
                    <li
                      onClick={() => setSort("a-z")}
                      class="dropdown-item link-underline link-underline-opacity-0"
                    >
                      A-Z
                    </li>
                    <li
                      onClick={() => setSort("z-a")}
                      class="dropdown-item link-underline link-underline-opacity-0"
                    >
                      Z-A
                    </li>
                  </ul>
                </StyledDropdown>
              </div>
            </div>
            {context.accountId && (
              <div className="d-flex flex-column justify-content-center align-self-end">
                <Widget
                  src={
                    "${REPL_DEVHUB}/widget/devhub.components.molecule.CommunityControl"
                  }
                  props={{
                    title: "Community",
                    onClick: () => setShowSpawner(!showSpawner),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap align-content-start gap-4 p-4 w-100 h-100">
        {showSpawner && (
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.entity.community.Spawner"
            props={{
              data: null,
              onSubmit: onCommunitySubmit,
              onCancel: () => setShowSpawner(false),
            }}
          />
        )}
        <CardGrid>
          {searchKey === "" && sort === ""
            ? (communitiesMetadata ?? []).reverse().map((communityMetadata) => (
                <Widget
                  src="${REPL_DEVHUB}/widget/devhub.entity.community.Card"
                  props={{
                    format: "small",
                    isBannerEnabled: false,
                    metadata: communityMetadata,
                  }}
                />
              ))
            : SortedAndFiltered(searchKey, sort).map((communityMetadata) => (
                <Widget
                  src="${REPL_DEVHUB}/widget/devhub.entity.community.Card"
                  props={{
                    format: "small",
                    isBannerEnabled: false,
                    metadata: communityMetadata,
                  }}
                />
              ))}
        </CardGrid>
      </div>
    </div>
  </div>
);
