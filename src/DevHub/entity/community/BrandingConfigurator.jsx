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
    padding: 0.5rem 0.75rem !important;
    min-height: 32;
    line-height: 1;

    border: none;
    border-radius: 50px;
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
    opacity: 0.8;

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
    padding: 0.5rem 0.75rem !important;
    min-height: 32;
    line-height: 1;

    border: none;
    border-radius: 50px;
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
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
`;

const cidToURL = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

const { data, onSubmit, hasConfigurePermissions, link } = props;

const initialInput = { banner: null, logo: null };

const initialValues = {
  banner: { cid: data.banner_url.split("/").at(-1) },
  logo: { cid: data.logo_url.split("/").at(-1) },
};

State.init({
  input: initialInput,
});

const hasUnsubmittedChanges = Object.values(state.input).some(
  (value) => value !== null
);

const isSynced = state.input === initialValues;

if (hasUnsubmittedChanges && !isSynced) {
  onSubmit({
    banner_url: cidToURL(state.input.banner?.cid ?? initialValues.banner.cid),
    logo_url: cidToURL(state.input.logo?.cid ?? initialValues.logo.cid),
  });

  State.update((lastKnownState) => ({
    ...lastKnownState,
    input: initialInput,
  }));
}

return (
  <div style={{ height: 280 }}>
    <Banner
      alt="Community banner preview"
      className="card-img-top d-flex flex-column justify-content-end align-items-end p-4"
      style={{
        background: `center / cover no-repeat url(${cidToURL(
          initialValues.banner.cid
        )})`,
      }}
    >
      {hasConfigurePermissions && (
        <IpfsImageUpload image={state.input.banner} />
      )}
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

        background: `center / cover no-repeat url(${cidToURL(
          initialValues.logo.cid
        )})`,
      }}
    >
      {hasConfigurePermissions && <IpfsImageUpload image={state.input.logo} />}
    </Logo>

    <div
      className="card-body p-4"
      style={{ marginTop: -64, marginLeft: 180, height: 84 }}
    >
      <h5
        className="h5 text-nowrap overflow-hidden"
        style={{ textOverflow: "ellipsis" }}
      >
        {typeof link === "string" && link.length > 0 ? (
          <Link to={link}>{data.name}</Link>
        ) : (
          data.name
        )}
      </h5>

      <p
        className="card-text text-nowrap overflow-hidden"
        style={{ textOverflow: "ellipsis" }}
      >
        {data.description}
      </p>
    </div>
  </div>
);
