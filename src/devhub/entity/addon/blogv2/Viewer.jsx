const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Card") ||
  (() => <></>);

if (!Card) {
  return <p>Loading modules...</p>;
}

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const {
  data,
  handle,
  hideTitle,
  communityAddonId,
  setAddonView,
  transactionHashes,
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

let blogData =
  Social.get([`${handle}.community.devhub.near/blog/**`], "final") || {};

function flattenBlogObject(blogsObject) {
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
      // Every instance of the blog tab has its own blogs
      .filter((blog) => blog.communityAddonId === communityAddonId)
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

return (
  <div class="w-100">
    {!hideTitle && <Heading> Latest Blog Posts</Heading>}
    <Grid>
      {processedData && processedData.length > 0
        ? processedData.map((flattenedBlog) => BlogCardWithLink(flattenedBlog))
        : NoBlogCard()}
    </Grid>
  </div>
);
