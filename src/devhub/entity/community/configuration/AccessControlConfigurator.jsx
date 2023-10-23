const CommunityAccessControlSchema = {
  admins: {
    format: "comma-separated",
    inputProps: { required: true },
    label: "Admins",
    order: 1,
  },
};

const { data, onSubmit, onCancel, setIsActive, isActive } = props;

function handleOnSubmit(v) {
  if (v.admins) {
    v.admins = v.admins.split(",").map((admin) => admin.trim());
  }
  onSubmit(v);
  setIsActive(false);
}

return (
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.components.organism.Configurator"}
    props={{
      externalState: data,
      schema: CommunityAccessControlSchema,
      onSubmit: handleOnSubmit,
      isActive,
      onCancel: onCancel,
    }}
  />
);
