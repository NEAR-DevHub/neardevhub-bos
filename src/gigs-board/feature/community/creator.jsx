const CommunityInputsDefaults = {
  handle: null,
  name: "",
  description: "",
  tag: "",

  bio_markdown:
    "This is a sample text about your community. Edit this text on the community configuration page.",

  logo_url:
    "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu",

  banner_url:
    "https://ipfs.near.social/ipfs/bafkreic4xgorjt6ha5z4s5e3hscjqrowe5ahd7hlfc5p4hb6kdfp6prgy4",
};

const CommunityInputsSchema = {
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
      max: 20,

      placeholder:
        "Any posts with this tag will show up in your community feed.",

      required: true,
    },

    label: "Tag",
    order: 4,
  },
};

const CommunityCreator = () => {
  return widget("components.organism.configurator", {
    heading: "Basic information and settings",
    data: CommunityInputsDefaults,
    formatter: metadataFormatter,
    isUnlocked: Viewer.communityPermissions({ handle }).can_configure,
    onChangesSubmit: sectionSubmit,
    schema: CommunityMetadataSchema,
    submitLabel: "Accept",
  });
};

return CommunityCreator(props);
