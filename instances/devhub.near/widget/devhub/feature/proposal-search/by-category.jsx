const options = [
  {
    label: "All",
    value: "",
  },
  {
    label: "DevDAO Operations",
    value: "DevDAO Operations",
  },
  {
    label: "DevDAO Platform",
    value: "DevDAO Platform",
  },
  {
    label: "Events & Hackathons",
    value: "Events & Hackathons",
  },
  {
    label: "Engagement & Awareness",
    value: "Engagement & Awareness",
  },
  {
    label: "Decentralized DevRel",
    value: "Decentralized DevRel",
  },
  {
    label: "Universities & Bootcamps",
    value: "Universities & Bootcamps",
  },
  {
    label: "Tooling & Infrastructure",
    value: "Tooling & Infrastructure",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const setSelected = props.onStateChange ?? (() => {});

return (
  <div>
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown"
      props={{
        options: options,
        label: "Category",
        onUpdate: (v) => {
          setSelected(v);
        },
      }}
    />
  </div>
);
