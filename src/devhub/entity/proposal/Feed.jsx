const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

const Container = styled.div`
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
`;

const Heading = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const FeedItem = ({ proposal }) => {
  const { snapshot } = proposal;
  const accountId = proposal.author_id;
  const profile = Social.get(`${accountId}/profile/**`, "final");
  const blockHeight = proposal.social_db_post_block_height;
  const item = {
    type: "social",
    path: `${REPL_PROPOSALS_CONTRACT}/post/main`,
    blockHeight,
  };

  return (
    <Link
      to={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: {
          page: "proposal",
          id: proposal.id,
        },
      })}
      style={{ textDecoration: "none" }}
    >
      <div className="proposal-card d-flex justify-content-between text-muted cursor-pointer p-3">
        <div className="d-flex gap-4">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Profile"}
            props={{
              accountId,
            }}
          />
          <div className="d-flex flex-column gap-2">
            <div className="d-flex gap-2 align-items-center">
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
                src="${REPL_NEAR}/widget/v1.LikeButton"
                props={{
                  item,
                }}
              />
              <Widget
                src="${REPL_NEAR}/widget/CommentButton"
                props={{
                  item,
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
    </Link>
  );
};

const FeedPage = () => {
  const proposals = Near.view(
    "${REPL_PROPOSALS_CONTRACT}",
    "get_proposals",
    {}
  );

  return (
    <Container className="w-100 p-4 d-flex flex-column gap-3">
      <Heading>
        DevDAO Proposals{" "}
        <span className="text-muted"> ({proposals.length})</span>
      </Heading>
      <div className="d-flex justify-content-between">
        <div className="d-flex gap-4 align-items-center">
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
        </div>
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
      <hr />
      <div className="card">
        <div className="card-body">
          <div className="text-muted bg-grey text-sm mt-2 p-3 rounded-3">
            <p className="d-flex gap-4 align-items-center mb-0">
              <div>
                <i class="bi bi-info-circle"></i>
              </div>
              DevDAO is the primary organization behind DevHub, and we offer
              sponsorships to contributors and projects that align with our goal
              of fostering a self-sufficient community of developers for a
              thriving NEAR ecosystem. Check out our Funding Guidelines for more
              details.
            </p>
          </div>
          <div className="mt-4">
            {Array.isArray(proposals) &&
              proposals.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={"border " + (index === 0 && " rounded-top-2")}
                  >
                    <FeedItem proposal={item} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Container>
  );
};

return FeedPage(props);
