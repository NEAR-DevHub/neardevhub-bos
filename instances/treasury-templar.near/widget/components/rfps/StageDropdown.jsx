const { RFP_TIMELINE_STATUS } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/core.common`
) || { RFP_TIMELINE_STATUS: {} };

const setSelected = props.onStateChange ?? (() => {});

const timelineStatusArray = Object.entries(RFP_TIMELINE_STATUS).map(
  ([key, value]) => ({
    label: key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
    value,
  })
);
timelineStatusArray.unshift({ label: "All", value: null });
return (
  <div>
    <Widget
      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown`}
      props={{
        options: timelineStatusArray,
        label: "Timeline",
        onUpdate: (v) => {
          setSelected(v);
        },
      }}
    />
  </div>
);
