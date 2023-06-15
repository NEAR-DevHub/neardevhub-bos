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

const CommunitiesPage = () => {
  const data =
    Near.view(nearDevGovGigsContractAccountId, "get_all_communities") ?? [];

  return (
    <div className="d-flex flex-column">
      {widget("components.layout.Banner", { style: { marginBottom: 0 } })}

      <div className="d-flex flex-column gap-4 p-4">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column gap-2">
            <h1 className="m-0 fs-4">Communities</h1>

            <p className="m-0 text-secondary fs-6">
              Discover NEAR developer communities
            </p>
          </div>

          <div className="d-flex flex-column justify-content-center">
            <a className="btn btn-primary" href={href("community.new")}>
              Create community
            </a>
          </div>
        </div>

        <div className="d-flex gap-4">
          {data.map((community) =>
            widget("entity.community.card", community, community.handle)
          )}
        </div>
      </div>
    </div>
  );
};

return CommunitiesPage(props);
