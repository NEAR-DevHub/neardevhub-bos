const { title, content, author, image, community, tags } = props;

const cidToURL = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

function Page({ labels, data }) {
  const {
    title,
    subtitle,
    description,
    category,
    author,
    image,
    community,
    date,
  } = data;

  function formatDate(date) {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleString("en-US", options).replace(",", "");
  }

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
        Written by <strong>{author || "AUTHOR"}</strong> in{" "}
        <strong>{community || "COMMUNITY"}</strong>
      </p>
      <div className="mb-4">
        {(tags || []).map((tag) => (
          <Widget
            src="${REPL_DEVHUB}/widget/devhub.components.atom.Tag"
            props={{ tag }}
          />
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
}


return { Page };