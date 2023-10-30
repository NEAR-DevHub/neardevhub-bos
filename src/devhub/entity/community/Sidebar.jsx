const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

const { community } = props;

function trimHttps(url) {
  if (url.startsWith("https://")) {
    return url.substring(8);
  }
  return url;
}

const CommunitySummary = () => {
  const socialLinks = [
    ...((community.website_url?.length ?? 0) > 0
      ? [
          {
            href: `https://${trimHttps(community.website_url)}`,
            iconClass: "bi bi-globe",
            name: trimHttps(community.website_url),
          },
        ]
      : []),

    ...((community.github_handle?.length ?? 0) > 0
      ? [
          {
            href: `https://github.com/${community.github_handle}`,
            iconClass: "bi bi-github",
            name: community.github_handle,
          },
        ]
      : []),

    ...((community.twitter_handle?.length ?? 0) > 0
      ? [
          {
            href: `https://twitter.com/${community.twitter_handle}`,
            iconClass: "bi bi-twitter",
            name: community.twitter_handle,
          },
        ]
      : []),

    ...(community.telegram_handle.length > 0
      ? community.telegram_handle.map((telegram_handle) => ({
          href: `https://t.me/${telegram_handle}`,
          iconClass: "bi bi-telegram",
          name: telegram_handle,
        }))
      : []),
  ];

  return (
    <>
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownViewer"}
        props={{
          text: community.bio_markdown,
        }}
      />
      <small class="text-muted mb-3">
        <Link
          to={href({
            widgetSrc: "${REPL_DEVHUB}/widget/app",
            params: { page: "feed", tag: communityData.tag },
          })}
        >
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
            props={{ tag: community.tag }}
          />
        </Link>
      </small>

      <div className="mt-3">
        {socialLinks.map((link, index) => (
          <a
            className={`mt-1 btn-outline-light text-reset border-0 d-flex align-items-center`}
            href={link.href}
            style={{ marginLeft: index !== 0 ? "0px" : "0px" }}
            key={link.href}
            target="_blank"
          >
            <i className={link.iconClass}></i>
            <span
              className="ms-1"
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </>
  );
};

return community === null ? (
  <div>Loading...</div>
) : (
  <div class="d-flex flex-column align-items-end">
    <Widget
      // TODO: LEGACY.
      src={"${REPL_DEVHUB}/widget/gigs-board.components.molecule.tile"}
      props={{
        fullWidth: true,
        minHeight: 0,
        noBorder: true,
        borderRadius: "rounded",
        children: <CommunitySummary />,
      }}
    />
    <hr style={{ width: "100%", borderTop: "1px solid #00000033" }} />

    <Widget
      // TODO: LEGACY.
      src={"${REPL_DEVHUB}/widget/gigs-board.components.molecule.tile"}
      props={{
        heading: "Admins",

        children: (community?.admins ?? []).map((accountId) => (
          <div key={accountId} className="d-flex" style={{ fontWeight: 500 }}>
            <Widget
              // TODO: LEGACY.
              src={
                "${REPL_DEVHUB}/widget/gigs-board.components.molecule.profile-card"
              }
              props={{ accountId }}
            />
          </div>
        )),

        fullWidth: true,
        minHeight: 0,
        noBorder: true,
        borderRadius: "rounded",
        style: { overflowX: "scroll" },
      }}
    />
  </div>
);
