const { handle } = props;

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

return (
  <div class="row w-100">
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.feature.post-search.panel"}
      props={{
        children: (
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"
            }
            props={{
              title: "Post",
              href: href({
                widgetSrc: "${REPL_DEVHUB}/widget/app",
                params: {
                  page: "create",
                  labels: [communityData.tag],
                },
              }),
            }}
          />
        ),
        tag: ["blog", "handle"],
        recency,
        transactionHashes: props.transactionHashes,
      }}
    />
  </div>
);
