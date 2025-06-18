/**
 * This is the main entry point for the RFP application.
 * Page route gets passed in through params, along with all other page props.
 */

const { page, ...passProps } = props;

// Import our modules
const { AppLayout } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.template.AppLayout`
);

const { Theme } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/config.theme`
);

const { CssContainer } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/config.css`
);

if (!AppLayout || !Theme || !CssContainer) {
  return <p>Loading modules...</p>;
}

if (!page) {
  // If no page is specified, we default to the feed page TEMP
  page = "about";
}

// This is our navigation, rendering the page based on the page parameter
function Page() {
  const routes = page.split(".");
  switch (routes[0]) {
    case "about": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.pages.about`}
          props={passProps}
        />
      );
    }
    case "rfps": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.Feed`}
          props={passProps}
        />
      );
    }
    case "rfp": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.Rfp`}
          props={passProps}
        />
      );
    }
    case "create-rfp": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.rfps.Feed`}
          props={passProps}
        />
      );
    }
    case "create-proposal": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.proposals.Proposals`}
          props={passProps}
        />
      );
    }

    case "proposals": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.proposals.Proposals`}
          props={passProps}
        />
      );
    }
    case "proposal": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.proposals.Proposal`}
          props={passProps}
        />
      );
    }
    case "about": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.pages.about`}
          props={passProps}
        />
      );
    }
    case "admin": {
      return (
        <Widget
          src={`${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.pages.admin`}
          props={passProps}
        />
      );
    }
    default: {
      return <Widget src={"${REPL_DEVHUB}/widget/devhub.page.notfound"} />;
    }
  }
}

return (
  <Theme>
    <CssContainer>
      <AppLayout page={page}>
        <Page />
      </AppLayout>
    </CssContainer>
  </Theme>
);
