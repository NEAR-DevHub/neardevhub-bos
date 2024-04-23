const { getPost, setCommunitySocialDB } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { Layout, handle } = props;

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
      // "thomasguntenaar.near/blog/*/metadata/created_at",
      // "thomasguntenaar.near/blog/*/metadata/tags",
      "thomasguntenaar.near/blog/**",
    ],
    "final"
  ) || {};

// Test when their is data in the communitySocialDB
useEffect(() => {
  if (handle) {
    const result = Social.get(
      [
        `${handle}.community.devhub.near/blog/*/metadata/created_at`,
        `${handle}.community.devhub.near/blog/*/metadata/tags/*`,
      ],
      "final"
    );
    console.log(result);
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

// FIXME: title is not unique
const handleOnSubmit = (v, isEdit) => {
  console.log("isEdit", isEdit);
  if (isEdit) {
    Social.set({
      blog: {
        [v.id]: {
          "": v.body,
          metadata: {
            title: v.title,
            updated_at: new Date().toISOString().slice(0, 10),
            published_at: v.date,
            status: v.status,
            tags: v.tags,
          },
        },
      },
    });
    console.log("handle edit blog", v);
  } else {
    console.log("handle add blog", v);

    // setCommunitySocialDB({
    //   handle,
    //   data: {
    //     blog: {
    //       [transformString(v.title)]: {
    //         "": v.body,
    //         metadata: {
    //           title: v.title,
    //           created_at: new Date().toISOString(),
    //           updated_at: new Date().toISOString(),
    //           published_at: v.published_at,
    //           status: "DRAFT", // "PUBLISHED", "DRAFT"
    //           tags: v.tags,
    //         },
    //       },
    //     },
    //   },
    // });
    // TODO setCommunitySocialDB
    Social.set({
      blog: {
        [transformString(v.title) + generateRandom6CharUUID()]: {
          "": v.content,
          metadata: {
            title: v.title,
            created_at: new Date().toISOString().slice(0, 10),
            updated_at: new Date().toISOString().slice(0, 10),
            published_at: v.date,
            status: "DRAFT", // "PUBLISHED", "DRAFT"
            tags: v.tags,
            subTitle: v.subtitle,
            description: v.description,
            author: v.author,
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
          created_at: null,
          updated_at: null,
          published_at: null,
          status: null,
          tags: null,
          subTitle: null,
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
