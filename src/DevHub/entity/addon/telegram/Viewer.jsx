const { telegram_handles } = props;

if (!telegram_handles || telegram_handles.length === 0) {
  return <p>No telegram configured!</p>; // Link to configuration
} else {
  return (
    <div>
      {(telegram_handles || []).map((tg) => (
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
