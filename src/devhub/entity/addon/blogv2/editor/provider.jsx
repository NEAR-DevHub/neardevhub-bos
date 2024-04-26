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

// TODO Test when their is data in the communitySocialDB
const blogData =
  Social.get(
    [
      // `${handle}.community.devhub.near/blog/**`,
      "thomasguntenaar.near/blog/**",
    ],
    "final"
  ) || {};

function transformString(str) {
  // Convert the string to lowercase
  const lowerCaseStr = str.toLowerCase();

  // Replace spaces with hyphens
  const transformedStr = lowerCaseStr.replace(/ /g, "-");

  // Return the transformed string
  return transformedStr;
}

const handleOnSubmit = (v, isEdit) => {
  console.log("isEdit", isEdit);
  // TODO only difference is the created at or not
  // ! use v.createdAt || new Date().toISOString()
  if (isEdit) {
    // TODO setCommunitySocialDB
    Social.set({
      blog: {
        [v.id]: {
          "": v.content,
          metadata: {
            title: v.title,
            publishedAt: new Date(v.date).toISOString().slice(0, 10),
            status: v.status,
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
          subtitle: null,
          description: null,
          author: null,
          id: null,
        },
      },
    },
  });
};

const handleSettingsPage = () => {
  // TODO 599
  // Pass this via editor.index to the layout
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
