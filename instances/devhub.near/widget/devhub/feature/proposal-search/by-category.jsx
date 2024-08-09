const categoryOptions = props.categoryOptions ?? [];

const setSelected = props.onStateChange ?? (() => {});

const allOption = [{ label: "All", value: "" }];
const options = categoryOptions.map((i) => {
  return { ...i, label: i.title };
});

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.components.molecule.DropDown"
    props={{
      options: allOption.concat(options),
      label: "Category",
      onUpdate: (v) => {
        setSelected(v);
      },
    }}
  />
);
