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

const MainContent = styled.div`
  flex-grow: 1;
  max-width: 75%;

  @media screen and (max-width: 960px) {
    max-width: 100%;
  }
`;

const SidebarContainer = styled.div`
  max-width: 25%;
  margin-right: 1.5rem;

  @media screen and (max-width: 960px) {
    display: none;
  }
`;

return (
  <div style={{ maxWidth: "100%", width: "100%" }}>
    <div class="col">
      <div class="d-flex w-100">
        <MainContent>
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
        </MainContent>
        <SidebarContainer>
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.community.Sidebar"}
            props={{ community: communityData }}
          />
        </SidebarContainer>
      </div>
    </div>
  </div>
);
