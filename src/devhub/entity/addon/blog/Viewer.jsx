const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Card") ||
  (() => <></>);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const { includeLabels, excludeLabels, layout, handle, hideTitle } = props;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Heading = styled.h3`
  color: #151515;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 48px */
  margin-bottom: 2rem;

  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
`;

function BlogCard(postId) {
  return (
    <Link
      to={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: { page: "blog", id: postId },
      })}
    >
      <Widget // We need this so the individual posts can make the necessary call for more data
        src="${REPL_DEVHUB}/widget/devhub.entity.post.Postv2"
        props={{ postKey: postId, template: (p) => <Card {...(p || {})} /> }} // I wonder if this could take list of types, their templates, normalizer functions, etc... and have this all as a module
      />
      {/* // so then you could swap between devhub contract or social contract sources, it doesn't matter. */}
    </Link>
  );
}

return (
  <div class="w-100">
    {!hideTitle && <Heading>Latest Blog Posts</Heading>}
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Feed"}
      // TODO: This needs to filter by more labels
      props={{
        includeLabels: ["blog", handle, ...(includeLabels || [])], // make sure this has the community handle
        excludeLabels: excludeLabels || [],
        renderItem: BlogCard,
        Layout: ({ children }) => <Grid>{children}</Grid>,
      }}
    />
  </div>
);
