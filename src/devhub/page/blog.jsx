const { id } = props;

const { Page } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Page") ||
  (() => <></>);

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.entity.post.Postv2"
    props={{ postKey: id, template: (p) => <Page {...(p || {})} /> }}
  />
);
