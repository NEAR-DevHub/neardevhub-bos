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

const Breadcrumbs = ({ classNames, path }) =>
  (path ?? null) === null ? (
    <></>
  ) : (
    <div
      aria-label="breadcrumb"
      className={["d-flex align-items-end", classNames?.root ?? ""].join(" ")}
      style={{ backgroundColor: "#181818" }}
    >
      <ol className="breadcrumb m-0">
        {path.map(({ isActive, label, pageId, params }) => (
          <li
            aria-current="page"
            className={["breadcrumb-item", isActive ? "active" : ""].join(" ")}
          >
            <a
              className={["m-0 text-white", classNames?.link ?? ""].join(" ")}
              href={href(pageId, params ?? {})}
              style={{ fontWeight: "normal" }}
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );

return Breadcrumbs(props);
