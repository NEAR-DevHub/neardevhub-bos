const CommunityInformationSchema = {
  name: {
    inputProps: {
      min: 2,
      max: 30,
      placeholder: "Community name.",
      required: true,
    },

    label: "Name",
    order: 1,
  },

  description: {
    inputProps: {
      min: 2,
      max: 60,

      placeholder:
        "Describe your community in one short sentence that will appear in the communities discovery page.",

      required: true,
    },

    label: "Description",
    order: 2,
  },

  handle: {
    inputProps: {
      min: 2,
      max: 40,

      placeholder:
        "Choose unique URL handle for your community. Example: zero-knowledge.",

      required: true,
    },

    label: "URL handle",
    order: 3,
  },

  tag: {
    inputProps: {
      min: 2,
      max: 30,

      placeholder:
        "Any posts with this tag will show up in your community feed.",

      required: true,
    },

    label: "Tag",
    order: 4,
  },
};

const { data, onSubmit, onCancel, setIsActive, isActive } = props;

function handleOnSubmit(v) {
  onSubmit(v);
  setIsActive(false);
}

return (
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.components.organism.Configurator"}
    props={{
      externalState: data,
      schema: CommunityInformationSchema,
      onSubmit: handleOnSubmit,
      isActive: isActive,
      onCancel: onCancel,
    }}
  />
);
