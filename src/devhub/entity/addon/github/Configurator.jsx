const Struct = VM.require("${REPL_DEVHUB}/widget/core.lib.struct");

if (!Struct) {
  return <p>Loading modules...</p>;
}
const { useQuery } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);
const { uuid, withUUIDIndex } = VM.require(
  "${REPL_DEVHUB}/widget/core.lib.uuid"
);

uuid || (uuid = () => {});
withUUIDIndex || (withUUIDIndex = () => {});
useQuery || (useQuery = () => {});

const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

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

const GithubViewConfigurator = ({ kanbanBoards, permissions, onSubmit }) => {
  const data = Object.values(kanbanBoards)?.[0];

  if (!data) {
    return (
      <div class="alert alert-danger" role="alert">
        Loading...
      </div>
    );
  }

  const initialFormState = Struct.typeMatch(data) ? toMigrated(data) : {};
  const [formState, setForm] = useState(initialFormState);
  const [showPreview, setPreview] = useState(false);

  const formUpdate =
    ({ path, via: customFieldUpdate, ...params }) =>
    (fieldInput) => {
      const transformFn = (node) => {
        if (typeof customFieldUpdate === "function") {
          return customFieldUpdate({
            input: fieldInput?.target?.value ?? fieldInput,
            lastKnownValue: node,
            params,
          });
        } else {
          return Struct.defaultFieldUpdate({
            input: fieldInput?.target?.value ?? fieldInput,
            lastKnownValue: node,
            params,
          });
        }
      };
      const updatedValues = Struct.deepFieldUpdate(
        formState ?? {},
        path,
        (node) => transformFn(node)
      );
      setForm((prevFormState) => ({
        ...prevFormState,
        ...updatedValues,
      }));
    };

  const formReset = () => {
    setForm(initialFormState);
  };

  const newViewInit = () => {
    setForm(GithubKanbanBoardDefaults);
  };

  const columnsCreateNew = ({ lastKnownValue }) =>
    Object.keys(lastKnownValue).length < settings.maxColumnsNumber
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
    formReset();
  };

  const onSave = () => onSubmit(formState);

  const formElement = (
    <>
      <div className="d-flex flex-column">
        <div className="d-flex gap-1 flex-column flex-xl-row">
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
            props={{
              className: "w-100",
              key: `${formState.metadata.id}-repoURL`,
              label: "Repository URL",
              onChange: formUpdate({ path: ["repoURL"] }),
              placeholder: "https://github.com/example-org/example-repo",
              value: formState.repoURL,
            }}
          />
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
            props={{
              className: "w-100",
              key: `${formState.metadata.id}-title`,
              label: "Title",
              onChange: formUpdate({ path: ["title"] }),
              placeholder: "NEAR Protocol NEPs",
              value: formState.title,
            }}
          />
        </div>

        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
          props={{
            className: "w-100",
            key: `${formState.metadata.id}-description`,
            label: "Description",
            onChange: formUpdate({ path: ["description"] }),
            placeholder: "Latest NEAR Enhancement Proposals by status.",
            value: formState.description,
          }}
        />
      </div>

      <div className="d-flex gap-4 flex-row flex-wrap justify-content-between">
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.organism.Configurator`}
          props={{
            heading: "Ticket types",
            classNames: { root: "col-12 col-md-4 h-auto" },
            externalState: formState.dataTypesIncluded,
            isActive: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onChange: formUpdate({ path: ["dataTypesIncluded"] }),
            schema: GithubKanbanBoardTicketTypesSchema,
            hideSubmitBtn: true,
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
            id={`${formState.metadata.id}-ticketState`}
          >
            <i class="bi bi-cone-striped" />
            <span>Ticket state</span>
          </span>
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Switch`}
            props={{
              currentValue: formState.ticketState,
              key: "ticketState",
              onChange: formUpdate({ path: ["ticketState"] }),

              options: [
                { label: "All", value: "all" },
                { label: "Open", value: "open" },
                { label: "Closed", value: "closed" },
              ],
            }}
          />
        </div>
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.organism.Configurator`}
          props={{
            heading: "Card fields",
            classNames: { root: "col-12 col-md-4 h-auto" },
            externalState: formState.metadata.ticket.features,
            isActive: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onChange: formUpdate({ path: ["metadata", "ticket", "features"] }),
            schema: GithubKanbanBoardTicketFeaturesSchema,
            hideSubmitBtn: true,
          }}
        />
      </div>

      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="d-inline-flex gap-2 m-0">
          <i className="bi bi-list-task" />
          <span>{`Columns ( max. ${settings.maxColumnsNumber} )`}</span>
        </span>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 w-100">
        {Object.values(formState.columns ?? {}).map(
          ({ id, description, labelSearchTerms, title }) => (
            <AttractableDiv
              className="d-flex gap-3 rounded-4 border p-3 w-100"
              key={`column-${id}-configurator`}
            >
              <div className="d-flex flex-column gap-1 w-100">
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
                  props={{
                    className: "flex-grow-1",
                    key: `${formState.metadata.id}-column-${id}-title`,
                    label: "Title",
                    onChange: formUpdate({ path: ["columns", id, "title"] }),
                    placeholder: "👀 Review",
                    value: title,
                  }}
                />
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
                  props={{
                    format: "comma-separated",
                    key: `${formState.metadata.id}-column-${title}-labelSearchTerms`,

                    label: `Search terms for all the labels
											MUST be presented in included tickets`,

                    onChange: formUpdate({
                      path: ["columns", id, "labelSearchTerms"],
                    }),

                    placeholder: "WG-, draft, review, proposal, ...",
                    value: labelSearchTerms.join(", "),
                  }}
                />
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
                  props={{
                    className: "flex-grow-1",
                    key: `${formState.metadata.id}-column-${id}-description`,
                    label: "Description",

                    onChange: formUpdate({
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
                  onClick={formUpdate({
                    path: ["columns"],
                    via: columnsDeleteById(id),
                  })}
                  title="Delete column"
                >
                  <i className="bi bi-trash-fill" />
                </button>
              </div>
            </AttractableDiv>
          )
        )}

        <div className="d-flex gap-3 justify-content-end w-100">
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
            props={{
              classNames: {
                root: "d-flex btn btn-outline-danger shadow-none border-0",
              },
              isHidden: typeof onCancel !== "function",
              label: "Cancel",
              onClick: onCancel,
            }}
          />
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
            props={{
              classNames: { root: "btn btn-success" },
              disabled: form.isSynced,

              icon: {
                type: "svg_icon",
                variant: "floppy_drive",
                width: 14,
                height: 14,
              },

              isHidden: typeof onSave !== "function",
              label: "Save",
              onClick: onSave,
            }}
          />
        </div>
      </div>
    </>
  );

  return (
    <div
      className="d-flex flex-column gap-4 w-100"
      style={{ maxWidth: "100%" }}
    >
      <ul className="nav nav-tabs" id="editPreviewTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${!showPreview ? "active" : ""}`}
            id="edit-tab"
            data-bs-toggle="tab"
            data-bs-target="#edit"
            type="button"
            role="tab"
            aria-controls="edit"
            aria-selected="true"
            onClick={() => setPreview(false)}
          >
            Edit
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${showPreview ? "active" : ""}`}
            id="preview-tab"
            data-bs-toggle="tab"
            data-bs-target="#preview"
            type="button"
            role="tab"
            aria-controls="preview"
            aria-selected="false"
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
        </li>
      </ul>
      {showPreview ? (
        <div>
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.entity.addon.github.Viewer`}
            props={{
              kanbanBoards: {
                [formState.metadata.id]: formState,
              },
            }}
          />
        </div>
      ) : (
        <div className={["d-flex flex-column gap-4 w-100"].join(" ")}>
          <div className="d-flex align-items-center justify-content-between gap-3 w-100">
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-gear-wide-connected" />
              <span>GitHub board configuration</span>
            </h5>
          </div>
          {Object.keys(formState).length > 0 && (
            <div>
              {formElement}
              <Widget
                src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                props={{
                  classNames: {
                    root: "btn-sm btn-outline-secondary",
                  },
                  label: "New column",
                  disabled:
                    Object.keys(formState.columns).length >=
                    settings.maxColumnsNumber,
                  icon: { type: "bootstrap_icon", variant: "bi-plus-lg" },
                  onClick: formUpdate({
                    path: ["columns"],
                    via: columnsCreateNew,
                  }),
                }}
              />
            </div>
          )}

          {!Object.keys(formState).length && (
            <div
              className="d-flex flex-column align-items-center justify-content-center gap-4"
              style={{ height: 384 }}
            >
              <h5 className="h5 d-inline-flex gap-2 m-0">
                This community doesn't have a GitHub board
              </h5>
              <Widget
                src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
                props={{
                  icon: { type: "bootstrap_icon", variant: "bi-github" },
                  isHidden: !permissions.can_configure,
                  label: "Create GitHub board",
                  onClick: newViewInit,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

return GithubViewConfigurator(props);
