const { Tile } = VM.require(
  `${REPL_DEVHUB}/widget/devhub.components.molecule.Tile`
) || { Tile: () => <></> };

const { accessControlInfo, createEditTeam } = props;

const [editModerators, setEditModerators] = useState(false);
const [moderators, setModerators] = useState(
  accessControlInfo.members_list["team:moderators"].children || []
);

const handleEditModerators = () => {
  createEditTeam({
    teamName: "moderators",
    description:
      "The moderator group has permissions to create and edit RFPs, edit and manage proposals, and manage admins.",
    members: moderators,
    contractCall: "edit_member",
  });
};

const handleCancelModerators = () => {
  setEditModerators(false);
  setModerators(accessControlInfo.members_list["team:moderators"].children);
};

return (
  <>
    <h3>Moderators</h3>
    <div className="card-body">
      <h6>
        The moderator group has permissions to create and edit RFPs, edit and
        manage proposals, and manage admins.
      </h6>
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls`}
        props={{
          icon: "bi bi-gear-wide-connected",
          className: "mb-3",
          title: "Edit members",
          onClick: () => setEditModerators(!editModerators),
          testId: "edit-members",
        }}
      />
    </div>
    <Tile className="p-3" style={{ background: "white" }}>
      {editModerators ? (
        <>
          <Widget
            src={`${REPL_TREASURY_TEMPLAR}/widget/components.admin.AccountsEditor`}
            props={{
              data: {
                maxLength: 100,
                placeholder: "member.near",
                list: moderators,
              },
              setList: setModerators,
              // Could add a check to see if it is an valid account id.
              validate: (newItem) => true,
              invalidate: () => null,
            }}
          />
          <div
            className={
              "d-flex align-items-center justify-content-end gap-3 mt-4"
            }
          >
            <Widget
              src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
              props={{
                classNames: {
                  root: "btn-outline-danger shadow-none border-0",
                },
                label: "Cancel",
                onClick: handleCancelModerators,
              }}
            />
            <Widget
              src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
              props={{
                classNames: { root: "btn-success" },
                icon: {
                  type: "bootstrap_icon",
                  variant: "bi-check-circle-fill",
                },
                label: "Submit",
                onClick: handleEditModerators,
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div class="pt-4">Members</div>
          {moderators && (
            <div class="vstack">
              {moderators.length ? (
                moderators.map((child) => (
                  <Tile className="w-25 p-3 m-1" minHeight={10}>
                    <Widget
                      src={`${REPL_DEVHUB}/widget/devhub.components.molecule.ProfileLine`}
                      props={{ accountId: child }}
                    />
                  </Tile>
                ))
              ) : (
                <div>No moderators</div>
              )}
            </div>
          )}
        </>
      )}
    </Tile>
  </>
);
