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
  // I like that this reduces duplicate code with the Viewer, but I don't like that "Latest Blog Posts" carries over...
  // TOOD: create a common blog feed... I think the addon.blog.Feed naming is confusing, as this should be a generic feed component.
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Viewer"}
    props={{ includeLabels: ["blog"], layout: "grid" }} // what is DevDAO label?
  />
);
