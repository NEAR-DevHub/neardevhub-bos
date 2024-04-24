const { getPost, setCommunitySocialDB } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { Layout, handle, communityAddonId } = props;

setCommunitySocialDB = setCommunitySocialDB || (() => <></>);
getPost = getPost || (() => <></>);

const handleOnChange = (v) => {
  console.log("onChange", v);
};

const handleGetData = (v) => {
  const id = transformString(v.title);
  return blogData[id] || {};
};

// const blogKeys = Social.keys([["thomasguntenaar.near/blog/*"]], "final");

const blogData =
  Social.get(
    [
      // "thomasguntenaar.near/blog/*/metadata/createdAt",
      // "thomasguntenaar.near/blog/*/metadata/tags",
      "thomasguntenaar.near/blog/**",
    ],
    "final"
  ) || {};

// TODO Test when their is data in the communitySocialDB
useEffect(() => {
  if (handle) {
    const result = Social.get(
      [
        `${handle}.community.devhub.near/blog/*/metadata/createdAt`,
        `${handle}.community.devhub.near/blog/*/metadata/tags/*`,
      ],
      "final"
    );
  }
}, [handle]);

function transformString(str) {
  // Convert the string to lowercase
  const lowerCaseStr = str.toLowerCase();

  // Replace spaces with hyphens
  const transformedStr = lowerCaseStr.replace(/ /g, "-");

  // Return the transformed string
  return transformedStr;
}

// TODO: title is not unique
const handleOnSubmit = (v, isEdit) => {
  console.log("isEdit", isEdit);
  // TODO: only difference is the created at or not
  // v.createdAt || new Date().toISOString()
  if (isEdit) {
    Social.set({
      blog: {
        [v.id]: {
          "": v.content,
          metadata: {
            title: v.title,
            // ! REMOVE from update
            createdAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10),
            communityAddonId: communityAddonId,
            // ! REMOVE from update
            publishedAt: v.date,
            status: v.status,
            tags: v.tags,
            subtitle: v.subtitle,
            description: v.description,
            author: v.author,
          },
        },
      },
    });
    console.log("handle edit blog", v);
  } else {
    console.log("handle add blog", v);
    // !setCommunitySocialDB({
    // !  handle,
    // !  data: {},
    // ! });
    Social.set({
      blog: {
        [`${transformString(v.title)}-${generateRandom6CharUUID()}`]: {
          "": v.content,
          metadata: {
            title: v.title,
            createdAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10),
            publishedAt: v.date,
            status: v.status,
            tags: v.tags,
            subtitle: v.subtitle,
            description: v.description,
            author: v.author,
            communityAddonId: communityAddonId,
          },
        },
      },
    });
  }
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

const handleOnCancel = (v) => {
  console.log("onCancel", v);
};

const handleOnDelete = (id) => {
  console.log("onDelete", v);
  // TODO setCommunitySocialDB
  Social.set({
    blog: {
      [id]: {
        "": null,
        metadata: {
          title: null,
          createdAt: null,
          updatedAt: null,
          publishedAt: null,
          status: null,
          tags: null,
          subtitle: null,
          description: null,
          author: null,
          id: null,
        },
      },
    },
  });
};

return (
  <Layout
    data={blogData || []}
    getData={handleGetData}
    onChange={handleOnChange}
    onSubmit={handleOnSubmit}
    onCancel={handleOnCancel}
    onDelete={handleOnDelete}
  />
);
