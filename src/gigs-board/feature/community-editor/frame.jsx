/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "shared/lib/record" */
const pick = (object, subsetKeys) =>
  Object.fromEntries(
    Object.entries(object ?? {}).filter(([key, _]) => subsetKeys.includes(key))
  );
/* END_INCLUDE: "shared/lib/record" */

const communityDefaults = {
  moderators: [],
};

const CommunityEditorFrame = ({ handle }) => {
  State.init({
    isCommunityNew: true,
    data: null,
  });

  console.log(state.data);

  if (typeof handle === "string" && state.data === null) {
    /**
     * !TODO: get community data and update state only if it exists
     * ! otherwise, set data to null
     **/
    const data = null;

    State.update((lastKnownState) => ({
      ...lastKnownState,
      data,
      isCommunityNew: false,
    }));
  } else if (state.data === null) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      data: communityDefaults,
      isCommunityNew: true,
    }));
  }

  const isEditingAllowed = true; // According to user permission level

  const onSubformSubmit = (partial) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      data: { ...lastKnownState.data, ...partial },
    }));

  const onSubmit = () => {};

  return (
    <div className="d-flex flex-column align-items-center gap-4 p-4">
      {state.data !== null ? (
        <>
          {widget("feature.community-editor.branding-section", {
            data: state.data,
            isEditingAllowed,
            onSubmit: onSubformSubmit,
          })}

          {widget("components.organism.form", {
            classNames: { submitAdornment: "bi-arrow-down-circle-fill" },
            data: state.data,
            heading: "Basic information",
            isMutable: isEditingAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: state.isCommunityNew ? "Next" : "Save",

            schema: {
              name: {
                inputProps: { max: 30 },
                label: "Name",
                order: 1,
              },

              description: {
                inputProps: {
                  max: 60,

                  placeholder:
                    "Describe your community in one short sentence that will appear in the discovery communities page.",
                },

                label: "Description",
                order: 2,
              },

              handle: {
                inputProps: {
                  max: 40,

                  placeholder:
                    "Choose unique URL handle for your community by adding letters and numbers. Example: zero-knowledge.",
                },

                label: "Handle",
                order: 3,
              },

              tag: {
                inputProps: {
                  max: 20,

                  placeholder:
                    "Choose one tag for your community. Any posts with this tag will show up in your community feed.",
                },

                label: "Tag",
                order: 4,
              },
            },
          })}

          {widget("components.organism.form", {
            classNames: { submitAdornment: "bi-arrow-down-circle-fill" },
            data: state.data,
            heading: "About",
            isMutable: isEditingAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: state.isCommunityNew ? "Next" : "Save",

            schema: {
              bio: {
                inputProps: {
                  max: 200,

                  placeholder:
                    "Tell more about your community. This will appear in the About section of your community’s homepage.",
                },

                label: "Bio",
                order: 1,
              },

              twitter_handle: {
                inputProps: { max: 30 },
                label: "Twitter",
                order: 2,
              },

              github_handle: {
                inputProps: { max: 30 },
                label: "Github",
                order: 3,
              },

              telegram_handle: {
                inputProps: { max: 30 },
                label: "Telegram",
                order: 4,
              },

              website_url: {
                inputProps: { max: 40 },
                label: "Website",
                order: 5,
              },
            },
          })}

          {widget("components.organism.form", {
            classNames: { submitAdornment: "bi-arrow-down-circle-fill" },
            data: state.data,
            heading: "Permissions",
            isMutable: isEditingAllowed,
            onSubmit: onSubformSubmit,
            submitLabel: state.isCommunityNew ? "Next" : "Save",

            schema: {
              owner: {
                inputProps: { max: 100 },
                label: "Owner",
                order: 1,
              },

              moderators: {
                label: "Moderators",
                order: 2,
              },
            },
          })}

          <div
            className="d-flex justify-content-center pb-4 w-100"
            style={{ maxWidth: 896 }}
          >
            {state.isCommunityNew
              ? widget("components.atom.button", {
                  classNames: { root: "btn-success" },
									disabled: true,
                  label: "🚀 Launch ( coming soon! )",
                  onClick: onSubmit,
                })
              : null}

            {!state.isCommunityNew
              ? widget("components.atom.button", {
                  classNames: { root: "btn-outline-danger border-none" },
                  disabled: true,
                  label: "☢️ Delete community",
                  onClick: () => {},
                })
              : null}
          </div>
        </>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h2 className="h2">Community doesn't exist.</h2>
        </div>
      )}
    </div>
  );
};

return CommunityEditorFrame(props);
