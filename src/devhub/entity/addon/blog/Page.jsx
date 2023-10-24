const { title, content, author, image, community, tags } = props;

const cidToURL = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

return (
  <div className="container mt-5">
    {image && (
      <div className="mb-4">
        <img
          src={cidToURL(image.cid)}
          alt="Blog Header Image"
          className="img-fluid rounded"
        />
      </div>
    )}
    <h1 className="mb-3">{title}</h1>
    <p className="text-muted mb-4">
      Written by <strong>{author || "AUTHOR"}</strong> in <strong>{community || "COMMUNITY"}</strong>
    </p>
    <div className="mb-4">
      {tags &&
        tags.map((tag, index) => (
          <span key={index} className="badge bg-secondary me-2">
            {tag}
          </span>
        ))}
    </div>
    <div className="mb-5">
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"
        props={{
          text: content,
        }}
      />
    </div>
  </div>
);
