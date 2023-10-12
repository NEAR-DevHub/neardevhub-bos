/**
 * This is the main entry point for the DevHub application.
 * Page route gets passed in through params, along with all other page props.
 */

// Import our modules
const { AppLayout } = VM.require(
  "devhub.efiz.testnet/widget/DevHub.components.templates.AppLayout"
);
if (!AppLayout) {
  return <p>Loading modules...</p>;
}

// Define our Theme
const Theme = styled.div`
  a {
    color: inherit;
  }

  .attractable {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    transition: box-shadow 0.6s;

    &:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
  }
`;

const { page, nearDevGovGigsWidgetsAccountId, nearDevGovGigsContractAccountId, ...passProps } = props;

if (!page) {
  // If no page is specified, we default to the home page
  page = "home";
}

// THESE ARE TEMPORARY
// This can be solved with injection during build
if (!nearDevGovGigsWidgetsAccountId) {
  nearDevGovGigsWidgetsAccountId = "devhub.efiz.testnet";
}
if (!nearDevGovGigsContractAccountId) {
  nearDevGovGigsContractAccountId = "previewthomas.testnet";
}

// This is our navigation, rendering the page based on the page parameter
function Page() {
  switch (page) {
    // ?page=home
    case "home": {
      return <p>Homepage</p>;
    }
    // ?page=communities
    case "communities": {
      return (
        // It would be nice if we gave providers
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.pages.Communities`}
          props={{ nearDevGovGigsWidgetsAccountId, nearDevGovGigsContractAccountId, ...passProps }}
        />
      );
    }
    // ?page=community
    case "community": {
      return (
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.pages.Community`}
          props={{ nearDevGovGigsWidgetsAccountId, nearDevGovGigsContractAccountId, ...passProps }}
        />
      );
    }
    // ?page=feed
    case "feed": {
      return (
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.Feed`}
          props={{ nearDevGovGigsWidgetsAccountId, nearDevGovGigsContractAccountId, ...passProps }}
        />
      );
    }
  } // default case does not work in VM
  // If no page is found, we return a 404
  return <p>404</p>;
}

return (
  <Theme>
    <AppLayout page={page}>
      <Page />
    </AppLayout>
  </Theme>
);
