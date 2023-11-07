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

const CTA = styled.button`
  all: unset;

  color: #f4f4f4;

  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */

  border-radius: 4px;
  background: #04a46e;

  display: flex;
  padding: 14px 16px;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #555555;
  }
`;

const CardGrid = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;

  @media screen and (max-width: 1000px) {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
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

          <div className="d-flex flex-column-reverse flex-lg-row gap-3 justify-content-between align-items-center">
            <div className="d-flex flex-column flex-lg-row col-12 col-md-6 mt-3 mt-lg-0 align-items-center gap-4 col-lg-6">
              <input
                type="text"
                placeholder="🔍 Search Communities"
                className="form-control w-100"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <select
                class="form-select"
                onChange={(e) => setSort(e.target.value)}
              >
                <option selected value="">
                  Sort
                </option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
            {context.accountId && (
              <div className="d-flex flex-column justify-content-center">
                <CTA onClick={() => setShowSpawner(!showSpawner)}>
                  <i className="bi bi-plus-circle-fill me-1"></i> Create
                  Community
                </CTA>
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
