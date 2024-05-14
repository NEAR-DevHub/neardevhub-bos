const { getPost, setCommunitySocialDB } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { Layout, handle, communityAddonId } = props;

setCommunitySocialDB = setCommunitySocialDB || (() => <></>);
getPost = getPost || (() => <></>);

const handleGetData = (v) => {
  const id = transformString(v.title);
  return blogData[id] || {};
};

const blogData =
  Social.get([`${handle}.community.devhub.near/blog/**`], "final") || {};

// Show only published blogs
const processedData = Object.keys(blogData)
  .map((key) => {
    return {
      ...blogData[key].metadata,
      id: key,
      content: blogData[key][""],
    };
  })
  // Every instance of the blog tab has its own blogs
  .filter((blog) => blog.communityAddonId === communityAddonId)
  // Sort by published date
  .sort((blog1, blog2) => {
    return new Date(blog2.publishedAt) - new Date(blog1.publishedAt);
  });

function transformString(str) {
  // Convert the string to lowercase
  const lowerCaseStr = str.toLowerCase();

  // Replace spaces with hyphens
  const transformedStr = lowerCaseStr.replace(/ /g, "-");

  // Return the transformed string
  return transformedStr;
}

const handleOnSubmit = (v, isEdit) => {
  let id = isEdit
    ? v.id
    : `${transformString(v.title)}-${generateRandom6CharUUID()}`;
  let publishedAt = new Date(v.date).toISOString().slice(0, 10);

  let metadata = {
    title: v.title,
    publishedAt,
    status: v.status,
    subtitle: v.subtitle,
    description: v.description,
    author: v.author,
    category: v.category,
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  if (!isEdit) {
    // Set this once when created
    metadata.createdAt = new Date().toISOString().slice(0, 10);
    metadata.communityAddonId = communityAddonId;
  }

  setCommunitySocialDB({
    handle,
    data: {
      blog: {
        [id]: {
          "": v.content,
          metadata,
        },
      },
    },
  });
};

function generateRandom6CharUUID() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}

const handleOnDelete = (id) => {
  setCommunitySocialDB({
    handle,
    data: {
      blog: {
        [id]: {
          "": null,
          metadata: {
            title: null,
            createdAt: null,
            updatedAt: null,
            publishedAt: null,
            status: null,
            subtitle: null,
            description: null,
            author: null,
            id: null,
            category: null,
          },
        },
      },
    },
  });
};

const handleSettingsPage = () => {
  // TODO 599
  // Pass this via editor.index to the layout
};

const saveBlogPostSettings = (v) => {
  // TODO 599 move to provider
  console.log("Implement saving blog settings issue 599");
};

return (
  <Layout
    data={processedData || []}
    getData={handleGetData}
    onSubmit={handleOnSubmit}
    onDelete={handleOnDelete}
    onSubmitSettings={saveBlogPostSettings}
  />
);
