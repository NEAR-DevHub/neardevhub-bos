const { Tile } = VM.require(
  `${REPL_DEVHUB}/widget/devhub.components.molecule.Tile`
) || { Tile: () => <></> };

const item = {
  path: `${REPL_TREASURY_TEMPLAR_CONTRACT}/profile/**`,
};

const profile = Social.get(item.path);

if (!profile.description) {
  <div
    style={{ height: "50vh" }}
    className="d-flex justify-content-center align-items-center w-100"
  >
    <Widget src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Spinner`} />
  </div>;
}

const initialData = profile.description;
const [content, setContent] = useState(null);
const [showCommentToast, setCommentToast] = useState(false);
const [handler, setHandler] = useState(null);
const [isTxnCreated, setTxnCreated] = useState(false);

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
`;

const hasDataChanged = () => {
  return content !== initialData;
};

const handlePublish = () => {
  setTxnCreated(true);
  Near.call([
    {
      contractName: "${REPL_TREASURY_TEMPLAR_CONTRACT}",
      methodName: "set_social_db_profile_description",
      args: { description: content },
      gas: 270000000000000,
    },
  ]);
};

useEffect(() => {
  if (isTxnCreated) {
    const checkForAboutInSocialDB = () => {
      Near.asyncView(REPL_SOCIAL_CONTRACT, "get", {
        keys: [item.path],
      }).then((result) => {
        try {
          const submittedAboutText = content;
          const lastAboutTextFromSocialDB =
            result["${REPL_TREASURY_TEMPLAR_CONTRACT}"].profile.description;
          if (submittedAboutText === lastAboutTextFromSocialDB) {
            setTxnCreated(false);
            setCommentToast(true);
            return;
          }
        } catch (e) {}
        setTimeout(() => checkForAboutInSocialDB(), 2000);
      });
    };
    checkForAboutInSocialDB();
  }
}, [isTxnCreated]);

useEffect(() => {
  if (!content && initialData) {
    setContent(initialData);
    setHandler("update");
  }
}, [initialData]);

function Preview() {
  return (
    <Tile className="p-3" style={{ background: "white", minHeight: "500px" }}>
      <Widget
        src={`${REPL_DEVHUB}/widget/devhub.components.molecule.SimpleMDEViewer`}
        props={{
          content: content,
          height: "500px",
        }}
      />
    </Tile>
  );
}

return (
  <Container>
    <Widget
      src={`${REPL_NEAR}/widget/DIG.Toast`}
      props={{
        title: "About page updated successfully",
        type: "success",
        open: showCommentToast,
        onOpenChange: (v) => setCommentToast(v),
        trigger: <></>,
        providerProps: { duration: 3000 },
      }}
    />
    <ul className="nav nav-tabs" id="editPreviewTabs" role="tablist">
      <li className="nav-item" role="presentation">
        <button
          className="nav-link active"
          id="edit-tab"
          data-bs-toggle="tab"
          data-bs-target="#edit"
          type="button"
          role="tab"
          aria-controls="edit"
          aria-selected="true"
        >
          Edit
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="preview-tab"
          data-bs-toggle="tab"
          data-bs-target="#preview"
          type="button"
          role="tab"
          aria-controls="preview"
          aria-selected="false"
        >
          Preview
        </button>
      </li>
    </ul>
    <div className="tab-content" id="editPreviewTabsContent">
      <div
        className="tab-pane show active py-4"
        id="edit"
        role="tabpanel"
        aria-labelledby="edit-tab"
      >
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.molecule.SimpleMDE`}
          props={{
            data: { handler: handler, content: content },
            onChangeKeyup: (v) => {
              setContent(v);
            },
            showAutoComplete: true,
          }}
        />

        <div
          className={"d-flex align-items-center justify-content-end gap-3 mt-4"}
        >
          <Widget
            src={`${REPL_DEVHUB}/widget/devhub.components.molecule.Button`}
            props={{
              classNames: { root: "btn-success" },
              disabled: !hasDataChanged(),
              icon: {
                type: "bootstrap_icon",
                variant: "bi-check-circle-fill",
              },
              label: "Publish",
              onClick: handlePublish,
            }}
          />
        </div>
      </div>
      <div
        className="tab-pane"
        id="preview"
        role="tabpanel"
        aria-labelledby="preview-tab"
        style={{ position: "relative" }}
      >
        <div className="w-100 h-100 py-4">
          <Preview />
        </div>
      </div>
    </div>
  </Container>
);
