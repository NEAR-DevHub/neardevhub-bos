const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Card") ||
  (() => <></>);
const { includeLabels, excludeLabels, layout } = props;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 769px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

function BlogCard(postId) {
  return (
    <Widget // We need this so the individual posts can make the necessary call for more data
      src="${REPL_DEVHUB}/widget/devhub.entity.post.Postv2"
      props={{ postKey: postId, template: (p) => <Card {...(p || {})} /> }} // I wonder if this could take list of types, their templates, normalizer functions, etc... and have this all as a module
    /> // so then you could swap between devhub contract or social contract sources, it doesn't matter.
  );
}

return (
  <div class="row w-100">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Feed"}
      // TODO: This needs to filter by more labels
      props={{
        // includeLabels: ["blog", ...(includeTags || [])], // make sure this has the community handle
        excludeLabels: excludeTags,
        renderItem: BlogCard,
        Layout: ({ children }) =>
          layout === "grid" ? <Grid>{children}</Grid> : children,
      }}
    />
  </div>
);
