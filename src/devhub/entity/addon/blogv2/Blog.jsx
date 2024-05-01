const { blogId, template, handle } = props;

const blog =
  Social.get(`${handle}.community.devhub.near/blog/${blogId}/**`, "final") ||
  {};

if (!blog) {
  return <div>Loading ...</div>;
}

const Template = template || (() => <></>);

return <Template data={{ ...blog.metadata, content: blog[""], handle }} />;
