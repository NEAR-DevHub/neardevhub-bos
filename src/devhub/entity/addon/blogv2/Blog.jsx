const { blogId, template, handle } = props;

const blog = Social.get(`${handle}/blog/${blogId}/**`, "final") || {};

console.log("blogv2.Blog", { blog, handle, blogId });

if (!blog) {
  return <div>Loading ...</div>;
}

const Template = template || (() => <></>);

return <Template data={{ ...blog.metadata, content: blog[""], handle }} />;
