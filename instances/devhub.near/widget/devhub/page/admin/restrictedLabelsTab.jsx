const { accessControlInfo, createEditTeam, teamNames } = props;

const [createTeam, setCreateTeam] = useState(false);

return (
  <>
    <h1>Restricted Labels</h1>
    <h5>
      Create special labels and control who can use and edit posts with those
      labels.
    </h5>
    {!createTeam ? (
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"}
        props={{
          onClick: () => setCreateTeam(true),
          title: "Create label",
          testId: "create-team",
        }}
      />
    ) : (
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.team.Configurator"}
        props={{
          onCancel: () => setCreateTeam(false),
          onSubmit: (params) =>
            createEditTeam({ ...params, contractCall: "add_member" }),
        }}
      />
    )}

    <div class="table-responsive mt-3">
      <table class="table table-sm table-bordered table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">label name</th>
            <th scope="col">Type</th>
            <th scope="col">Members</th>
            <th scope="col">Only allow members to use label</th>
            <th scope="col">Allow members to edit any post with label</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {(teamNames || [])
            .filter(
              (teamName) =>
                teamName !== "team:moderators" && teamName.startsWith("team:")
            )
            .sort()
            .map((teamName) => {
              return (
                <Widget
                  src={"${REPL_DEVHUB}/widget/devhub.entity.team.LabelRow"}
                  props={{
                    teamName,
                  }}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  </>
);
