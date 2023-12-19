const {
  getFeaturedCommunities,
  setFeaturedCommunities,
  getAllCommunitiesMetadata,
} = VM.require("${REPL_DEVHUB}/widget/core.adapter.devhub-contract");

const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

if (
  !getFeaturedCommunities ||
  !setFeaturedCommunities ||
  !getAllCommunitiesMetadata ||
  !Tile
) {
  return <p>Loading modules...</p>;
}

const fc = getFeaturedCommunities();
// The state will stay empty even after the data right data has been retrieved
if (!fc) {
  return <p>Loading featured communities...</p>;
}
const featuredCommunityList = fc || [];

const allCommunities = getAllCommunitiesMetadata();

const [communityMessage, setCommunityMessage] = useState("");
const [previewConnect, setPreviewConnect] = useState(false);

const [communityHandles, setCommunityHandles] = useState(
  featuredCommunityList.map(({ handle }) => handle)
);
const handleResetItems = () => {
  setCommunityHandles(featuredCommunityList.map(({ handle }) => handle));
};

function handleSubmit() {
  if (communityHandles.length < 4) {
    return setCommunityMessage("Can't set fewer than 4 communities");
  }
  setFeaturedCommunities({ handles: communityHandles });
}

return (
  <>
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.atom.Alert"
      props={{
        onClose: () => setCommunityMessage(""),
        message: communityMessage,
      }}
    />
    <Tile className="p-3 mb-3">
      <h3> Manage featured communities</h3>
      <Widget
        src="${REPL_DEVHUB}/widget/devhub.components.molecule.ListEditor"
        props={{
          data: {
            maxLength: 5,
            placeholder: "Community handle",
            prefix: "Community handle",
            list: communityHandles,
          },
          setList: setCommunityHandles,
          validate: (newItem) => {
            return allCommunities.map(({ handle }) => handle).includes(newItem);
          },
          invalidate: () =>
            setCommunityMessage(
              "This community handle does not exist, make sure you use an existing handle."
            ),
        }}
      />

      <div
        className={"d-flex align-items-center justify-content-end gap-3 mt-4"}
      >
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: {
              root: "btn-outline-danger shadow-none border-0",
            },
            label: "Cancel",
            onClick: handleResetItems,
          }}
        />
        <Widget
          src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
          props={{
            classNames: { root: "btn" },
            icon: {
              type: "bootstrap_icon",
              variant: "bi-check-circle-fill",
            },
            label: "Submit",
            onClick: handleSubmit,
          }}
        />
      </div>
    </Tile>
    <Widget
      src={"${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"}
      props={{
        onClick: () => setPreviewConnect(!previewConnect),
        icon: previewConnect ? "bi bi-toggle-on" : "bi bi-toggle-off",
        title: "Preview homepage",
        testId: "preview-homepage",
      }}
    />
    <div class="mt-3">
      {previewConnect && (
        <Widget
          src="${REPL_DEVHUB}/widget/devhub.components.island.connect"
          props={{ ...props }}
        />
      )}
    </div>
  </>
);
