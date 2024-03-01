const options = [
  { label: "Awareness & Engagement", value: "" },
  { label: "Community Groups / Work Groups", value: "" },
  { label: "DevDAO Operations", value: "" },
  { label: "Developer Relations", value: "" },
  { label: "Events & Hackathons", value: "" },
  { label: "Platform", value: "" },
  { label: "Tooling & Infrastructure", value: "" },
  { label: "Universities & Bootcamps", value: "" },
];

const [selected, setSelected] = useState(null);

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
