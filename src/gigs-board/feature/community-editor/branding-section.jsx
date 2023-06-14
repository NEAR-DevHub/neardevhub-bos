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
/* INCLUDE: "shared/lib/gui" */
const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }
`;

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const Magnifiable = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "shared/lib/gui" */

const Banner = styled.div`
  border-top-left-radius: var(--bs-border-radius-xl) !important;
  border-top-right-radius: var(--bs-border-radius-xl) !important;
  height: calc(100% - 100px);
`;

const CommunityEditorBrandingSection = ({
  data: { description, name, ...data },
  isEditingAllowed,
  onSubmit,
}) => {
  return widget("components.organism.form", {
    data: {
      banner_url:
        data.banner_url ??
        "https://ipfs.near.social/ipfs/bafkreiaowjqxds24fwcliyriintjd4ucciprii2rdxjmxgi7f5dmzuscey",

      logo_url:
        data.logo_url ??
        "https://ipfs.near.social/ipfs/bafkreiaowjqxds24fwcliyriintjd4ucciprii2rdxjmxgi7f5dmzuscey",
    },

    isMutable: isEditingAllowed,
    noEditorFrame: true,
    onSubmit,

    fieldsRender: ({
      formState: { banner_url, logo_url },
      formUpdate,
      isEditable,
      onFormSubmit,
    }) => (
      <Magnifiable
        className="card rounded-4 w-100"
        style={{ maxWidth: 896, height: 280 }}
      >
        <Banner
          alt="Community banner preview"
          className="card-img-top"
          style={{
            background: `center / cover no-repeat url(${banner_url})`,
          }}
        />

        <img
          alt="Community logo preview"
          class="img-fluid rounded-circle ms-5 border border-4 border-white"
          src={logo_url}
          style={{ marginTop: -64, width: 128, height: 128 }}
        />

        <div
          className="card-body p-4"
          style={{ marginTop: -64, marginLeft: 180, height: 84 }}
        >
          <h5 className="h5">{name}</h5>
          <p className="card-text">{description}</p>
        </div>
      </Magnifiable>
    ),
  });
};

return CommunityEditorBrandingSection(props);
