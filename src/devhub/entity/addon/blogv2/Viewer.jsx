const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Card") ||
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
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 48px */
  margin-bottom: 2rem;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CardContainer = styled.div`
  transition: all 300ms;
  border-radius: 1rem;
  height: 100%;

  &:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
`;

const blogData =
  Social.get(
    [
      // "thomasguntenaar.near/blog/*/metadata/createdAt",
      // "thomasguntenaar.near/blog/*/metadata/tags",
      "thomasguntenaar.near/blog/**",
    ],
    "final"
  ) || {};

const reshapedData = Object.keys(blogData).map((key) => {
  return {
    ...blogData[key].metadata,
    id: key,
    body: blogData[key][""],
  };
});

function BlogCard(flattenedBlog) {
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: { page: "blogv2", id: flattenedBlog.id },
      })}
    >
      <CardContainer>
        <Card data={flattenedBlog} />
      </CardContainer>
    </Link>
  );
}
console.log("VIEWER blogdata", blogData);

// TODO hide DRAFTS
// TODO order by published date
return (
  <div class="w-100">
    {!hideTitle && <Heading>Latest Blog Posts</Heading>}
    <Grid>
      {(reshapedData || []).map((flattenedBlog) => {
        // TODO use exclude labels
        // TODO use include labels
        console.log("blog", flattenedBlog);
        return BlogCard(flattenedBlog);
      })}
    </Grid>
  </div>
);
