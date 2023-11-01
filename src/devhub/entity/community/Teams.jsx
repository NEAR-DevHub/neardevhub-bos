const { handle } = props;

const { Tile } =
  VM.require("${REPL_DEVHUB}/widget/devhub.components.molecule.Tile") ||
  (() => <></>);

const { getCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const communityData = getCommunity({ handle });

if (communityData === null) {
  return <div>Loading...</div>;
}

const UserList = ({ name, users }) => (
  <div>
    {(users ?? []).map((user, i) => (
      <div className={`row ${i < users.length - 1 ? "mb-3" : ""}`}>
        <div class="col-3">
          <b>{name + " #" + (i + 1)}</b>
        </div>

        <div class="col-9">
          <span
            key={user}
            className="d-inline-flex"
            style={{ fontWeight: 500 }}
          >
            <Widget
              src="neardevgov.near/widget/ProfileLine"
              props={{ accountId: user, hideAccountId: true, tooltip: true }}
            />
          </span>
        </div>
      </div>
    ))}
  </div>
);

return (
  <div className="d-flex flex-column align-items-center gap-4 w-100">
    <Tile className="p-3 w-100 bg-white mb-3" style={{ maxWidth: 960 }}>
      <div>
        <div
          className="d-flex align-items-center justify-content-between w-100 pb-3"
          style={{ minHeight: 30 }}
        >
          <h5 className="h5 d-inline-flex gap-2 m-0">
            <span>Admins</span>
          </h5>
        </div>
        <UserList name="Admin" users={communityData.admins} />
      </div>
    </Tile>
  </div>
);
