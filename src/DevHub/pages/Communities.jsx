const CommunityInputsDefaults = {
  handle: "",
  name: "",
  tag: "",
  description: "",
};

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

// const communityInputsValidator = (formValues) =>
//   Struct.typeMatch(formValues) &&
//   Object.values(formValues).every(
//     (value) => typeof value === "string" && value.length > 0
//   );

const onCommunitySubmit = (inputs) =>
  Near.call(devHubAccountId, "create_community", {
    inputs: {
      ...inputs,

      bio_markdown: [
        "This is a sample text about your community.",
        "You can change it on the community configuration page.",
      ].join("\n"),

      logo_url:
        "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu",

      banner_url:
        "https://ipfs.near.social/ipfs/bafkreic4xgorjt6ha5z4s5e3hscjqrowe5ahd7hlfc5p4hb6kdfp6prgy4",
    },
  });

const [showSpawner, setShowSpawner] = useState(false);

const CommunitySpawner = () => (
  <Widget
    src="devgovgigs.near/widget/gigs-board.components.organism.configurator"
    props={{
      heading: "Community information",
      externalState: CommunityInputsDefaults,
      fullWidth: true,
      isActive: true,
      isHidden,
      isUnlocked: true,
      // isValid: communityInputsValidator,
      onSubmit: onCommunitySubmit,
      schema: CommunityInputsPartialSchema,
      submitIcon: { type: "bootstrap_icon", variant: "bi-rocket-takeoff-fill" },
      submitLabel: "Launch",
      onCancel: () => setShowSpawner(false),
    }}
  />
);

const communitiesMetadata = Near.view(
  "devgovgigs.near",
  "get_all_communities_metadata"
);

if (!communitiesMetadata) {
  return <p>Loading...</p>;
}

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

function CommunityCard({ format, isBannerEnabled, metadata }) {
  const renderFormat =
    format === "small" || format === "medium" ? format : "small";

  const formatSmall = (
    <Link to={`?page=community&handle=${metadata.handle}`}>
      <AttractableLink
        {...otherProps}
        className={[
          "d-flex flex-shrink-0 p-3",
          "rounded-4 border border-2",
          "text-black text-decoration-none",
        ].join(" ")}
        style={{
          background:
            isBannerEnabled ?? false
              ? `center / cover no-repeat url(${metadata.banner_url})`
              : "#ffffff",

          width: 400,
          height: 110,
        }}
      >
        <div
          className="d-flex align-items-center gap-3 rounded-4 w-100 h-100"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(4px)",
          }}
        >
          <AttractableImage
            alt="Community logo"
            className="flex-shrink-0 rounded-circle"
            height={70}
            src={metadata.logo_url}
            width={70}
          />

          <div className="d-flex flex-column justify-content-center gap-1 w-100">
            <h5
              className="h5 m-0 text-nowrap overflow-hidden"
              style={{ textOverflow: "ellipsis" }}
            >
              {metadata.name}
            </h5>

            <p
              className="card-text text-secondary overflow-hidden"
              style={{ fontSize: 12, textOverflow: "ellipsis" }}
            >
              {metadata.description}
            </p>
          </div>
        </div>
      </AttractableLink>
    </Link>
  );

  const formatMedium = (
    <AttractableLink
      className="card d-flex flex-column flex-shrink-0 text-decoration-none text-reset"
      href={link}
      style={{ width: "23%", maxWidth: 304 }}
    >
      <div
        className="card-img-top w-100"
        style={{
          background: `center / cover no-repeat url(${metadata.banner_url})`,
          height: 164,
        }}
      />

      <div className="d-flex flex-column gap-2 p-3 card-text">
        <h5 class="h5 m-0">{metadata.name}</h5>
        <span class="text-secondary text-wrap">{metadata.description}</span>
      </div>
    </AttractableLink>
  );

  return {
    small: formatSmall,
    medium: formatMedium,
  }[renderFormat];
}

return (
  <div>
    <div
      className="d-flex justify-content-between p-4"
      style={{ backgroundColor: "#181818" }}
    >
      <div className="d-flex flex-column gap-3">
        <h1 className="m-0 fs-4">
          <Link to="?page=communities" className="text-white">
            Communities
          </Link>
        </h1>

        <p className="m-0 text-muted fs-6">
          Discover NEAR developer communities
        </p>
      </div>

      <div className="d-flex flex-column justify-content-center">
        <button
          onClick={() => setShowSpawner(true)}
          className="btn btn-primary"
        >
          Create Community
        </button>
      </div>
    </div>
    <div className="d-flex flex-wrap align-content-start gap-4 p-4 w-100 h-100">
      <CommunitySpawner />
      {(communitiesMetadata ?? []).reverse().map((communityMetadata) => (
        <CommunityCard metadata={communityMetadata} />
      ))}
    </div>
  </div>
);
