const options = [
  { label: "Draft", value: "" },
  { label: "Review", value: "" },
  { label: "Approved", value: "" },
  { label: "Approved  - Conditional", value: "" },
  { label: "Rejected", value: "" },
  { label: "Canceled", value: "" },
  { label: "Payment Processing", value: "" },
  { label: "Funded", value: "" },
];

const [selected, setSelected] = useState(null);

return (
  <div>
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown"
      props={{
        options: options,
        label: "Stage",
        onUpdate: (v) => {
          setSelected(v);
        },
      }}
    />
  </div>
);
