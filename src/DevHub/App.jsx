/**
 * This is the main entry point for the DevHub application.
 * Page route gets passed in through params, along with all other page props.
 */

const {
  page,
  ...passProps
} = props;

// Import our modules
const { AppLayout } = VM.require(
  "${REPL_DEVHUB}/widget/DevHub.components.templates.AppLayout"
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

if (!page) {
  // If no page is specified, we default to the home page
  page = "feed";
}

// This is our navigation, rendering the page based on the page parameter
function Page() {
  const routes = page.split(".");
  switch (routes[0]) {
    // ?page=home
    case "home": {
      return <p>Homepage</p>;
    }
    // ?page=communities
    case "communities": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/DevHub.pages.communities"}
          props={passProps}
        />
      );
    }
    // ?page=community
    case "community": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/DevHub.entity.community.Provider"}
          props={{
            ...passProps,
            Children: (p) => {
              switch (routes[1]) {
                // ?page=community.configuration
                case "configuration": {
                  return (
                    <Widget
                      src={"${REPL_DEVHUB}/widget/DevHub.pages.community.configuration"}
                      props={{
                        ...passProps,
                        ...p,
                      }}
                    />
                  );
                }
              }
              // ?page=community
              return (
                <Widget
                  src={"${REPL_DEVHUB}/widget/DevHub.pages.community.index"}
                  props={{
                    ...passProps,
                    ...p,
                  }}
                />
              );
            },
          }}
        />
      );
    }
    // ?page=feed
    case "feed": {
      // TODO: This needs to be updated, old widget has the header attached
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/DevHub.pages.feed"}
          props={{
            ...passProps,
          }}
        />
      );
    }
  } // default case does not work in VM
  // If no page is found, we return a 404
  return <p>404</p>;
}

return (
  <Theme>
    <AppLayout
      page={page}
    >
      <Page />
    </AppLayout>
  </Theme>
);
