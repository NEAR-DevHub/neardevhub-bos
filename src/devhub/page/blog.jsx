const { id } = props;

const { Page } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Page") ||
  (() => <></>);

if (id) {
  return (
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.entity.post.Postv2"
      props={{ postKey: id, template: (p) => <Page {...(p || {})} /> }}
    />
  );
}

return (
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Viewer"}
    props={{ includeLabels: ["blog"], layout: "grid" }} // what is DevDAO label?
  />
);
