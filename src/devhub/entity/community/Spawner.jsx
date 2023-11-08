const { typeMatch } = VM.require("${REPL_DEVHUB}/widget/core.lib.struct");

if (!typeMatch) {
  return <p>Loading modules...</p>;
}

const { data, onSubmit, onCancel } = props;

const CommunityInputsPartialSchema = {
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
};

const communityInputsValidator = (formValues) =>
  typeMatch(formValues) &&
  Object.values(formValues).every(
    (value) => typeof value === "string" && value.length > 0
  );

const CommunityInputsDefaults = {
  handle: "",
  name: "",
  tag: "",
  description: "",
};

return (
  <Widget
    src={
      "${REPL_DEVHUB_LEGACY}/widget/gigs-board.components.organism.configurator"
    }
    props={{
      heading: "Community information",
      externalState: CommunityInputsDefaults,
      fullWidth: true,
      isActive: true,
      isUnlocked: true,
      isValid: communityInputsValidator,
      onSubmit: onSubmit,
      schema: CommunityInputsPartialSchema,
      submitIcon: {
        type: "bootstrap_icon",
        variant: "bi-rocket-takeoff-fill",
      },
      submitLabel: "Launch",
      onCancel: onCancel,
      nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB_LEGACY}",
    }}
  />
);
