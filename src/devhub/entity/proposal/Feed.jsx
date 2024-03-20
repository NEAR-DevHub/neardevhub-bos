const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

const Container = styled.div`
  .full-width-div {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }

  @media screen and (max-width: 768px) {
    font-size: 13px;
  }

  .text-sm {
    font-size: 13px;
  }

  .bg-grey {
    background-color: #f4f4f4;
  }

  .border-bottom {
    border-bottom: 1px solid grey;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .proposal-card {
    &:hover {
      background-color: #f4f4f4;
    }
  }

  .green-btn {
    background-color: #04a46e !important;
    border: none;
    color: white;

    &:active {
      color: white;
    }
  }

  @media screen and (max-width: 768px) {
    .green-btn {
      padding: 0.5rem 0.8rem !important;
      min-height: 32px;
    }
  }
`;

const Heading = styled.div`
  font-size: 24px;
  font-weight: 700;

  .text-normal {
    font-weight: normal !important;
  }

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const FeedItem = ({ proposal }) => {
  const { snapshot } = proposal;
  const accountId = proposal.author_id;
  const profile = Social.get(`${accountId}/profile/**`, "final");
  const blockHeight = parseInt(proposal.social_db_post_block_height);
  const item = {
    type: "social",
    path: `${REPL_DEVHUB_CONTRACT}/post/main`,
    blockHeight,
  };

  return (
    <a
      href={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: {
          page: "proposal",
          id: proposal.id,
        },
      })}
      onClick={(e) => e.stopPropagation()}
      style={{ textDecoration: "none" }}
    >
      <div className="proposal-card d-flex justify-content-between gap-2 text-muted cursor-pointer p-3">
        <div className="d-flex gap-4">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
            props={{
              accountId,
            }}
          />
          <div className="d-flex flex-column gap-2">
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <div className="h6 mb-0 text-black">{snapshot.name}</div>
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.CategoryTag"}
                props={{
                  category: snapshot.category,
                }}
              />
            </div>
            <div className="d-flex gap-2 align-items-center text-sm">
              <div>By {profile.name ?? accountId} ･ </div>
              <Widget
                src="${REPL_NEAR}/widget/TimeAgo"
                props={{
                  blockHeight,
                  blockTimestamp: snapshot.timestamp,
                }}
              />
            </div>
            <div className="d-flex gap-2 align-items-center">
              <Widget
                src="${REPL_DEVHUB}/widget/devhub.entity.proposal.LikeButton"
                props={{
                  item,
                  proposalId: proposal.id,
                  notifyAccountId: accountId,
                }}
              />
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.CommentIcon"}
                props={{
                  item,
                  showOverlay: false,
                  onClick: () => {},
                }}
              />
            </div>
          </div>
        </div>
        <div className="align-self-center">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.StatusTag"}
            props={{
              timelineStatus: snapshot.timeline.status,
            }}
          />
        </div>
      </div>
    </a>
  );
};

const FeedPage = () => {
  const proposals = Near.view("${REPL_DEVHUB_CONTRACT}", "get_proposals", {});

  return (
    <Container className="w-100 py-4 px-2 d-flex flex-column gap-3">
      <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center">
        <Heading>
          DevDAO Proposals{" "}
          <span className="text-muted text-normal"> ({proposals.length})</span>
        </Heading>
        {/* Filters aren't supported yet */}
        {/* <div className="d-flex gap-4 align-items-center">
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-input"
            }
            props={{}}
          />
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-sort"}
            props={{}}
          />
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-category"
            }
            props={{}}
          />
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-stage"
            }
            props={{}}
          />
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.feature.proposal-search.by-author"
            }
            props={{}}
          />
        </div> */}
        <div>
          <Link
            to={href({
              widgetSrc: "${REPL_DEVHUB}/widget/app",
              params: { page: "create-proposal" },
            })}
          >
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
              props={{
                label: (
                  <div className="d-flex gap-2 align-items-center">
                    <div>
                      <i class="bi bi-plus-circle-fill"></i>
                    </div>
                    New Proposal
                  </div>
                ),
                classNames: { root: "green-btn" },
              }}
            />
          </Link>
        </div>
      </div>
      <div style={{ minHeight: "50vh" }}>
        {!Array.isArray(proposals) ? (
          <div className="d-flex justify-content-center align-items-center w-100">
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner"}
            />
          </div>
        ) : (
          <div className="card rounded-0 mt-4 py-3 full-width-div">
            <div className="container-xl">
              <div className="text-muted bg-grey text-sm mt-2 p-3 rounded-3">
                <p className="d-flex gap-4 align-items-center mb-0">
                  <div>
                    <i class="bi bi-info-circle"></i>
                  </div>
                  DevDAO is the primary organization behind DevHub, and we offer
                  sponsorships to contributors and projects that align with our
                  goal of fostering a self-sufficient community of developers
                  for a thriving NEAR ecosystem. Check out our Funding
                  Guidelines for more details.
                </p>
              </div>
              <div className="mt-4 border rounded-2">
                {proposals.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        (index !== proposals.length - 1 && "border-bottom ") +
                        (index === 0 && " rounded-top-2")
                      }
                    >
                      <FeedItem proposal={item} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

return FeedPage(props);
