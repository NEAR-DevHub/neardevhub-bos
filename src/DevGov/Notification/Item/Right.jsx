return props.post === undefined ? (
  "Loading ..."
) : (
  <>
    <a
      className="btn btn-outline-dark"
      href={`#/devgovgigs.near/widget/Ideas?postId=${props.post}`}
    >
      View Developer Governance post
    </a>
  </>
);
