const options = [
  { label: "Most recent", value: "proposal_id" }, // proposal_id desc
  { label: "Most viewed", value: "views" }, // views desc
  // TODO add track_comments function to devhub to track it in the indexer
  // { label: "Most commented", value: "" }, // comments desc
  // { label: "Unanswered", value: "" }, // where comments = 0
  { label: "None", value: "" }, // where comments = 0
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
