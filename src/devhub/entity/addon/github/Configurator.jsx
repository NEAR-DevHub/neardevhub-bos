// THIS IS A WORK IN PROGRESS.
// The code for the configurator and viewer is very intertwined
// and there is constant "negative affirmative" prop drilling happening, making it hard to follow
const { data, onSubmit, permissions } = props;

const Struct = VM.require("${REPL_DEVHUB}/widget/core.lib.struct");

if (!Struct) {
  return <p>Loading modules...</p>;
}

const defaultFieldUpdate = ({
  input,
  lastKnownValue,
  params: { arrayDelimiter },
}) => {
  switch (typeof input) {
    case "boolean":
      return input;

    case "object": {
      if (Array.isArray(input) && typeof lastKnownValue === "string") {
        return input.join(arrayDelimiter ?? ",");
      } else {
        return Array.isArray(lastKnownValue)
          ? [...lastKnownValue, ...input]
          : { ...lastKnownValue, ...input };
      }
    }

    case "string":
      return Array.isArray(lastKnownValue)
        ? input.split(arrayDelimiter ?? ",").map((string) => string.trim())
        : input;

    default: {
      if ((input ?? null) === null) {
        switch (typeof lastKnownValue) {
          case "boolean":
            return !lastKnownValue;

          default:
            return lastKnownValue;
        }
      } else return input;
    }
  }
};

const useForm = ({ initialValues, onUpdate, stateKey, uninitialized }) => {
  const initialFormState = {
    hasUnsubmittedChanges: false,
    values: initialValues ?? {},
  };

  const formState = state[stateKey] ?? null,
    isSynced = Struct.isEqual(formState?.values ?? {}, initialFormState.values);

  const formReset = () =>
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [stateKey]: initialFormState,
      hasUnsubmittedChanges: false,
    }));

  const formUpdate =
    ({ path, via: customFieldUpdate, ...params }) =>
    (fieldInput) => {
      const updatedValues = Struct.deepFieldUpdate(
        formState?.values ?? {},
        path, // Pass the path directly
        (node) => {
          return {
            ...node,
            // Update the last key in the path
            [path[path.length - 1]]:
              typeof customFieldUpdate === "function"
                ? customFieldUpdate(
                    fieldInput?.target?.value ?? fieldInput,
                    node[path[path.length - 1]],
                    params
                  )
                : defaultFieldUpdate(
                    fieldInput?.target?.value ?? fieldInput,
                    node[path[path.length - 1]],
                    params
                  ),
          };
        }
      );

      State.update((lastKnownComponentState) => ({
        ...lastKnownComponentState,

        [stateKey]: {
          hasUnsubmittedChanges: !Struct.isEqual(
            updatedValues,
            initialFormState.values
          ),

          values: updatedValues,
        },
      }));

      if (
        typeof onUpdate === "function" &&
        !Struct.isEqual(updatedValues, initialFormState.values)
      ) {
        onUpdate(updatedValues);
      }
    };

  if (
    !uninitialized &&
    (formState === null || (!formState.hasUnsubmittedChanges && !isSynced))
  ) {
    formReset();
  }

  return {
    ...(formState ?? initialFormState),
    isSynced,
    reset: formReset,
    stateKey,
    update: formUpdate,
  };
};

const uuid = () =>
  [Date.now().toString(16)]
    .concat(
      Array.from(
        { length: 4 },
        () => Math.floor(Math.random() * 0xffffffff) & 0xffffffff
      ).map((value) => value.toString(16))
    )
    .join("-");

const withUUIDIndex = (data) => {
  const id = uuid();

  return Object.fromEntries([[id, { ...data, id }]]);
};

const settings = {
  maxColumnsNumber: 20,
};

const GithubKanbanBoardTicketFeaturesSchema = {
  id: { label: "GitHub ID" },
  author: { label: "Author" },
  labels: { label: "Labels" },
  type: { label: "Type" },
};

const GithubKanbanBoardTicketTypesSchema = {
  Issue: { label: "Issue" },
  PullRequest: { label: "Pull Request" },
};

const GithubKanbanBoardDefaults = {
  columns: {},
  dataTypesIncluded: { Issue: false, PullRequest: true },
  description: "",
  repoURL: "",
  ticketState: "all",
  title: "",

  metadata: {
    id: uuid(),
    type: "github.kanban_board",

    ticket: {
      type: "github.kanban_ticket",
      features: { id: true, author: true, labels: true, type: true },
    },
  },
};

const toMigrated = ({ metadata, id, ...restParams }) => ({
  metadata: {
    ...GithubKanbanBoardDefaults.metadata,
    ...metadata,
    id: id ?? metadata.id,
  },

  ...restParams,
});

