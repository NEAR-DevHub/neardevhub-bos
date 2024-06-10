const accountId = context.accountId;
const likesByUsers = props.likesByUsers || {};
const limit = props.limit ?? 3;

let likes = Object.keys(likesByUsers).reverse();

const graphLikes = [];
const nonGraph = [];

const graph =
  (accountId &&
    Social.keys(`${accountId}/graph/follow/*`, "final")[accountId].graph
      .follow) ||
  {};

likes.forEach((accountId) => {
  if (accountId in graph) {
    graphLikes.push(accountId);
  } else {
    nonGraph.push(accountId);
  }
});

let faces = [...graphLikes, ...nonGraph];

if (faces.length < limit + 3) {
  limit = faces.length;
}

const renderFaces = faces.splice(0, limit);

const Faces = styled.span`
  .face {
    display: inline-block;
    position: relative;
    margin: -0.1em;
    height: 1.5em;
    width: 1.5em;
    min-width: 1.5em;
    vertical-align: top;
    img {
      object-fit: cover;
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
  }
`;

const Others = styled.span`
  &:hover {
    color: white !important;
  }
`;

const numLikes = likes.length - limit;

return (
  <>
    <Faces className="ms-1">
      {renderFaces.map((accountId, i) => (
        <a
          key={i}
          href={`#/${REPL_MOB}/widget/ProfilePage?accountId=${accountId}`}
          className="text-decoration-none d-inline-block"
        >
          <Widget
            src="${REPL_MOB}/widget/Profile.OverlayTrigger"
            props={{
              accountId,
              children: (
                <Widget
                  src="${REPL_MOB}/widget/ProfileImage"
                  props={{
                    metadata,
                    accountId,
                    widgetName,
                    style: { zIndex: 10 - i },
                    className: "face",
                    tooltip: false,
                    imageStyle: {},
                    imageClassName: "",
                  }}
                />
              ),
            }}
          />
        </a>
      ))}
    </Faces>
    {numLikes > 0 ? (
      <OverlayTrigger
        placement="auto"
        overlay={
          <Tooltip>
            <div
              className="text-truncate text-start"
              style={{ maxWidth: "16em" }}
            >
              {faces.slice(0, 10).map((accountId, i) => (
                <Fragment key={i}>
                  <Widget
                    src="${REPL_MOB}/widget/ProfileLine"
                    props={{ accountId, link: false }}
                  />
                  <br />
                </Fragment>
              ))}
              {faces.length > 10 ? "..." : ""}
            </div>
          </Tooltip>
        }
      >
        <span className="ms-1">
          and {numLikes} other{numLikes === 1 ? "" : "s"}
        </span>
      </OverlayTrigger>
    ) : (
      ""
    )}
  </>
);
