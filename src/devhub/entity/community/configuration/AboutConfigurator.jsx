const CommunityAboutSchema = {
  bio_markdown: {
    format: "markdown",

    inputProps: {
      min: 3,
      max: 200,

      placeholder:
        "Tell people about your community. This will appear on your community’s homepage.",

      resize: "none",
    },

    label: "Bio",
    multiline: true,
    order: 1,
  },

  twitter_handle: {
    inputProps: { prefix: "https://twitter.com/", min: 2, max: 60 },
    label: "Twitter",
    order: 2,
  },

  github_handle: {
    inputProps: { prefix: "https://github.com/", min: 2, max: 60 },
    label: "Github",
    order: 3,
  },

  telegram_handle: {
    inputProps: { prefix: "https://t.me/", min: 2, max: 60 },
    format: "comma-separated",
    label: "Telegram",
    order: 4,
  },

  website_url: {
    inputProps: { prefix: "https://", min: 2, max: 60 },
    label: "Website",
    order: 5,
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
      schema: CommunityAboutSchema,
      onSubmit: handleOnSubmit,
      isActive,
      onCancel: onCancel,
    }}
  />
);
