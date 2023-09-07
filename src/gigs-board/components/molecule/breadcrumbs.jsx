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

const Breadcrumbs = ({ classNames, path }) => (
  <div
    aria-label="breadcrumb"
    className={[
      "d-flex",
      classNames?.root ?? "",
      Array.isArray(path) ? "" : "d-none",
    ].join(" ")}
    style={{ backgroundColor: "#181818" }}
  >
    <ol className="breadcrumb d-flex align-items-end m-0 h-100">
      {(path ?? []).map(({ isActive, isHidden, label, pageId, params }) => (
        <li
          aria-current="page"
          className={[
            "breadcrumb-item d-flex",
            isActive ? "active" : "",
            isHidden ? "d-none" : "",
          ].join(" ")}
        >
          <a
            className={["pb-1 lh-1 text-white", classNames?.link ?? ""].join(
              " "
            )}
            href={href(pageId, params ?? {})}
            style={{ fontWeight: 420 }}
          >
            {label}
          </a>
        </li>
      ))}
    </ol>
  </div>
);

return Breadcrumbs(props);
