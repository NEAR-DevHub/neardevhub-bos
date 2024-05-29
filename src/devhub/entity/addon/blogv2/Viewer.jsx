const { Tailwind } = VM.require("uiisnear.near/widget/tailwind");
const { ButtonConf } = VM.require("uiisnear.near/widget/button");
const {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  paginationPreviousClassname,
  paginationNextClassname,
} = VM.require("uiisnear.near/widget/pagination");

const { Card } = VM.require(
  "${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Card"
);

if (!Card) {
  return <p>Loading modules...</p>;
}

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const [paginationLink, setPaginationLink] = useState("");
const [paginationLinkPrevious, setPaginationLinkPrevious] = useState("");
const [paginationLinkNext, setPaginationLinkNext] = useState("");
const [paginationLinkActive, setPaginationLinkActive] = useState("");

if (ButtonConf == undefined) return "";

if (paginationLink === "")
  return <ButtonConf output={setPaginationLink} variant="ghost" size="icon" />;
if (paginationLinkPrevious === "")
  return (
    <ButtonConf
      output={setPaginationLinkPrevious}
      variant="ghost"
      size="default"
      className={paginationPreviousClassname}
    />
  );
if (paginationLinkNext === "")
  return (
    <ButtonConf
      output={setPaginationLinkNext}
      variant="ghost"
      size="default"
      className={paginationNextClassname}
    />
  );
if (paginationLinkActive === "")
  return (
    <ButtonConf
      output={setPaginationLinkActive}
      variant="outline"
      size="icon"
    />
  );

if (Tailwind == undefined) return "";

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

const Heading = styled.div`
  color: #151515;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 48px */
  margin-bottom: 0.5rem;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SubHeading = styled.div`
  color: #3b3b3b;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
  margin-bottom: 2rem;

  @media screen and (max-width: 768px) {
    font-size: 1rem;
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

const [blogData, setBlogData] = useState([]);

const initialBlogData = Social.get(
  [`${handle}.community.devhub.near/blog/**`],
  "final"
);

useEffect(() => {
  if (initialBlogData) {
    setBlogData(initialBlogData);
  }
}, [initialBlogData]);

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
      // Every instance of the blog tab has its own blogs
      .filter((blog) => blog.communityAddonId === communityAddonId)
      // Add categories to the dropdown
      .map((flattenedBlog) => {
        if (!categories[flattenedBlog.category]) {
          categories[flattenedBlog.category] = {
            label: flattenedBlog.category,
            value: flattenedBlog.category,
          };
        }
        return flattenedBlog;
      })
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
function checkHashes() {
  if (transactionHashes) {
    // Fetch new blog data
    const subscribeToBlogForNextFifteenSec = (tries) => {
      if (tries >= 5) {
        return;
      }
      Near.asyncView("${REPL_SOCIAL_CONTRACT}", "get", {
        keys: [`${handle}.community.devhub.near/blog/**`],
      }).then((result) => {
        try {
          const newBlogPosts = result[`${handle}.community.devhub.near`].blog;
          // Check the number of blogs in this instance with a different status
          if (
            flattenBlogObject(newBlogPosts).length !==
            flattenBlogObject(blogData).length
          ) {
            setBlogData(newBlogPosts);
          } else {
            setTimeout(() => {
              subscribeToBlogForNextFifteenSec(tries + 1);
            }, 3000);
          }
        } catch (e) {}
      });
    };
    // After a second subscribe to the blog data
    setTimeout(() => {
      subscribeToBlogForNextFifteenSec(0);
    }, 1000);
  }
}
useEffect(() => {
  // Only render one time
  checkHashes();
}, []);

const processedData = flattenBlogObject(blogData)
  // Sort by published date
  .sort((blog1, blog2) => {
    if (data.orderBy === "timeasc") {
      return new Date(blog1.publishedAt) - new Date(blog2.publishedAt);
    }
    if (data.orderBy === "alpha") {
      return (blog1.title || "").localCompare(blog2.title || "");
    }
    // timedesc is the default order
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
          key: "search-blog-posts",
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
    {!hideTitle && (
      <Heading data-testid="blog-instance-title">{data.title || ""}</Heading>
    )}
    {!hideTitle && (
      <SubHeading data-testid="blog-instance-subtitle">
        {data.subtitle || ""}
      </SubHeading>
    )}
    <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center">
      {data.searchEnabled ? searchInput : ""}
      {data.categoriesEnabled ? categoryInput : ""}
    </div>
    <Grid>
      {processedData &&
        processedData.map((flattenedBlog) => BlogCardWithLink(flattenedBlog))}
    </Grid>
    <Tailwind>
      <div className="flex mx-auto w-max pt-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className={paginationLinkPrevious} href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink className={paginationLink} href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className={paginationLinkActive}
                href="#"
                isActive
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink className={paginationLink} href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext className={paginationLinkNext} href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Tailwind>
  </div>
);
