const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/DevHub.components.molecule.Tile") ||
  (() => <></>);

const { getAllCommunitiesMetadata, createCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/DevHub.modules.contract-sdk"
);

if (!getAllCommunitiesMetadata || !createCommunity) {
  return <p>Loading modules...</p>;
}

const { Struct } = VM.require("${REPL_DEVHUB}/widget/DevHub.modules.utils");

if (!Struct) {
  return <p>Loading modules...</p>;
}

State.init({
  handle: "",
  name: "",
  tag: "",
  description: "",
});

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

const communityInputsValidator = (formValues) =>
  Struct.typeMatch(formValues) &&
  Object.values(formValues).every(
    (value) => typeof value === "string" && value.length > 0
  );

const onCommunitySubmit = (inputs) =>
  createCommunity({
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
  <Tile className="p-3">
    <Widget
      src={"${REPL_DEVHUB}/widget/DevHub.components.organism.Configurator"}
      props={{
        heading: "Community information",
        externalState: CommunityInputsDefaults,
        fullWidth: true,
        isActive: true,
        isUnlocked: true,
        isValid: communityInputsValidator,
        onSubmit: onCommunitySubmit,
        schema: CommunityInputsPartialSchema,
        submitIcon: {
          type: "bootstrap_icon",
          variant: "bi-rocket-takeoff-fill",
        },
        submitLabel: "Launch",
        onCancel: () => setShowSpawner(false),
      }}
    />
  </Tile>
);

const communitiesMetadata = getAllCommunitiesMetadata();

if (!communitiesMetadata) {
  return <p>Loading...</p>;
}

function CommunityCard({ format, isBannerEnabled, metadata }) {
  const renderFormat =
    format === "small" || format === "medium" ? format : "small";

  const formatSmall = (
    <Link
      to={
        "/${REPL_DEVHUB}/widget/DevHub.App?page=community&handle=" +
        metadata.handle
      }
    >
      <div
        {...otherProps}
        className={[
          "d-flex flex-shrink-0 p-3",
          "rounded-4 border border-2",
          "text-black text-decoration-none",
          "attractable",
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
          <img
            alt="Community logo"
            className="flex-shrink-0 rounded-circle attractable"
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
      </div>
    </Link>
  );

  const formatMedium = (
    <div
      className="card d-flex flex-column flex-shrink-0 text-decoration-none text-reset attractable"
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
    </div>
  );

  return {
    small: formatSmall,
    medium: formatMedium,
  }[renderFormat];
}

return (
  <div className="w-100">
    <div
      className="d-flex justify-content-between p-4"
      style={{ backgroundColor: "#181818" }}
    >
      <div className="d-flex flex-column gap-3">
        <h1 className="m-0 fs-4">
          <Link
            to={"${REPL_DEVHUB}/widget/DevHub.App?page=communities"}
            className="text-white"
          >
            Communities
          </Link>
        </h1>

        <p className="m-0 text-muted fs-6">
          Discover NEAR developer communities
        </p>
      </div>
      {context.accountId && (
        <div className="d-flex flex-column justify-content-center">
          <Widget
            src={"${REPL_DEVHUB}/widget/DevHub.components.molecule.Button"}
            props={{
              icon: { type: "bootstrap_icon", variant: "bi-people-fill" },
              onClick: () => setShowSpawner(!showSpawner),
              className: "btn btn-primary",
              label: "Create Community",
            }}
          />
        </div>
      )}
    </div>
    {/* // TODO: Align centers */}
    <div className="d-flex flex-wrap align-content-start gap-4 p-4 w-100 h-100">
      {showSpawner && <CommunitySpawner />}
      {(communitiesMetadata ?? []).reverse().map((communityMetadata) => (
        <CommunityCard metadata={communityMetadata} />
      ))}
    </div>
  </div>
);
