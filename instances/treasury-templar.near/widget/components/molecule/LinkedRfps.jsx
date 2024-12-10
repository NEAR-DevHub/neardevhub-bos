const { readableDate } = VM.require(
  `${REPL_DEVHUB}/widget/core.lib.common`
) || { readableDate: () => {} };

const { href } = VM.require(`${REPL_DEVHUB}/widget/core.lib.url`) || {
  href: () => {},
};

const linkedRfpIds = props.linkedRfpIds ?? [];
const linkedRfpsData = [];

linkedRfpIds.map((item) => {
  const data = Near.view("${REPL_TREASURY_TEMPLAR_CONTRACT}", "get_rfp", {
    rfp_id: item,
  });
  if (data !== null) {
    linkedRfpsData.push(data);
  }
});

const Container = styled.div`
  a {
    &:hover {
      text-decoration: none !important;
    }
  }
`;

return (
  <Container className="d-flex flex-column gap-3">
    {linkedRfpsData.map((item) => {
      return (
        <a
          href={href({
            widgetSrc: `${REPL_TREASURY_TEMPLAR}/widget/portal`,
            params: {
              page: "rfp",
              id: item.id,
            },
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="d-flex gap-2">
            <img src={"${REPL_RFP_IMAGE}"} height={40} width={40} />
            <div className="d-flex flex-column" style={{ maxWidth: 250 }}>
              <b className="text-truncate">{item.snapshot.name}</b>
              <div className="text-sm text-muted">
                created on {readableDate(item.snapshot.timestamp / 1000000)}
              </div>
            </div>
          </div>
        </a>
      );
    })}
  </Container>
);
