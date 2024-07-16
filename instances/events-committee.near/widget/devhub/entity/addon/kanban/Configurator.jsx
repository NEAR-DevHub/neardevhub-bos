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
  maxColumnsNumber: 10,
};

const KanbanPostBoardBasicInfoSchema = {
  title: { label: "Title", order: 1, placeholder: "Enter board title" },
  description: {
    label: "Description",
    order: 2,
    placeholder: "Enter board description",
  },
};

const KanbanPostBoardTicketFeaturesSchema = {
  author: { label: "Author" },
  like_count: { label: "Likes" },
  approved_sponsorship_value: { label: "Funding amount" },
  sponsorship_supervisor: { label: "Supervisor/Sponser" },
  tags: { label: "Tags" },
  type: { label: "Post type" },
};

const KanbanPostBoardDefaults = {
  metadata: {
    id: uuid(),
    type: "kanban.post_board",
    title: "",
    description: "",
    ticket: {
      type: "kanban.post_ticket",
      features: {
        author: true,
        like_count: true,
        approved_sponsorship_value: true,
        sponsorship_supervisor: true,
        tags: true,
        type: true,
      },
      sortBy: "",
    },
  },
  payload: {
    columns: {},
  },
};

const toMigrated = ({ config, metadata, payload }) => ({
  metadata: {
    ...KanbanPostBoardDefaults.metadata,
    ...metadata,
    ticket: {
      ...KanbanPostBoardDefaults.metadata.ticket,
      ...metadata.ticket,
      features: {
        ...KanbanPostBoardDefaults.metadata.ticket.features,
        ...metadata.ticket.features,
      },
    },
  },
  payload: {
    ...KanbanPostBoardDefaults.payload,
    ...payload,
    ...config,
  },
});

const sortByOptions = [
  { label: "None", value: "none" },
  { label: "Amount: High to Low", value: "descending-amount" },
  { label: "Amount: Low to High", value: "ascending-amount" },
  { label: "Date: Newest to Oldest", value: "descending-date" },
  { label: "Date: Oldest to Newest", value: "ascending-date" },
  { label: "Author: A-Z", value: "ascending-author" },
  { label: "Author: Z-A", value: "descending-author" },
  { label: "Sponsor/Supervisor: A-Z", value: "ascending-sponsor" },
  { label: "Sponsor/Supervisor: Z-A", value: "descending-sponsor" },
  { label: "Most Likes", value: "descending-likes" },
  { label: "Fewest Likes", value: "ascending-likes" },
];

