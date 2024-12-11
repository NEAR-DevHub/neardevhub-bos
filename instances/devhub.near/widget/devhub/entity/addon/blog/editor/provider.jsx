const { getPost } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
) || { getPost: () => {} };

const { Layout, handle } = props;

const posts = [];

const handleOnChange = (v) => {
  console.log("onChange", v);
};

const handleGetData = (v) => {
  const postId = parseInt(v);
  return Near.asyncView("${REPL_DEVHUB_LEGACY}", "get_post", {
    post_id: postId,
  }).then((post) => {
    const description = JSON.parse(post.snapshot.description || "null") || {};
    return {
      id: postId,
      ...description,
    };
  });
};

const handleOnSubmit = (v, isEdit) => {
  if (isEdit) {
    Near.call({
      contractName: "${REPL_DEVHUB_LEGACY}",
      methodName: "edit_post",
      args: {
        id: parseInt(v.id),
        labels: ["blog", handle],
        body: {
          post_type: "Comment",
          description: JSON.stringify(v),
          comment_version: "V2",
        },
      },
      gas: Big(10).pow(14),
    });
  } else {
    Near.call({
      contractName: "${REPL_DEVHUB_LEGACY}",
      methodName: "add_post",
      args: {
        labels: ["blog", handle],
        body: {
          post_type: "Comment",
          description: JSON.stringify(v),
          comment_version: "V2",
        },
      },
      gas: Big(10).pow(14),
    });
  }
};

const handleOnCancel = (v) => {
  console.log("onCancel", v);
};

return (
  <Layout
    data={posts.body.data.bo_near_devhub_v38_posts_with_latest_snapshot || []}
    getData={handleGetData}
    onChange={handleOnChange}
    onSubmit={handleOnSubmit}
    onCancel={handleOnCancel}
  />
);
