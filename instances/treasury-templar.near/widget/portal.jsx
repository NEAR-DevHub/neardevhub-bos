/**
 * This is the main entry point for the RFP application.
 * Page route gets passed in through params, along with all other page props.
 */

const { page, ...passProps } = props;

// Import our modules
const { AppLayout } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/components.template.AppLayout`
);

const { Theme } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/portal-config.theme`
);

const { CssContainer } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/portal-config.css`
);

if (!AppLayout || !Theme || !CssContainer) {
  return <p>Loading modules...</p>;
}

if (!page) {
  // If no page is specified, we default to the feed page TEMP
  page = "about";
}

const propsToSend = { ...passProps, instance: "${REPL_TREASURY_TEMPLAR}" };

// This is our navigation, rendering the page based on the page parameter
function Page() {
  const routes = page.split(".");
  switch (routes[0]) {
    case "rfps": {
      return (
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.rfps.Feed`}
          props={passProps}
        />
      );
    }
    case "rfp": {
      return (
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.rfps.Rfp`}
          props={passProps}
        />
      );
    }
    case "create-rfp": {
      return (
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.rfps.Editor`}
          props={passProps}
        />
      );
    }
    case "create-proposal": {
      return (
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.proposals.Editor`}
          props={{ ...passProps }}
        />
      );
    }

    case "proposals": {
      return (
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.proposals.Proposals`}
          props={passProps}
        />
      );
    }
    case "proposal": {
      return (
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.proposals.Proposal`}
          props={passProps}
        />
      );
    }
    case "about": {
      return (
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.pages.about`}
          props={passProps}
        />
      );
    }
    case "admin": {
      return (
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.pages.admin`}
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
