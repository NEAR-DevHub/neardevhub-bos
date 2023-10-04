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
/* END_INCLUDE: "common.jsx" */

const { data, key, onSubmit, ...props } = props;

const CommunityWikiPageSchema = {
  name: {
    label: "Name",
    order: 1,
  },

  content_markdown: {
    format: "markdown",
    label: "Content",
    multiline: true,
    order: 2,
  },
};

return (
  <>
    {widget("components.organism.addon-configurator", {
      // this is a form generator
      data,
      schema: CommunityWikiPageSchema, // and a schema
      onSubmit, // triggers onSubmit button
      ...props,
    })}
  </>
);
