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

const CommunityEditorBasicInfoSection = ({ data, isEditingAllowed }) => {
  return widget("components.organism.form", {
    actionLabelSubmit: data?.handle ? "Save" : "Next",
    heading: "Basic information",
    initialState: data,
    isMutable: isEditingAllowed,
    onSubmit: () => null,

    fieldsRender: ({ formState, formUpdate, isEditorActive, isMutable }) => (
      <>
        {!isMutable || !isEditorActive ? (
          <div>{formState.name}</div>
        ) : (
          widget("components.molecule.text-input", {
            className: "w-100",
            key: `${formState.handle}-name`,
            label: "Community name",
            onChange: formUpdate({ path: ["name"] }),
            value: formState.name,
          })
        )}

        {!isMutable || !isEditorActive ? (
          <div>{formState.bio}</div>
        ) : (
          widget("components.molecule.text-input", {
            className: "w-100",
            key: `${formState.handle}-bio`,
            label: "Short bio",
            onChange: formUpdate({ path: ["bio"] }),
            value: formState.bio,
          })
        )}

        {!isMutable || !isEditorActive ? (
          <div>{formState.handle}</div>
        ) : (
          widget("components.molecule.text-input", {
            className: "w-100",
            key: `${formState.handle}-handle`,
            label: "Handle",
            onChange: formUpdate({ path: ["handle"] }),
            value: formState.handle,
          })
        )}

        {!isMutable || !isEditorActive ? (
          <div>{formState.tags}</div>
        ) : (
          widget("components.molecule.text-input", {
            className: "w-100",
            key: `${formState.handle}-tags`,
            label: "Tags",
            onChange: formUpdate({ path: ["tags"] }),
            value: formState.tags,
          })
        )}
      </>
    ),
  });
};

return CommunityEditorBasicInfoSection(props);
