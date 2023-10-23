const { tags } = props;

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

return (
  <div class="row w-100">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.post.List"}
      // TODO: This needs to filter by more labels
      props={{
        tag: "test", // ["blog", ...tags]
      }}
    />
  </div>
);
