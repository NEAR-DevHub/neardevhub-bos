const { title, content, author, image, community, tags } = props;

const cidToURL = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

return (
  <div className="card" style={{ width: "18rem" }}>
    {image && (
      <img
        src={cidToURL(image.cid)}
        className="card-img-top"
        alt="Blog image"
      />
    )}

    <div className="card-body">
      <h5 className="card-title">{title}</h5>

      <p className="card-text">
        <small className="text-muted">Author: {author || "AUTHOR"}</small>
      </p>

      <div>
        {(tags || []).map((tag) => (
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.atom.Tag"
            props={{ tag }}
          />
        ))}
      </div>

      <p className="card-text mt-2">Community: {community || "COMMUNITY"}</p>

      <Link to="#" className="btn btn-primary mt-2">
        Read More
      </Link>
    </div>
  </div>
);
