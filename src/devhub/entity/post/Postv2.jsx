const { getPost } =
  VM.require("${REPL_DEVHUB}/widget/core.adapter.devhub-contract") ||
  (() => {});

const { postKey, template } = props;

const post = getPost({ post_id: postKey });

if (!post) {
  return <div>Loading ...</div>;
}

const Template = template || (() => <></>);

return <Template {...(post || {})} />;
