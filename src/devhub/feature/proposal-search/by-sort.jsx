const options = [
  { label: "Most recent", value: "" }, // proposal_id desc
  { label: "Most viewed", value: "" }, // views desc
  { label: "Most commented", value: "" }, // comments desc
  { label: "Unanswered", value: "" }, // where comments = 0
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
        onUpdate: (v) => {
          setSelected(v);
        },
      }}
    />
  </div>
);
