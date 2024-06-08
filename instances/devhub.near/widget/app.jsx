/**
 * This is the main entry point for the DevHub application.
 * Page route gets passed in through params, along with all other page props.
 */

const { onDraftStateChange } = VM.require(
  "${alias_REPL_DEVHUB}/widget/devhub.entity.post.draft"
);

const { page, ...passProps } = props;

// Import our modules
const { AppLayout } = VM.require(
  "${alias_REPL_DEVHUB}/widget/devhub.components.templates.AppLayout"
);

if (!AppLayout) {
  return <p>Loading modules...</p>;
}

// CSS styles to be used across the app.
// Define fonts here, as well as any other global styles.
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
  // If no page is specified, we default to the feed page TEMP
  page = "home";
}

// Track visits

if ("${alias_REPL_POSTHOG_API_KEY}".length === 47) {
  useEffect(() => {
    const hashedUserId = context.accountId
      ? Array.from(nacl.hash(Buffer.from(context.accountId)))
          .map((b) => ("00" + b.toString(16)).slice(-2))
          .join("")
      : "unauthenticated";

    fetch("https://eu.posthog.com/capture/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },

      body: JSON.stringify({
        api_key: "${alias_REPL_POSTHOG_API_KEY}",
        event: "devhub_pageview",
        properties: {
          distinct_id: hashedUserId,
          page,
          ...props,
        },
        timestamp: new Date().toISOString(),
      }),
    });
  }, [props]);
}

// This is our navigation, rendering the page based on the page parameter
function Page() {
  const routes = page.split(".");
  switch (routes[0]) {
    case "home": {
      return (
        <Widget
          src="${alias_REPL_DEVHUB}/widget/devhub.page.home"
          props={passProps}
        />
      );
    }
    // ?page=communities
    case "communities": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.communities"}
          props={passProps}
        />
      );
    }
    case "announcements": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.announcements"}
          props={passProps}
        />
      );
    }

    // ?page=community
    case "community": {
      return (
        // Considering to consolidate this into a single widget,
        // where each level handles its own routing.
        // Modularizing a page just like we do with addons
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.entity.community.Provider"}
          props={{
            ...passProps,
            Children: (p) => {
              // passing props from the Provider into the Children
              switch (routes[1]) {
                // ?page=community.configuration
                case "configuration": {
                  return (
                    <Widget
                      src={
                        "${alias_REPL_DEVHUB}/widget/devhub.page.community.configuration"
                      }
                      props={{
                        ...passProps,
                        ...p,
                      }}
                    />
                  );
                }
                // ?page=community
                default: {
                  return (
                    <Widget
                      src={
                        "${alias_REPL_DEVHUB}/widget/devhub.page.community.index"
                      }
                      props={{
                        ...passProps,
                        ...p,
                      }}
                    />
                  );
                }
              }
            },
          }}
        />
      );
    }
    // ?page=feed
    case "feed": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.feed"}
          props={passProps}
        />
      );
    }
    // ?page=create
    case "create": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.entity.post.PostEditor"}
          props={{ ...passProps, isCreatePostPage: true, onDraftStateChange }}
        />
      );
    }

    case "create-proposal": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.entity.proposal.Editor"}
          props={{ ...passProps }}
        />
      );
    }

    case "proposals": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.proposals"}
          props={passProps}
        />
      );
    }
    case "proposal": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.entity.proposal.Proposal"}
          props={passProps}
        />
      );
    }
    // ?page=about
    case "about": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.about"}
          props={passProps}
        />
      );
    }
    case "contribute": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.contribute"}
          props={passProps}
        />
      );
    }
    case "profile": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.profile"}
          props={passProps}
        />
      );
    }
    // ?page=blog
    case "blog": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.blog"}
          props={passProps}
        />
      );
    }
    case "blogv2": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.blogv2"}
          props={passProps}
        />
      );
    }
    case "post": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.post"}
          props={passProps}
        />
      );
    }
    case "admin": {
      return (
        <Widget
          src={"${alias_REPL_DEVHUB}/widget/devhub.page.admin.index"}
          props={passProps}
        />
      );
    }
    default: {
      // TODO: 404 page
      return <p>404</p>;
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
