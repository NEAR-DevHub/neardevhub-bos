const { Card } = VM.require(
  "${REPL_EVENTS}/widget/devhub.entity.addon.blogv2.Card"
);

if (!Card) {
  return <p>Loading modules...</p>;
}

const { href } = VM.require("${REPL_EVENTS}/widget/core.lib.url") || (() => {});

const {
  data,
  handle,
  hideTitle,
  communityAddonId,
  setAddonView,
  transactionHashes,
  permissions,
} = props;

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

let blogData = Social.get([`${handle}.community.devhub.near/blog/**`], "final");

const categories = {
  none: {
    label: "None",
    value: "",
  },
};

function flattenBlogObject(blogsObject) {
  if (!blogsObject) return [];
  return (
    Object.keys(blogsObject)
      .map((key) => {
        return {
          ...blogsObject[key].metadata,
          id: key,
          content: blogsObject[key][""],
        };
      })
      // Show only published blogs
      .filter((blog) => blog.status === "PUBLISH")
      .map((flattenedBlog) => {
        if (!categories[flattenedBlog.category]) {
          console.log("flattenedBlog.category", flattenedBlog.category);
          categories[flattenedBlog.category] = {
            label: flattenedBlog.category,
            value: flattenedBlog.category,
          };
        }
        return flattenedBlog;
      })
      // Every instance of the blog tab has its own blogs
      .filter((blog) => blog.communityAddonId === communityAddonId)
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
  );
}

if (transactionHashes) {
  // Fetch new blog data
  const subscribeToBlogForNextFifteenSec = (tries) => {
    console.log("Trying to fetch new blog data");
    let newBlogData = Social.get(
      [`${handle}.community.devhub.near/blog/**`],
      "final"
    );
    if (tries >= 5) {
      // If we have tried 5 times, just use the data we have for example onBlogUpdate
      blogData = newBlogData;
      return;
    }
    // Check the number of blogs in this instance with a different status
    if (
      flattenBlogObject(newBlogData).length !==
      flattenBlogObject(blogData).length
    ) {
      blogData = newBlogData;
    } else {
      setTimeout(() => {
        subscribeToBlogForNextFifteenSec(tries + 1);
      }, 3000);
    }
  };
  // After a second subscribe to the blog data
  setTimeout(() => {
    subscribeToBlogForNextFifteenSec(0);
  }, 1000);
}

const processedData = flattenBlogObject(blogData)
  // Sort by published date
  .sort((blog1, blog2) => {
    return new Date(blog2.publishedAt) - new Date(blog1.publishedAt);
  });

function BlogCardWithLink(flattenedBlog) {
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={href({
        widgetSrc: "${REPL_EVENTS}/widget/app",
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

function NoBlogCard() {
  return (
    <div onClick={() => setAddonView("configure")} className="min-vh-100">
      <div>
        {BlogCard({
          category: "",
          title: "No blogs yet",
          description: "Click here to add your first blog!",
          publishedAt: new Date().toISOString(),
          id: "new",
        })}
      </div>
    </div>
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
        src="${REPL_EVENTS}/widget/devhub.components.molecule.Input"
        props={{
          className: "flex-grow-1",
          skipPaddingGap: true,
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
        src="${REPL_EVENTS}/widget/devhub.components.molecule.DropDown"
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
}, [categories]);

if (!processedData || processedData.length === 0) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center gap-4"
      style={{ height: 384 }}
    >
      <h5 className="h5 d-inline-flex gap-2 m-0 text-center">
        {"This blog isn't configured yet."}
        <br />
        {permissions.can_configure
          ? "Go to settings to configure your blog or create your first post."
          : ""}
      </h5>
    </div>
  );
}

return (
  <div class="w-100">
    {!hideTitle && <Heading>Latest Blog Posts</Heading>}
    <div className="d-flex justify-content-start flex-wrap gap-2 align-items-center mb-5">
      {data.searchEnabled ? searchInput : ""}
      {data.categoriesEnabled ? categoryInput : ""}
    </div>
    <Grid>
      {processedData &&
        processedData.map((flattenedBlog) => BlogCardWithLink(flattenedBlog))}
    </Grid>
  </div>
);
