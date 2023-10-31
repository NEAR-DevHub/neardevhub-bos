const { includeLabels, excludeLabels, layout } = props;

// I want a different post item.
// Ability to switch between grid and list view

// And so I want a different feed...
return (
  <div class="row w-100">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Feed"}
      // TODO: This needs to filter by more labels
      props={{
        includeLabels: ["blog", ...(includeTags || [])], // make sure this has the community handle
        excludeLabels: excludeTags,
        renderItem: (item) => <p>{JSON.stringify(item)}</p>
      }}
    />
  </div>
);