const [editingMode, setEditingMode] = useState("form");

// This is a workaround because of how the data was decided to be saved.
const dynamicKey = Object.keys(data).find((key) => key !== "metadata");
data = data[dynamicKey];

const form = useForm({
  initialValues: Struct.typeMatch(data) ? toMigrated(data) : {},
  stateKey: "view",
  uninitialized: !Struct.typeMatch(data),
});

const newViewInit = () =>
  State.update((lastKnownState) => ({
    ...lastKnownState,

    board: {
      hasUnsubmittedChanges: false,
      values: GithubKanbanBoardDefaults,
    },
  }));

const columnsCreateNew = ({ lastKnownValue }) =>
  Object.keys(lastKnownValue || {}).length < settings.maxColumnsNumber
    ? {
        ...(lastKnownValue ?? {}),

        ...withUUIDIndex({
          description: "",
          labelSearchTerms: [],
          title: "New column",
        }),
      }
    : lastKnownValue;

const columnsDeleteById =
  (id) =>
  ({ lastKnownValue }) =>
    Object.fromEntries(
      Object.entries(lastKnownValue).filter(([columnId]) => columnId !== id)
    );

const onCancel = () => {
  form.reset();
};

const onSave = () =>
  onSubmit({
    kanbanBoards: { [form.values.metadata.id]: form.values },
  });

function Form() {
  return (
    <>
      <div className="d-flex flex-column">
        <div className="d-flex gap-1 flex-column flex-xl-row">
          <Widget
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
            props={{
              className: "w-100",
              key: `${form.values.metadata.id}-repoURL`,
              label: "Repository URL",
              onChange: form.update({ path: ["repoURL"] }),
              placeholder: "https://github.com/example-org/example-repo",
              value: form.values.repoURL,
            }}
          />
          <Widget
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
            props={{
              className: "w-100",
              key: `${form.values.metadata.id}-title`,
              label: "Title",
              onChange: form.update({ path: ["title"] }),
              placeholder: "NEAR Protocol NEPs",
              value: form.values.title,
            }}
          />
        </div>

        <Widget
          src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
          props={{
            className: "w-100",
            key: `${form.values.metadata.id}-description`,
            label: "Description",
            onChange: form.update({ path: ["description"] }),
            placeholder: "Latest NEAR Enhancement Proposals by status.",
            value: form.values.description,
          }}
        />
      </div>

      <div className="d-flex gap-4 flex-row flex-wrap justify-content-between">
        <Widget
          src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
          props={{
            heading: "Ticket types",
            classNames: { root: "col-12 col-md-4 h-auto" },
            externalState: form.values.dataTypesIncluded,
            isActive: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onChange: form.update({ path: ["dataTypesIncluded"] }),
            schema: GithubKanbanBoardTicketTypesSchema,
          }}
        />

        <div
          className={[
            "col-12 col-md-3",
            "d-flex gap-3 flex-column justify-content-center p-4",
          ].join(" ")}
        >
          <span
            className="d-inline-flex gap-2"
            id={`${form.values.metadata.id}-ticketState`}
          >
            <i class="bi bi-cone-striped" />
            <span>Ticket state</span>
          </span>

          <Widget
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.button-switch"
            props={{
              currentValue: form.values.ticketState,
              key: "ticketState",
              onChange: form.update({ path: ["ticketState"] }),

              options: [
                { label: "All", value: "all" },
                { label: "Open", value: "open" },
                { label: "Closed", value: "closed" },
              ],
            }}
          />
        </div>
        <Widget
          src="${REPL_DEVHUB}/widget/gigs-board.components.organism.configurator"
          props={{
            heading: "Card fields",
            classNames: { root: "col-12 col-md-4 h-auto" },
            externalState: form.values.metadata.ticket.features,
            isActive: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onChange: form.update({ path: ["metadata", "ticket", "features"] }),
            schema: GithubKanbanBoardTicketFeaturesSchema,
            nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
            nearDevGovGigsContractAccountId: "${REPL_DEVHUB_CONTRACT}",
          }}
        />
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <span className="d-inline-flex gap-2 m-0">
          <i className="bi bi-list-task" />
          <span>{`Columns ( max. ${settings.maxColumnsNumber} )`}</span>
        </span>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 w-100">
        {Object.values(form.values.columns ?? {}).map(
          ({ id, description, labelSearchTerms, title }) => (
            <div
              className="d-flex gap-3 rounded-4 border p-3 w-100 attractable"
              key={`column-${id}-configurator`}
            >
              <div className="d-flex flex-column gap-1 w-100">
                <Widget
                  src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
                  props={{
                    className: "flex-grow-1",
                    key: `${form.values.metadata.id}-column-${id}-title`,
                    label: "Title",
                    onChange: form.update({ path: ["columns", id, "title"] }),
                    placeholder: "👀 Review",
                    value: title,
                  }}
                />
                <Widget
                  src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
                  props={{
                    format: "comma-separated",
                    key: `${form.values.metadata.id}-column-${title}-labelSearchTerms`,

                    label: `Search terms for all the labels
											MUST be presented in included tickets`,

                    onChange: form.update({
                      path: ["columns", id, "labelSearchTerms"],
                    }),

                    placeholder: "WG-, draft, review, proposal, ...",
                    value: labelSearchTerms.join(", "),
                  }}
                />
                <Widget
                  src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.text-input"
                  props={{
                    className: "flex-grow-1",
                    key: `${form.values.metadata.id}-column-${id}-description`,
                    label: "Description",

                    onChange: form.update({
                      path: ["columns", id, "description"],
                    }),

                    placeholder:
                      "NEPs that need a review by Subject Matter Experts.",

                    value: description,
                  }}
                />
              </div>

              <div
                className="d-flex flex-column gap-3 border-start p-3 pe-0"
                style={{ marginTop: -16, marginBottom: -16 }}
              >
                <button
                  className="btn btn-outline-danger"
                  onClick={form.update({
                    path: ["columns"],
                    via: columnsDeleteById(id),
                  })}
                  title="Delete column"
                >
                  <i className="bi bi-trash-fill" />
                </button>
              </div>
            </div>
          )
        )}

        <div className="d-flex gap-3 justify-content-end w-100">
          <Widget
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.button"
            props={{
              classNames: {
                root: "d-flex btn btn-outline-danger shadow-none border-0",
              },
              label: "Cancel",
              onClick: onCancel,
              nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
            }}
          />
          <Widget
            src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.button"
            props={{
              classNames: { root: "btn btn-success" },
              disabled: form.isSynced,

              icon: {
                type: "svg_icon",
                variant: "floppy_drive",
                width: 14,
                height: 14,
              },
              label: "Save",
              onClick: onSave,
              nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
            }}
          />
        </div>
      </div>
    </>
  );
}

