const options = [
  { label: "All", value: "" },
  { label: "Most recent", value: "id_desc" }, // proposal_id desc
  { label: "Oldest", value: "id_asc" }, // proposal_id desc
  { label: "Recently updated", value: "ts_desc" }, // timestamp desc
  { label: "Least recently updated", value: "ts_asc" }, // timestamp asc
];

const setSelected = props.onStateChange ?? (() => {});

return (
  <div>
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown"
      props={{
        options: options,
        label: "Sort",
        selectedValue: options[0],
        onUpdate: (v) => {
          setSelected(v);
        },
      }}
    />
  </div>
);
