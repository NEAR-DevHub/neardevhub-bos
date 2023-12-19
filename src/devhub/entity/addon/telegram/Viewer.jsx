const { handles } = props;

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p) => p.height ?? "100%"};
`;

if (!handles || handles.length === 0) {
  return (
    <CenteredMessage height={"384px"}>
      <h2>No Telegram Configured</h2>
    </CenteredMessage>
  );
} else {
  return (
    <div>
      {(handles || []).map((tg) => {
        const pattern = /https:\/\/t.me\/(.*)/;
        const includesHttp = tg.match(pattern);
        const handle = includesHttp ? includesHttp[1] : tg;
        return (
          <>
            <iframe
              iframeResizer
              src={
                "https://j96g3uepe0.execute-api.us-east-1.amazonaws.com/groups-ui/" +
                handle
              }
              frameborder="0"
              // width and minWidth required by iframeResizer
              style={{
                width: "1px",
                minWidth: "100%",
                marginTop: "20px",
              }}
            ></iframe>

            <a href={includesHttp ? tg : "https://t.me/" + tg} target="_blank">
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
                props={{
                  classNames: { root: "btn-primary" },
                  label: "View More",
                }}
              />
            </a>
          </>
        );
      })}
    </div>
  );
}
