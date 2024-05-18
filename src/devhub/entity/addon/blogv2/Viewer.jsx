const { Card } = VM.require(
  "${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Card"
);

if (!Card) {
  return <p>Loading modules...</p>;
}

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const { data, handle, hideTitle, communityAddonId } = props;

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

if (!handle) {
  return <div>Missing handle</div>;
}

const [blogPostQueryString, setBlogPostQueryString] = useState("");
const [blogPostFilterCategory, setBlogPostFilterCategory] = useState("");

const blogPostQueryStringLowerCase = blogPostQueryString
  ? blogPostQueryString.toLowerCase().trim()
  : "";

const blogData = Social.get(
  [`${handle}.community.devhub.near/blog/**`],
  "final"
);

const categories = {
  none: {
    label: "None",
    value: "",
  },
};

const processedData = Object.keys(blogData)
  .map((key) => {
    return {
      ...blogData[key].metadata,
      id: key,
      content: blogData[key][""],
    };
  })
  // Show only published blogs
  .filter((blog) => blog.status === "PUBLISH")
  .map((flattenedBlog) => {
    if (!categories[flattenedBlog.category]) {
      categories[flattenedBlog.category] = {
        label: flattenedBlog.category,
        value: flattenedBlog.category,
      };
    }
    return flattenedBlog;
  })
  // Every instance of the blog tab has its own blogs
  //.filter((blog) => blog.communityAddonId === communityAddonId)
  .filter(
    (flattenedBlog) =>
      !blogPostQueryStringLowerCase ||
      flattenedBlog.content
        ?.toLowerCase()
        .includes(blogPostQueryStringLowerCase) ||
      flattenedBlog.title
        ?.toLowerCase()
        .includes(blogPostQueryStringLowerCase) ||
      flattenedBlog.subtitle
        ?.toLowerCase()
        .includes(blogPostQueryStringLowerCase)
  )
  .filter(
    (flattenedBlog) =>
      !blogPostFilterCategory ||
      flattenedBlog.category === blogPostFilterCategory
  )
  // Sort by published date
  .sort((blog1, blog2) => {
    return new Date(blog2.publishedAt) - new Date(blog1.publishedAt);
  });

function BlogCardWithLink(flattenedBlog) {
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: {
          page: "blogv2",
          id: flattenedBlog.id,
          community: handle,
          communityAddonId, // Passed in addon.jsx
        },
      })}
    >
      {BlogCard(flattenedBlog)}
    </Link>
  );
}

function BlogCard(flattenedBlog) {
  return (
    <CardContainer>
      <Card data={flattenedBlog} />
    </CardContainer>
  );
}

const searchInput = useMemo(
  () => (
    <div className="d-flex flex-wrap gap-4 align-items-center">
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.molecule.Input"
        props={{
          className: "flex-grow-1",
          placeholder: "search blog posts",
          debounceTimeout: 300,
          onChange: (e) => {
            setBlogPostQueryString(e.target.value);
          },
          inputProps: {
            prefix: <i class="bi bi-search m-auto"></i>,
          },
        }}
      />
    </div>
  ),
  []
);

const categoryInput = useMemo(() => {
  const options = Object.values(categories);

  return (
    <div className="d-flex flex-wrap gap-4 align-items-center">
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown"
        props={{
          options: options,
          label: "Category",
          onUpdate: (selectedCategory) => {
            setBlogPostFilterCategory(selectedCategory.value);
          },
        }}
      />
    </div>
  );
}, []);

return (
  <div class="w-100">
    {!hideTitle && <Heading> Latest Blog Posts</Heading>}
    <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center">
      {searchInput}
      {categoryInput}
    </div>
    <Grid>
      {processedData && processedData.length > 0
        ? processedData.map((flattenedBlog) => BlogCardWithLink(flattenedBlog))
        : BlogCard({
            category: "Category",
            title: "Placeholder",
            subtitle: "No blog data yet",
            publishedAt: new Date().toISOString(),
            id: "new",
          })}
    </Grid>
  </div>
);
