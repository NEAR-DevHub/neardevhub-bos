const { getCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!getCommunity || !href) {
  return <p>Loading modules...</p>;
}

const { handle, transactionHashes } = props;

State.init({ isSpawnerHidden: true });

const spawnerToggle = (forcedState) =>
  State.update((lastKnownState) => ({
    ...lastKnownState,
    isSpawnerHidden: !(forcedState ?? lastKnownState.isSpawnerHidden),
  }));

const communityData = getCommunity({ handle });

return communityData === null ? (
  <div>Loading ...</div>
) : (
  <div className="row">
    <div className="col-md-9">
      <div className="row mb-2">
        <div className="col">
          <div className="d-flex align-items-center justify-content-between">
            <small className="text-muted">
              <span>Required tags:</span>

              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
                props={{ tag: communityData.tag }}
              />
            </small>

            <Widget
              src={"${REPL_DEVHUB}/widget/devhub.components.molecule.Button"}
              props={{
                icon: {
                  type: "bootstrap_icon",
                  variant: "bi-plus-circle-fill",
                },

                isHidden: !state.isSpawnerHidden,
                label: "Post",
                onClick: () => spawnerToggle(true),
              }}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.post.Spawner"}
            props={{
              isHidden: state.isSpawnerHidden,
              onCancel: () => spawnerToggle(false),
              tags: [communityData.tag],
              transactionHashes,
            }}
          />

          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.post.List"}
            props={{ tag: communityData.tag }}
          />
        </div>
      </div>
    </div>

    <div className="col-md-3 container-fluid">
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.community.Sidebar"}
        props={{ community: communityData }}
      />
    </div>
  </div>
);
