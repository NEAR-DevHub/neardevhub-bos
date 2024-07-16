const options = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Bounty",
    value: "Bounty",
  },
  {
    label: "Bounty booster",
    value: "Bounty booster",
  },
  {
    label: "Hackathon",
    value: "Hackathon",
  },
  {
    label: "Hackbox",
    value: "Hackbox",
  },
  {
    label: "Event sponsorship",
    value: "Event sponsorship",
  },
  {
    label: "Meetup",
    value: "Meetup",
  },
  {
    label: "Travel expenses",
    value: "Travel expenses",
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
