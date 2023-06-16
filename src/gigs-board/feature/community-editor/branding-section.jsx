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
/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */

const Banner = styled.div`
  border-top-left-radius: var(--bs-border-radius-xl) !important;
  border-top-right-radius: var(--bs-border-radius-xl) !important;
  height: calc(100% - 100px);

  & > div :not(.btn) {
    position: absolute;
    display: none;
    margin: 0 !important;
    width: 0 !important;
    height: 0 !important;
  }

  .btn {
    border: none;
    --bs-btn-color: #ffffff;
    --bs-btn-bg: #087990;
    --bs-btn-border-color: #087990;
    --bs-btn-hover-color: #ffffff;
    --bs-btn-hover-bg: #055160;
    --bs-btn-hover-border-color: #055160;
    --bs-btn-focus-shadow-rgb: 49, 132, 253;
    --bs-btn-active-color: #ffffff;
    --bs-btn-active-bg: #055160;
    --bs-btn-active-border-color: #055160;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
`;

const Logo = styled.div`
  & > div :not(.btn) {
    position: absolute;
    display: none;
    margin: 0 !important;
    width: 0 !important;
    height: 0 !important;
  }

  .btn {
    border: none;
    --bs-btn-color: #ffffff;
    --bs-btn-bg: #087990;
    --bs-btn-border-color: #087990;
    --bs-btn-hover-color: #ffffff;
    --bs-btn-hover-bg: #055160;
    --bs-btn-hover-border-color: #055160;
    --bs-btn-focus-shadow-rgb: 49, 132, 253;
    --bs-btn-active-color: #ffffff;
    --bs-btn-active-bg: #055160;
    --bs-btn-active-border-color: #055160;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
`;

const communityBrandingDefaults = {
  banner_cid: "bafkreic4xgorjt6ha5z4s5e3hscjqrowe5ahd7hlfc5p4hb6kdfp6prgy4",
  logo_cid: "bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu",
};

const CommunityEditorBrandingSection = ({
  data: { description, name, ...data },
  isEditingAllowed,
  onSubmit,
}) => {
  State.init({
    data: {
      banner: {
        cid:
          data.banner_url?.split?.("/")?.at?.(-1) ??
          communityBrandingDefaults.banner_cid,
      },

      logo: {
        cid:
          data.logo_url?.split?.("/")?.at?.(-1) ??
          communityBrandingDefaults.logo_cid,
      },
    },
  });

  onSubmit({
    banner_url: `https://ipfs.near.social/ipfs/${
      state.data.banner.cid ?? communityBrandingDefaults.banner_cid
    }`,

    logo_url: `https://ipfs.near.social/ipfs/${
      state.data.logo.cid ?? communityBrandingDefaults.logo_cid
    }`,
  });

  return (
    <AttractableDiv
      className="card rounded-4 w-100"
      style={{ maxWidth: 896, height: 280 }}
    >
      <Banner
        alt="Community banner preview"
        className="card-img-top d-flex flex-column justify-content-end align-items-end p-4"
        style={{
          background: `center / cover no-repeat url(${data.banner_url})`,
        }}
      >
        {isEditingAllowed ? (
          <IpfsImageUpload image={state.data.banner} />
        ) : null}
      </Banner>

      <Logo
        alt="Community logo preview"
        className={[
          "d-flex flex-column justify-content-center align-items-center",
          "rounded-circle ms-5 border border-4 border-white",
        ].join(" ")}
        style={{
          marginTop: -64,
          width: 128,
          height: 128,
          background: `center / cover no-repeat url(${data.logo_url})`,
        }}
      >
        {isEditingAllowed ? <IpfsImageUpload image={state.data.logo} /> : null}
      </Logo>

      <div
        className="card-body p-4"
        style={{ marginTop: -64, marginLeft: 180, height: 84 }}
      >
        <h5
          className="h5 text-nowrap overflow-hidden"
          style={{ textOverflow: "ellipsis" }}
        >
          {name}
        </h5>
        <p
          className="card-text text-nowrap overflow-hidden"
          style={{ textOverflow: "ellipsis" }}
        >
          {description}
        </p>
      </div>
    </AttractableDiv>
  );
};

return CommunityEditorBrandingSection(props);
