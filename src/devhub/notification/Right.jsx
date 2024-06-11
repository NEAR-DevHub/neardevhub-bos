const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const widgetAccountId = props.widgetAccountId;
return props.proposal === undefined ? (
  "Loading ..."
) : (
  <>
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
);
