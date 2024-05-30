const options = [
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
  {
    label: "None",
    value: "",
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