return (
  <div
    className="d-flex flex-column gap-4 w-100"
    style={{ maxWidth: "100%", marginTop: "40px" }}
  >
    <div className={"d-flex flex-column gap-4 w-100"}>
      <div className="d-flex align-items-center justify-content-between gap-3 w-100">
        <h5 className="h5 d-inline-flex gap-2 m-0">
          <i className="bi bi-gear-wide-connected" />
          <span>GitHub board configuration</span>
        </h5>
        <Widget
          src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.button-switch"
          props={{
            currentValue: editingMode,
            key: "editingMode",
            onChange: (e) => setEditingMode(e.target.value),

            options: [
              { label: "Form", value: "form" },
              { label: "JSON", value: "JSON" },
            ],

            title: "Editing mode selection",
          }}
        />
      </div>
      {editingMode === "JSON" ? (
        <div className="d-flex flex-column flex-grow-1 border-0 bg-transparent w-100">
          <textarea
            className="form-control"
            rows="12"
            type="text"
            value={JSON.stringify(form.values ?? {}, null, "\t")}
          />
        </div>
      ) : (
        <Form />
      )}
    </div>
    {form.values ? (
      <Widget
        src={`${REPL_DEVHUB}/widget/gigs-board.entity.workspace.view.${form.values.metadata.type}`}
        props={{
          ...form.values,

          configurationControls: [
            {
              label: "New column",

              disabled:
                Object.keys(form.values.columns || {}).length >=
                settings.maxColumnsNumber,

              icon: { type: "bootstrap_icon", variant: "bi-plus-lg" },

              onClick: form.update({
                path: ["columns"],
                via: columnsCreateNew,
              }),
            },
          ],

          isSynced: form.isSynced,
          link,
          permissions,
          nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
          nearDevGovGigsContractAccountId: "${REPL_DEVHUB_CONTRACT",
        }}
      />
    ) : (
      <div
        className="d-flex flex-column align-items-center justify-content-center gap-4"
        style={{ height: 384 }}
      >
        <h5 className="h5 d-inline-flex gap-2 m-0">
          This community doesn't have a GitHub board
        </h5>
        <Widget
          src="${REPL_DEVHUB}/widget/gigs-board.components.molecule.button"
          props={{
            icon: { type: "bootstrap_icon", variant: "bi-github" },
            isHidden: !permissions.can_configure,
            label: "Create GitHub board",
            onClick: newViewInit,
            nearDevGovGigsWidgetsAccountId: "${REPL_DEVHUB}",
          }}
        />
      </div>
    )}
  </div>
);
