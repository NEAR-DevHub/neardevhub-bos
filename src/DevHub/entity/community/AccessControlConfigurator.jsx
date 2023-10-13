const CommunityAccessControlSchema = {
  admins: {
    format: "comma-separated",
    inputProps: { required: true },
    label: "Admins",
    order: 1,
  },
};

const communityAccessControlFormatter = ({ admins, ...otherFields }) => ({
  ...otherFields,
  admins: admins.filter((string) => string.length > 0),
});

const { data, onSubmit, onCancel, nearDevGovGigsWidgetsAccountId, setIsActive, isActive } = props;

function handleOnSubmit(v) {
  onSubmit(v);
  setIsActive(false);
}

return (
  <Widget
    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.organism.Configurator`}
    props={{
      externalState: data,
      formatter: communityAccessControlFormatter,
      schema: CommunityAccessControlSchema,
      onSubmit: handleOnSubmit,
      nearDevGovGigsWidgetsAccountId,
      isActive,
      onCancel: onCancel,
    }}
  />
);
