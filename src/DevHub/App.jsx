/**
 * This is our entry point to the DevHub App
 * All subsideriery routes are determined by the parameters passed by props
 * No more long Widget names!!
 */

const { page, ...passProps } = props;

if (!page) {
  page = "home";
}

// We pull in our AppLayout as a module, since it is stateless (we don't need a widget)
const { AppLayout } = VM.require(
  "devhub.efiz.testnet/widget/DevHub.components.templates.AppLayout"
);
if (!AppLayout) {
  return <p>Loading...</p>;
}

// This can hold our font or other thematic styles
const Theme = styled.div`
  a {
    color: inherit;
  }
`;

// This is our navigation, rendering the page based on the page parameter
function Page() {
  switch (page) {
    case "home": {
      return <p>Homepage</p>;
    }
    case "communities": {
      return (
        <Widget
          src="devhub.efiz.testnet/widget/DevHub.pages.Communities"
          props={passProps}
        />
      );
    }
    case "community": {
      return (
        <Widget
          src="devhub.efiz.testnet/widget/DevHub.pages.Community"
          props={passProps}
        />
      );
    }
    case "feed": {
      return (
        <Widget
          src="devhub.efiz.testnet/widget/gigs-board.pages.Feed"
          props={passProps}
        />
      );
    }
  }
}

return (
  <Theme>
    <AppLayout page={page}>
      <Page />
    </AppLayout>
  </Theme>
);
