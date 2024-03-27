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
  dataTypesIncluded: { issue: false, pullRequest: true },
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

function extractOwnerAndRepo(url) {
  // Remove any leading or trailing slashes and split the URL by "/"
  const parts = url
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .split("/");

  // Check if the URL matches the GitHub repository format
  if (parts.length === 5 && parts[2] === "github.com") {
    const owner = parts[3];
    const repo = parts[4];
    return { owner, repo };
  } else {
    return null;
  }
}

function isValidGitHubRepoLink(url) {
  // Regular expression to match GitHub repository URLs
  const githubRepoRegex =
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)\/?$/;

  // Check if the URL matches the GitHub repository format
  return githubRepoRegex.test(url);
}

const GithubViewConfigurator = ({ kanbanBoards, permissions, onSubmit }) => {
  const data = kanbanBoards ? Object.values(kanbanBoards)?.[0] : {};

  if (!data) {
    return (
      <div class="alert alert-danger" role="alert">
        Loading...
      </div>
    );
  }

  const initialBoardState = Struct.typeMatch(data) ? toMigrated(data) : {};

  const getColumnData = useCallback((state) => {
    if (Object.keys(state).length > 0) {
      return state?.columns ?? {};
    }
    return state;
  }, []);

  const getNonColumnData = useCallback((state) => {
    if (Object.keys(state).length > 0) {
      delete state.columns;
      return state;
    }
    return state;
  }, []);

  // to improve the state update speed, decoupled columns and other configuration metadata
  const [parentState, setParentState] = useState(initialBoardState);
  const [metadataState, setMetadata] = useState(
    getNonColumnData(initialBoardState)
  );
  const [showPreview, setPreview] = useState(false);
  const [columnsState, setColumnsState] = useState(
    getColumnData(initialBoardState)
  );
  const [repoLabels, setRepoLabels] = useState([]);

  function fetchLabelsFromRepo(url) {
    const data = extractOwnerAndRepo(url);
    if (data) {
      const { repo, owner } = data;
      useCache(
        () =>
          asyncFetch(
            `https://api.github.com/repos/${owner}/${repo}/labels`
          ).then((res) => {
            if (Array.isArray(res.body)) {
              const labels = [];
              res.body.map((item) => {
                labels.push(item.name);
              });
              setRepoLabels(labels);
            }
          }),
        owner + repo + "labels",
        { subscribe: false }
      );
    }
  }

  useEffect(() => {
    if (metadataState.repoURL && isValidGitHubRepoLink(metadataState.repoURL)) {
      fetchLabelsFromRepo(metadataState.repoURL);
    }
  }, [metadataState]);

  const formUpdate =
    ({ path, via: customFieldUpdate, isColumnsUpdate, ...params }) =>
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
        (isColumnsUpdate ? { columns: columnsState } : metadataState) ?? {},
        path,
        (node) => transformFn(node)
      );
      if (isColumnsUpdate) {
        setColumnsState(updatedValues?.columns);
      } else {
        setMetadata((prevFormState) => ({
          ...prevFormState,
          ...updatedValues,
        }));
      }
    };

  const formReset = () => {
    setColumnsState(getColumnData(initialBoardState));
    setMetadata(getNonColumnData(initialBoardState));
    setParentState(initialBoardState);
  };

  const newViewInit = () => {
    setColumnsState(getColumnData(GithubKanbanBoardDefaults));
    setMetadata(getNonColumnData(GithubKanbanBoardDefaults));
    setParentState(GithubKanbanBoardDefaults);
  };

  const columnsCreateNew = ({ lastKnownValue }) =>
    Object.keys(lastKnownValue).length < settings.maxColumnsNumber
      ? {
          ...(lastKnownValue ?? {}),
          ...withUUIDIndex({
            description: "",
            labelSearchTerms: [],
            title: "",
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

  const updateParentState = () => {
    const updatedState = { ...metadataState, columns: columnsState };
    setParentState(updatedState);
    return updatedState;
  };

  const onSave = () => onSubmit(updateParentState());

  const formElement = (
    <>
      <div className="d-flex flex-column">
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
          props={{
            className: "w-100",
            key: `${metadataState.metadata.id}-repoURL`,
            label: "Repository URL",
            onChange: formUpdate({
              path: ["repoURL"],
              isColumnsUpdate: false,
            }),
            placeholder: "https://github.com/example-org/example-repo",
            value: metadataState.repoURL,
          }}
        />
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
          props={{
            className: "w-100",
            key: `${metadataState.metadata.id}-title`,
            label: "Title",
            onChange: formUpdate({ path: ["title"], isColumnsUpdate: false }),
            placeholder: "NEAR Protocol NEPs",
            value: metadataState.title,
          }}
        />
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
          props={{
            className: "w-100",
            key: `${metadataState.metadata.id}-description`,
            label: "Description",
            onChange: formUpdate({
              path: ["description"],
              isColumnsUpdate: false,
            }),
            placeholder: "Latest NEAR Enhancement Proposals by status.",
            value: metadataState.description,
          }}
        />
      </div>
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.organism.Configurator`}
        props={{
          heading: "Ticket types",
          classNames: { root: "col-12 col-md-4 h-auto" },
          externalState: metadataState.dataTypesIncluded,
          isActive: true,
          isEmbedded: true,
          isUnlocked: permissions.can_configure,
          onChange: formUpdate({
            path: ["dataTypesIncluded"],
            isColumnsUpdate: false,
          }),
          schema: GithubKanbanBoardTicketTypesSchema,
          hideSubmitBtn: true,
        }}
      />
      <div>
        <label>Select which state of tickets you want to display</label>
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Switch`}
          props={{
            currentValue: metadataState.ticketState,
            key: "ticketState",
            onChange: formUpdate({
              path: ["ticketState"],
              isColumnsUpdate: false,
            }),
            options: [
              { label: "All", value: "all" },
              { label: "Open", value: "open" },
              { label: "Closed", value: "closed" },
            ],
          }}
        />
      </div>
      <div>
        <label>
          Select which items you want to display on each card in a column
        </label>
        <Widget
          src={`${REPL_DEVHUB}/widget/devhub.components.organism.Configurator`}
          props={{
            heading: "Card fields",
            classNames: { root: "col-12 col-md-4 h-auto" },
            externalState: metadataState.metadata.ticket.features,
            isActive: true,
            isEmbedded: true,
            isUnlocked: permissions.can_configure,
            onChange: formUpdate({
              path: ["metadata", "ticket", "features"],
              isColumnsUpdate: false,
            }),
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
        {Object.values(columnsState ?? {}).map(
          ({ id, description, labelSearchTerms, title }, index) => (
            <AttractableDiv
              className="d-flex gap-3 rounded-4 border p-3 w-100"
              key={`column-${id}-configurator`}
            >
              <div className="d-flex flex-column gap-1 w-100">
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
                  props={{
                    className: "flex-grow-1",
                    key: `${metadataState.metadata.id}-column-${id}-title`,
                    label: "Title",
                    onChange: formUpdate({
                      path: ["columns", id, "title"],
                      isColumnsUpdate: true,
                    }),
                    placeholder: "👀 Review",
                    value: title,
                  }}
                />
                <label>
                  Search terms for all the labels MUST be presented in included
                  tickets
                </label>
                <Typeahead
                  id="hashtags"
                  onChange={formUpdate({
                    path: ["columns", id, "labelSearchTerms"],
                    isColumnsUpdate: true,
                  })}
                  selected={""}
                  multiple
                  labelKey="hashtags"
                  emptyLabel="Find your unique label"
                  placeholder="WG-, draft, review, proposal,"
                  options={repoLabels}
                />
                <Widget
                  src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Input`}
                  props={{
                    className: "flex-grow-1",
                    key: `${metadataState.metadata.id}-column-${id}-description`,
                    label: "Description",
                    onChange: formUpdate({
                      path: ["columns", id, "description"],
                      isColumnsUpdate: true,
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
                    isColumnsUpdate: true,
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
            onClick={() => {
              updateParentState();
              setPreview(true);
            }}
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
                [parentState.metadata.id]: parentState,
              },
            }}
          />
        </div>
      ) : (
        <div className={"d-flex flex-column gap-4 w-100"}>
          <div className={"d-flex flex-column gap-2 w-100"}>
            <div className="d-flex align-items-center justify-content-between gap-3 w-100">
              <h5 className="h5 d-inline-flex gap-2 m-0">
                <i className="bi bi-gear-wide-connected" />
                <span>GitHub board configuration</span>
              </h5>
            </div>
            <div>
              This configuration enables integration of your GitHub repository
              as a Kanban board, facilitating issue and pull request tracking.
              You can create distinct columns to organize various items, each
              with unique labels.
            </div>
          </div>
          {Object.keys(parentState).length > 0 && (
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
                    parentState.columns &&
                    Object.keys(parentState.columns).length >=
                      settings.maxColumnsNumber,
                  icon: { type: "bootstrap_icon", variant: "bi-plus-lg" },
                  onClick: formUpdate({
                    path: ["columns"],
                    via: columnsCreateNew,
                    isColumnsUpdate: true,
                  }),
                }}
              />
            </div>
          )}

          {!Object.keys(parentState).length && (
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
