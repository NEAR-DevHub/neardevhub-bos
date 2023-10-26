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

return (
  <div class="row w-100">
    <div class="col-md-9">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <small class="text-muted">
          <span>Required tags:</span>
          <Link
            to={href({
              widgetSrc: "${REPL_DEVHUB}/widget/app",
              params: { page: "feed", tag: communityData.tag },
            })}
          >
            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
              props={{
                tag: communityData.tag,
              }}
            />
          </Link>
        </small>
      </div>
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
);