const KanbanViewConfigurator = ({ handle, data, permissions, onSubmit }) => {
  const tags = useCache(
    () =>
      Near.asyncView("${REPL_DEVHUB_CONTRACT}", "get_all_labels").then(
        (res) => res
      ),
    handle,
    {
      subscribe: false,
    }
  );

  if (!data) {
    return (
      <div class="alert alert-danger" role="alert">
        Loading...
      </div>
    );
  }
  const initialFormState = Struct.pick(
    data.metadata === undefined ? {} : toMigrated(data),
    ["metadata", "payload"]
  );

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
    setForm(KanbanPostBoardDefaults);
  };

  const columnsCreateNew = ({ lastKnownValue }) =>
    Object.keys(lastKnownValue).length < settings.maxColumnsNumber
      ? {
          ...(lastKnownValue ?? {}),
          ...withUUIDIndex({ tag: "", title: "New column", description: "" }),
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
    <div className="card p-2">
      <div className="card-body d-flex flex-column gap-3">
        <div className="d-flex flex-column flex-lg-row align-items-stretch w-100">
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.organism.Configurator`}
            props={{
              heading: "Basic information",
              externalState: formState.metadata,
              isActive: true,
              isEmbedded: true,
              isUnlocked: permissions.can_configure,
              onChange: formUpdate({ path: ["metadata"] }),
              schema: KanbanPostBoardBasicInfoSchema,
              hideSubmitBtn: true,
            }}
          />
        </div>
        <div className="d-flex flex-column flex-1 align-items-start justify-content-evenly gap-1 p-2 flex-grow-1">
          <span
            className="d-flex justify-content-between align-items-center gap-3 w-100"
            style={{ fontWeight: 500, fontSize: "16" }}
          >
            Fields to display
          </span>
          <div>
            <Widget
              src={`${REPL_DEVHUB}/widget/devhub.components.organism.Configurator`}
              props={{
                heading: "Card fields",
                classNames: { root: "w-auto h-auto" },
                externalState: formState.metadata.ticket.features,
                isActive: true,
                isEmbedded: true,
                isUnlocked: permissions.can_configure,
                onChange: formUpdate({
                  path: ["metadata", "ticket", "features"],
                }),
                schema: KanbanPostBoardTicketFeaturesSchema,
                style: { minWidth: "36%" },
                hideSubmitBtn: true,
              }}
            />
          </div>
        </div>
        <div className="d-flex flex-column flex-1 align-items-start justify-content-evenly gap-1 p-2 flex-grow-1">
          <span
            className="d-flex justify-content-between align-items-center gap-3 w-100"
            style={{ fontWeight: 500, fontSize: "16" }}
          >
            Sort by
          </span>
          <div>
            <div className="input-group">
              <select
                className="form-select border border-1"
                value={formState.metadata.ticket.sortBy}
                onChange={formUpdate({
                  path: ["metadata", "ticket", "sortBy"],
                })}
                aria-label={label}
              >
                <option value="none" disabled hidden>
                  None
                </option>
                {sortByOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between w-100 mb-1">
          <span className="d-inline-flex gap-2 m-0">
            <i className="bi bi-list-task" />
            <span>{`Columns ( max. ${settings.maxColumnsNumber} )`}</span>
          </span>
        </div>

        <div className="d-flex flex-column align-items-center gap-4 w-100">
          {Object.values(formState.payload.columns ?? {}).map(
            ({ id, description, tag, title }) => (
              <AttractableDiv
                className="d-flex gap-3 rounded-4 border p-3 w-100"
                key={`column-${id}-configurator`}
              >
                <div className="d-flex flex-column gap-1 w-100">
                  <Widget
                    src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
                    props={{
                      className: "flex-grow-1",
                      key: `column-${id}-title`,
                      label: "Title",
                      onChange: formUpdate({
                        path: ["payload", "columns", id, "title"],
                      }),
                      placeholder: "Enter column title",
                      value: title,
                    }}
                  />
                  <Widget
                    src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
                    props={{
                      className: "flex-grow-1",
                      key: `column-${id}-description`,
                      label: "Description",
                      onChange: formUpdate({
                        path: ["payload", "columns", id, "description"],
                      }),
                      placeholder: "Enter a brief description for the column",
                      value: description,
                    }}
                  />
                  <div className="d-flex flex-column flex-1 align-items-start justify-content-evenly gap-1 p-2 flex-grow-1">
                    <span className="d-flex justify-content-between align-items-center gap-3 w-100">
                      Enter a tag to filter posts in this column
                    </span>
                    <div className="w-100">
                      <Widget
                        src="${REPL_DEVHUB}/widget/devhub.feature.post-search.by-tag"
                        props={{
                          tag: tag,
                          onTagSearch: formUpdate({
                            path: ["payload", "columns", id, "tag"],
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="d-flex flex-column gap-3 border-start p-3 pe-0"
                  style={{ marginTop: -16, marginBottom: -16 }}
                >
                  <button
                    className="btn btn-outline-danger"
                    onClick={formUpdate({
                      path: ["payload", "columns"],
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
        </div>
        <div className="d-flex gap-3 justify-content-between w-100 mt-2 flex-wrap flex-sm-nowrap">
          <div style={{ flex: "none" }}>
            <Widget
              src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
              props={{
                classNames: {
                  root: "btn-sm btn-outline-secondary",
                },
                label: "New column",
                disabled:
                  Object.keys(formState.payload.columns).length >=
                  settings.maxColumnsNumber,
                icon: { type: "bootstrap_icon", variant: "bi-plus-lg" },
                onClick: formUpdate({
                  path: ["payload", "columns"],
                  via: columnsCreateNew,
                }),
              }}
            />
          </div>
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
      </div>
    </div>
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
            src={`${REPL_DEVHUB}/widget/devhub.entity.addon.kanban.Viewer`}
            props={{
              data: formState,
            }}
          />
        </div>
      ) : (
        <div className={["d-flex flex-column gap-4 w-100"].join(" ")}>
          <div className="d-flex align-items-center justify-content-between gap-3 w-100">
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-gear-wide-connected" />
              <span>Kanban board configuration</span>
            </h5>
          </div>
          {Object.keys(formState.metadata ?? {}).length > 0 && formElement}
        </div>
      )}
      {!Object.keys(formState.metadata ?? {}).length && (
        <div
          className="d-flex flex-column align-items-center justify-content-center gap-4"
          style={{ height: 384 }}
        >
          <h5 className="h5 d-inline-flex gap-2 m-0">
            This community doesn't have a kanban board
          </h5>
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
            props={{
              icon: { type: "bootstrap_icon", variant: "bi-kanban-fill" },
              isHidden: !permissions.can_configure,
              label: "Create kanban board",
              onClick: newViewInit,
            }}
          />
        </div>
      )}
    </div>
  );
};

return KanbanViewConfigurator(props);
