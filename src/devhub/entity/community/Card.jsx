const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <></>;
}

const CommunityCard = ({
  format,
  isBannerEnabled,
  metadata,
  ...otherProps
}) => {
  const renderFormat =
    format === "small" || format === "medium" ? format : "small";

  const link = href({
    widgetSrc: "${REPL_DEVHUB}/widget/app",
    params: { page: "community", handle: metadata.handle },
  });

  const formatSmall = (
    <Link
      {...otherProps}
      to={link}
      className={[
        "d-flex flex-shrink-0 p-3",
        "rounded-4 border border-2",
        "text-black text-decoration-none attractable",
      ].join(" ")}
      style={{
        background: isBannerEnabled
          ? `center / cover no-repeat url(${metadata.banner_url})`
          : "#ffffff",
        width: 400,
        height: 110,
      }}
    >
      <div
        className="d-flex align-items-center gap-3 rounded-4 w-100 h-100"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <img
          alt="Community logo"
          className="flex-shrink-0 rounded-circle attractable"
          height={70}
          src={metadata.logo_url}
          width={70}
        />

        <div className="d-flex flex-column justify-content-center gap-1 w-100">
          <h5
            className="h5 m-0 text-nowrap overflow-hidden"
            style={{ textOverflow: "ellipsis" }}
          >
            {metadata.name}
          </h5>

          <p
            className="card-text text-secondary overflow-hidden"
            style={{ fontSize: 12, textOverflow: "ellipsis" }}
          >
            {metadata.description}
          </p>
        </div>
      </div>
    </Link>
  );

  const formatMedium = (
    <Link
      className="card d-flex flex-column flex-shrink-0 text-decoration-none text-reset attractable"
      to={link}
      style={{ width: "23%", maxWidth: 304 }}
    >
      <div
        className="card-img-top w-100"
        style={{
          background: `center / cover no-repeat url(${metadata.banner_url})`,
          height: 164,
        }}
      />

      <div className="d-flex flex-column gap-2 p-3 card-text">
        <h5 class="h5 m-0">{metadata.name}</h5>
        <span class="text-secondary text-wrap">{metadata.description}</span>
      </div>
    </Link>
  );

  return {
    small: formatSmall,
    medium: formatMedium,
  }[renderFormat];
};

return CommunityCard(props);
