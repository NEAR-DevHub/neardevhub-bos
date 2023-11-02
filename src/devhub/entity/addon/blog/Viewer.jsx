const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Card") ||
  (() => <></>);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const { includeLabels, excludeLabels, layout, handle } = props;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 769px) {
    grid-template-columns: repeat(3, 1fr);
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
  <div class="row w-100">
    <h2>Latest Blog Posts</h2>
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Feed"}
      // TODO: This needs to filter by more labels
      props={{
        includeLabels: ["blog", handle, ...(includeTags || [])], // make sure this has the community handle
        excludeLabels: excludeTags,
        renderItem: BlogCard,
        Layout: ({ children }) =>
          layout === "grid" ? <Grid>{children}</Grid> : children,
      }}
    />
  </div>
);
