/**
 * This is the main entry point for the RFP application.
 * Page route gets passed in through params, along with all other page props.
 */

const { page, ...passProps } = props;

// Import our modules
const { AppLayout } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/components.template.AppLayout`
);

const { Theme } = VM.require(`${REPL_TREASURY_TEMPLAR}/widget/config.theme`);

const { CssContainer } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/config.css`
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
    // FOR TREASURY, SINCE WE USE SAME ACCOUNT TO DEPLOY BOTH
    case "dashboard": {
      return (
        <Widget
          src="${REPL_TREASURY_BASE_DEPLOYMENT_ACCOUNT}/widget/pages.dashboard.index"
          props={propsToSend}
        />
      );
    }
    case "settings": {
      return (
        <Widget
          src={
            "${REPL_TREASURY_BASE_DEPLOYMENT_ACCOUNT}/widget/pages.settings.index"
          }
          props={propsToSend}
        />
      );
    }
    case "payments": {
      return (
        <Widget
          src={
            "${REPL_TREASURY_BASE_DEPLOYMENT_ACCOUNT}/widget/pages.payments.index"
          }
          props={propsToSend}
        />
      );
    }

    case "stake-delegation": {
      return (
        <Widget
          src={
            "${REPL_TREASURY_BASE_DEPLOYMENT_ACCOUNT}/widget/pages.stake-delegation.index"
          }
          props={propsToSend}
        />
      );
    }

    case "asset-exchange": {
      return (
        <Widget
          src={
            "${REPL_TREASURY_BASE_DEPLOYMENT_ACCOUNT}/widget/pages.asset-exchange.index"
          }
          props={propsToSend}
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
