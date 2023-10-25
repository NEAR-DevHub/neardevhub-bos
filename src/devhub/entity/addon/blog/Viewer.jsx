const { includeTags, excludeTags, layout } = props;

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

// I want a different post item.
// Ability to switch between grid and list view

// And so I want a different feed...
return (
  <div class="row w-100">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.post.List"}
      // TODO: This needs to filter by more labels
      props={{
        tag: "blog", // ["blog", ...tags]
      }}
    />
  </div>
);
