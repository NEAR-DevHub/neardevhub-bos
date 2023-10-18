/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */

const CommunityCard = ({
  actions,
  format,
  isBannerEnabled,
  metadata,
  ...otherProps
}) => {
  const renderFormat =
    format === "small" || format === "medium" ? format : "small";

  const link = href("community.activity", { handle: metadata.handle });

  const formatSmall = (
    <AttractableDiv
      {...otherProps}
      className={[
        "d-flex flex-shrink-0 gap-3 p-3 rounded-4 border border-2",
        "text-black text-decoration-none",
      ].join(" ")}
      style={{
        background:
          isBannerEnabled ?? false
            ? `center / cover no-repeat url(${metadata.banner_url})`
            : "#ffffff",

        width: 400,
        height: 110,
      }}
    >
      <a
        className={[
          "d-flex align-items-center gap-3 rounded-4 w-100 h-100",
          "text-dark text-decoration-none",
        ].join(" ")}
        href={link}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <AttractableImage
          alt="Community logo"
          className="flex-shrink-0 rounded-circle"
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
      </a>

      {actions}
    </AttractableDiv>
  );

  const formatMedium = (
    <AttractableLink
      className="card d-flex flex-column flex-shrink-0 text-decoration-none text-reset"
      href={link}
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
    </AttractableLink>
  );

  return {
    small: formatSmall,
    medium: formatMedium,
  }[renderFormat];
};

return CommunityCard(props);
