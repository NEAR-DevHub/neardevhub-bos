/* INCLUDE: "common.jsx" */
function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${REPL_DEVHUB}/widget/devhub.page.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

return props.post === undefined ? (
  "Loading ..."
) : (
  <>
    <a className="btn btn-outline-dark" href={href("post", { id: props.post })}>
      View DevHub post
    </a>
  </>
);
