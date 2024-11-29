const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`);
href || (href = () => {});

return (
  <a
    href={href({
      widgetSrc: `${REPL_TREASURY_TEMPLAR}/widget/components.proposals.TermsAndConditions`,
    })}
    className="text-decoration-underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    Templar's Terms and Conditions
  </a>
);
