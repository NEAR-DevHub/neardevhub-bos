/**
 * This is the main entry point for the DevHub application.
 * Page route gets passed in through params, along with all other page props.
 */

const { onDraftStateChange } = VM.require(
  "${REPL_EVENTS}/widget/devhub.entity.post.draft"
);

const { page, ...passProps } = props;

// Import our modules
const { AppLayout } = VM.require(
  "${REPL_EVENTS}/widget/devhub.components.templates.AppLayout"
);

const { Theme } = VM.require("${REPL_EVENTS}/widget/config.theme");
const { CssContainer } = VM.require("${REPL_EVENTS}/widget/config.css");

if (!AppLayout || !Theme || !CssContainer) {
  return <p>Loading modules...</p>;
}

if (!page) {
  // If no page is specified, we default to the feed page TEMP
  page = "proposals";
}

// This is our navigation, rendering the page based on the page parameter
function Page() {
  const routes = page.split(".");
  switch (routes[0]) {
    case "create-proposal": {
      return (
        <Widget
          src={"${REPL_EVENTS}/widget/devhub.page.proposals"}
          props={{ ...passProps, instance: "events-committee.near" }}
        />
      );
    }
    case "proposals": {
      return (
        <Widget
          src={"${REPL_EVENTS}/widget/devhub.page.proposals"}
          props={{ ...passProps, instance: "events-committee.near" }}
        />
      );
    }
    case "proposal": {
      return (
        <Widget
          src={"${REPL_EVENTS}/widget/devhub.entity.proposal.Proposal"}
          props={{ ...passProps, instance: "events-committee.near" }}
        />
      );
    }
    // ?page=about
    case "about": {
      return (
        <Widget
          src={"${REPL_EVENTS}/widget/devhub.page.about"}
          props={passProps}
        />
      );
    }
    case "admin": {
      return (
        <Widget
          src={"${REPL_EVENTS}/widget/devhub.page.admin.index"}
          props={passProps}
        />
      );
    }
    case "profile": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.profile"}
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
