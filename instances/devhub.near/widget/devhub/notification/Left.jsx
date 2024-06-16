const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

if (!props.type) {
  return "Loading ...";
}

const type = props.type.split("/")[1];
const widgetAccountId = props.widgetAccountId;
return props.type ? (
  <>
    {type == "like"
      ? "liked your"
      : type == "reply"
      ? "replied to your"
      : type == "edit"
      ? "edited your"
      : type == "mention"
      ? "mentioned you in their"
      : type}
    {props.proposal ? (
      <a
        className="fw-bold text-muted"
        href={href({
          widgetSrc: `${widgetAccountId}/widget/app`,
          params: {
            page: "proposal",
            id: props.proposal,
          },
        })}
      >
        proposal
      </a>
    ) : (
      <a
        className="fw-bold text-muted"
        href={href({
          widgetSrc: `${widgetAccountId}/widget/app`,
          params: {
            page: "rfp",
            id: props.rfp,
          },
        })}
      >
        RFP
      </a>
    )}
  </>
) : (
  "Loading ..."
);
