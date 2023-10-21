const { telegram_handle } = props;

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

if (!telegram_handle || telegram_handle.length === 0) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>No Telegram Configured</h2>
    </CenteredMessage>
  );
} else {
  return (
    <div>
      {(telegram_handle || []).map((tg) => (
        <>
          <iframe
            iframeResizer
            src={
              "https://j96g3uepe0.execute-api.us-east-1.amazonaws.com/groups-ui/" +
              tg
            }
            frameborder="0"
            // width and minWidth required by iframeResizer
            style={{
              width: "1px",
              minWidth: "100%",
              marginTop: "20px",
            }}
          ></iframe>

          <a href={"https://t.me/" + tg} target="_blank">
            <Widget
              src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
              props={{
                classNames: { root: "btn-primary" },
                label: "View More",
              }}
            />
          </a>
        </>
      ))}
    </div>
  );
}
