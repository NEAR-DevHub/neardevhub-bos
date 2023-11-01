const { handle } = props;

const { getCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!getCommunity || !href) {
  return <p>Loading modules...</p>;
}

// TODO: Why do we need to get community data again? Isn't the tag the handle...
const communityData = getCommunity({ handle });

if (communityData === null) {
  return <div>Loading...</div>;
}

console.log(communityData.tag);

return (
  <div style={{ maxWidth: "100%" }}>
    <div class="col">
      <div class="d-flex w-100">
        <div className="col-md-9" style={{ maxWidth: "75%" }}>
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.feature.post-search.panel"}
            props={{
              hideHeader: true,
              tag: communityData.tag,
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
              recency,
              transactionHashes: props.transactionHashes,
            }}
          />
        </div>
        <div class="col-md-3 container-fluid">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.community.Sidebar"}
            props={{ community: communityData }}
          />
        </div>
      </div>
    </div>
  </div>
);
