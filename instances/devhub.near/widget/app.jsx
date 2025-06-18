/**
 * This is the main entry point for the DevHub application.
 * Page route gets passed in through params, along with all other page props.
 */

const { onDraftStateChange } = VM.require(
  "${REPL_DEVHUB}/widget/devhub.entity.post.draft"
);

const { page, ...passProps } = props;

// Import our modules
const { AppLayout } = VM.require(
  "${REPL_DEVHUB}/widget/devhub.components.templates.AppLayout"
);

const { CssContainer } = VM.require("${REPL_DEVHUB}/widget/config.css");
const { Theme } = VM.require("${REPL_DEVHUB}/widget/config.theme");

if (!AppLayout || !Theme || !CssContainer) {
  return <p>Loading modules...</p>;
}

if (!page) {
  // If no page is specified, we default to the feed page TEMP
  page = "home";
}

// Track visits

if ("${REPL_POSTHOG_API_KEY}".length === 47) {
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
        api_key: "${REPL_POSTHOG_API_KEY}",
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
          src="${REPL_DEVHUB}/widget/devhub.page.home"
          props={passProps}
        />
      );
    }
    // ?page=communities
    case "communities": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.communities"}
          props={passProps}
        />
      );
    }
    case "announcements": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.announcements"}
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
          src={"${REPL_DEVHUB}/widget/devhub.entity.community.Provider"}
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
                        "${REPL_DEVHUB}/widget/devhub.page.community.configuration"
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
                      src={"${REPL_DEVHUB}/widget/devhub.page.community.index"}
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
    // ?page=create
    case "create": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.entity.post.PostEditor"}
          props={{ ...passProps, isCreatePostPage: true, onDraftStateChange }}
        />
      );
    }

    case "create-proposal": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.proposals"}
          props={{ ...passProps, instance: "devhub.near" }}
        />
      );
    }

    case "proposals": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.proposals"}
          props={{ ...passProps, instance: "devhub.near" }}
        />
      );
    }
    case "proposal": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Proposal"}
          props={{ ...passProps, instance: "devhub.near" }}
        />
      );
    }
    // ?page=about
    case "about": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.about"}
          props={passProps}
        />
      );
    }
    case "contribute": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.contribute"}
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
    // ?page=blog
    case "blog": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.blog"}
          props={passProps}
        />
      );
    }
    case "blogv2": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.blogv2"}
          props={passProps}
        />
      );
    }
    case "post": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.post"}
          props={passProps}
        />
      );
    }
    case "admin": {
      return (
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.page.admin.index"}
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
