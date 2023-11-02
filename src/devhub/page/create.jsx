const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

/* INCLUDE: "core/lib/autocomplete" */
const autocompleteEnabled = true;

const AutoComplete = styled.div`
  z-index: 5;

  > div > div {
    padding: calc(var(--padding) / 2);
  }
`;

function textareaInputHandler(value) {
  const showAccountAutocomplete = /@[\w][^\s]*$/.test(value);
  State.update((lastKnownState) => ({
    ...lastKnownState,
    text: value,
    showAccountAutocomplete,
  }));
}

function autoCompleteAccountId(id) {
  let description = state.description.replace(/[\s]{0,1}@[^\s]*$/, "");
  description = `${description} @${id}`.trim() + " ";
  State.update((lastKnownState) => ({
    ...lastKnownState,
    description,
    showAccountAutocomplete: false,
  }));
}
/* END_INCLUDE: "core/lib/autocomplete" */

const DRAFT_STATE_STORAGE_KEY = "DRAFT_STATE";
const parentId = props.parentId ?? null;
const postId = props.postId ?? null;
const mode = props.mode ?? "Create";

const referralLabels = props.referral ? [`referral:${props.referral}`] : [];
const labelStrings = (props.labels ? props.labels.split(",") : []).concat(
  referralLabels
);
const labels = labelStrings.map((s) => {
  return { name: s };
});

State.init({
  seekingFunding: false,

  author_id: context.accountId,
  // Should be a list of objects with field "name".
  labels,
  // Should be a list of labels as strings.
  // Both of the label structures should be modified together.
  labelStrings,
  postType: "Idea",
  name: props.name ?? "",
  description: props.description ?? "",
  amount: props.amount ?? "",
  token: props.token ?? "USDT",
  supervisor: props.supervisor ?? "neardevdao.near",
  githubLink: props.githubLink ?? "",
  warning: "",
  waitForDraftStateRestore: true,
});

if (state.waitForDraftStateRestore) {
  const draftstatestring = Storage.privateGet(DRAFT_STATE_STORAGE_KEY);
  if (draftstatestring != null) {
    if (props.transactionHashes) {
      State.update({ waitForDraftStateRestore: false });
      Storage.privateSet(DRAFT_STATE_STORAGE_KEY, undefined);
    } else {
      try {
        const draftstate = JSON.parse(draftstatestring);
        State.update(draftstate);
      } catch (e) {
        console.error("error restoring draft", draftstatestring);
      }
    }
    State.update({ waitForDraftStateRestore: false });
  }
}

// This must be outside onClick, because Near.view returns null at first, and when the view call finished, it returns true/false.
// If checking this inside onClick, it will give `null` and we cannot tell the result is true or false.
let grantNotify = Near.view("social.near", "is_write_permission_granted", {
  predecessor_id: "${REPL_DEVHUB_CONTRACT}",
  key: context.accountId + "/index/notify",
});
if (grantNotify === null) {
  return;
}

const onSubmit = () => {
  Storage.privateSet(DRAFT_STATE_STORAGE_KEY, JSON.stringify(state));

  let labels = state.labelStrings;

  let body = {
    name: state.name,
    description: generateDescription(
      state.description,
      state.amount,
      state.token,
      state.supervisor,
      state.seekingFunding
    ),
  };

  if (state.postType === "Solution") {
    body = {
      ...body,
      post_type: "Solution",
      submission_version: "V1",
    };
  } else {
    // Idea
    body = {
      ...body,
      post_type: "Idea",
      idea_version: "V1",
    };
  }

  if (!context.accountId) return;

  let txn = [];
  if (mode == "Create") {
    txn.push({
      contractName: "${REPL_DEVHUB_CONTRACT}",
      methodName: "add_post",
      args: {
        parent_id: parentId,
        labels,
        body: body,
      },
      deposit: Big(10).pow(21).mul(3),
      gas: Big(10).pow(12).mul(100),
    });
  } else if (mode == "Edit") {
    txn.push({
      contractName: "${REPL_DEVHUB_CONTRACT}",
      methodName: "edit_post",
      args: {
        id: postId,
        labels,
        body: body,
      },
      deposit: Big(10).pow(21).mul(2),
      gas: Big(10).pow(12).mul(100),
    });
  }
  if (mode == "Create" || mode == "Edit") {
    if (grantNotify === false) {
      txn.unshift({
        contractName: "social.near",
        methodName: "grant_write_permission",
        args: {
          predecessor_id: "${REPL_DEVHUB_CONTRACT}",
          keys: [context.accountId + "/index/notify"],
        },
        deposit: Big(10).pow(23),
        gas: Big(10).pow(12).mul(30),
      });
    }
    Near.call(txn);
  }
};

const onIdeaClick = () => {
  State.update({ postType: "Idea", seekingFunding: false });
};

const onSolutionClick = () => {
  State.update({ postType: "Solution" });
};

const normalizeLabel = (label) =>
  label
    .replaceAll(/[- \.]/g, "_")
    .replaceAll(/[^\w]+/g, "")
    .replaceAll(/_+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase()
    .trim("-");

const checkLabel = (label) => {
  Near.asyncView("${REPL_DEVHUB_CONTRACT}", "is_allowed_to_use_labels", {
    editor: context.accountId,
    labels: [label],
  }).then((allowed) => {
    if (allowed) {
      State.update({ warning: "" });
    } else {
      State.update({
        warning:
          'The label "' +
          label +
          '" is protected and can only be added by moderators',
      });
      return;
    }
  });
};

const setLabels = (labels) => {
  labels = labels.map((o) => {
    o.name = normalizeLabel(o.name);
    return o;
  });
  if (labels.length < state.labels.length) {
    let oldLabels = new Set(state.labels.map((label) => label.name));
    for (let label of labels) {
      oldLabels.delete(label.name);
    }
    let removed = oldLabels.values().next().value;
    Near.asyncView("${REPL_DEVHUB_CONTRACT}", "is_allowed_to_use_labels", {
      editor: context.accountId,
      labels: [removed],
    }).then((allowed) => {
      if (allowed) {
        let labelStrings = labels.map(({ name }) => name);
        State.update({ labels, labelStrings });
      } else {
        State.update({
          warning:
            'The label "' +
            removed +
            '" is protected and can only be updated by moderators',
        });
        return;
      }
    });
  } else {
    let labelStrings = labels.map((o) => {
      return o.name;
    });
    State.update({ labels, labelStrings });
  }
};
const existingLabelStrings =
  Near.view("${REPL_DEVHUB_CONTRACT}", "get_all_allowed_labels", {
    editor: context.accountId,
  }) ?? [];
const existingLabelSet = new Set(existingLabelStrings);
const existingLabels = existingLabelStrings.map((s) => {
  return { name: s };
});

const labelEditor = (
  <div className="col-lg-12 mb-2">
    <p className="fs-6 fw-bold mb-1">Labels</p>
    <Typeahead
      multiple
      labelKey="name"
      onInputChange={checkLabel}
      onChange={setLabels}
      options={existingLabels}
      placeholder="near.social, widget, NEP, standard, protocol, tool"
      selected={state.labels}
      positionFixed
      allowNew={(results, props) => {
        return (
          !existingLabelSet.has(props.text) &&
          props.selected.filter((selected) => selected.name === props.text)
            .length == 0 &&
          Near.view("${REPL_DEVHUB_CONTRACT}", "is_allowed_to_use_labels", {
            editor: context.accountId,
            labels: [props.text],
          })
        );
      }}
    />
  </div>
);

const nameDiv = (
  <div className="col-lg-6 mb-2">
    <p className="fs-6 fw-bold mb-1">Title</p>
    <input
      type="text"
      value={state.name}
      onChange={(event) => State.update({ name: event.target.value })}
    />
  </div>
);

const descriptionDiv = (
  <div className="col-lg-12 mb-2">
    <p className="fs-6 fw-bold mb-1">Description</p>
    <Widget
      src="${REPL_DEVHUB}/widget/devhub.components.molecule.MarkdownEditor"
      props={{
        data: { handler: state.handler, content: state.description },
        onChange: (content) => {
          State.update({ description: content, handler: "update" });
          textareaInputHandler(content);
        },
      }}
    />
    {autocompleteEnabled && state.showAccountAutocomplete && (
      <AutoComplete>
        <Widget
          src="${REPL_NEAR}/widget/AccountAutocomplete"
          props={{
            term: state.text.split("@").pop(),
            onSelect: autoCompleteAccountId,
            onClose: () => State.update({ showAccountAutocomplete: false }),
          }}
        />
      </AutoComplete>
    )}
  </div>
);

const isFundraisingDiv = (
  // This is jank with just btns and not radios. But the radios were glitchy af
  <>
    <div class="mb-2">
      <p class="fs-6 fw-bold mb-1">
        Are you seeking funding for your solution?
        <span class="text-muted fw-normal">(Optional)</span>
      </p>
      <div class="form-check form-check-inline">
        <label class="form-check-label">
          <button
            className="btn btn-light p-0"
            style={{
              backgroundColor: state.seekingFunding ? "#0C7283" : "inherit",
              color: "#f3f3f3",
              border: "solid #D9D9D9",
              borderRadius: "100%",
              height: "20px",
              width: "20px",
            }}
            onClick={() => State.update({ seekingFunding: true })}
          />
          Yes
        </label>
      </div>
      <div class="form-check form-check-inline">
        <label class="form-check-label">
          <button
            className="btn btn-light p-0"
            style={{
              backgroundColor: !state.seekingFunding ? "#0C7283" : "inherit",
              color: "#f3f3f3",
              border: "solid #D9D9D9",
              borderRadius: "100%",
              height: "20px",
              width: "20px",
            }}
            onClick={() => State.update({ seekingFunding: false })}
          />
          No
        </label>
      </div>
    </div>
  </>
);

const fundraisingDiv = (
  <div class="d-flex flex-column mb-2">
    <div className="col-lg-6  mb-2">
      Currency
      <select
        onChange={(event) => State.update({ token: event.target.value })}
        class="form-select"
        aria-label="Default select"
      >
        <option selected value="USDT">
          USDT
        </option>
        <option value="NEAR">NEAR</option>
      </select>
    </div>
    <div className="col-lg-6 mb-2">
      Requested amount <span class="text-muted fw-normal">(Numbers Only)</span>
      <input
        type="number"
        value={parseInt(state.amount) > 0 ? state.amount : ""}
        min={0}
        onChange={(event) =>
          State.update({
            amount: Number(
              event.target.value.toString().replace(/e/g, "")
            ).toString(),
          })
        }
      />
    </div>
    <div className="col-lg-6 mb-2">
      <p class="mb-1">
        Requested sponsor <span class="text-muted fw-normal">(Optional)</span>
      </p>
      <p style={{ fontSize: "13px" }} class="m-0 text-muted fw-light">
        If you are requesting funding from a specific sponsor, please enter
        their username.
      </p>
      <div class="input-group flex-nowrap">
        <span class="input-group-text" id="addon-wrapping">
          @
        </span>
        <input
          type="text"
          class="form-control"
          placeholder="Enter username"
          value={state.supervisor}
          onChange={(event) => State.update({ supervisor: event.target.value })}
        />
      </div>
    </div>
  </div>
);

function generateDescription(text, amount, token, supervisor, seekingFunding) {
  const fundingText =
    amount > 0 && token ? `###### Requested amount: ${amount} ${token}\n` : "";
  const supervisorText = supervisor
    ? `###### Requested sponsor: @${supervisor}\n`
    : "";
  return seekingFunding ? `${fundingText}${supervisorText}${text}` : text;
}

return (
  <div class="bg-light d-flex flex-column flex-grow-1 w-100">
    <div class="mx-5 mb-5">
      <div aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <Link
              style={{
                color: "#3252A6",
              }}
              className="fw-bold"
              to={href({
                widgetSrc: "${REPL_DEVHUB}/widget/app",
                params: { page: "feed" },
              })}
            >
              DevHub
            </Link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Create new
          </li>
        </ol>
      </div>
      {props.transactionHashes ? (
        <>
          Post created successfully. Back to{" "}
          <Link
            style={{
              color: "#3252A6",
            }}
            className="fw-bold"
            to={href({
              widgetSrc: "${REPL_DEVHUB}/widget/app",
              params: { page: "feed" },
            })}
          >
            feed
          </Link>
        </>
      ) : (
        <>
          <h4>Create a new post</h4>
          <p>{state.seekingFunding}</p>
          <div class="card border-light">
            <div class="card-body">
              <p class="card-title fw-bold fs-6">What do you want to create?</p>
              <div class="d-flex flex-row gap-2">
                <button
                  onClick={onIdeaClick}
                  type="button"
                  class={`btn btn-outline-secondary`}
                  style={
                    state.postType === "Idea"
                      ? {
                          backgroundColor: "#0C7283",
                          color: "#f3f3f3",
                        }
                      : {}
                  }
                >
                  <i class="bi bi-lightbulb"></i>
                  Idea
                </button>
                <button
                  onClick={onSolutionClick}
                  type="button"
                  class={`btn btn-outline-secondary`}
                  style={
                    state.postType !== "Idea"
                      ? {
                          backgroundColor: "#0C7283",
                          color: "#f3f3f3",
                        }
                      : {}
                  }
                >
                  <i class="bi bi-rocket"></i>
                  Solution
                </button>
              </div>
              <p class="text-muted w-75 my-1">
                {state.postType === "Idea"
                  ? "Get feedback from the community about a problem, opportunity, or need."
                  : "Provide a specific proposal or implementation to an idea, optionally requesting funding. If your solution relates to an existing idea, please reply to the original post with a solution."}
              </p>
              {state.warning && (
                <div
                  class="alert alert-warning alert-dismissible fade show"
                  role="alert"
                >
                  {state.warning}
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => State.update({ warning: "" })}
                  ></button>
                </div>
              )}
              <div className="row">
                {nameDiv}
                {descriptionDiv}
                {labelEditor}
                {state.postType === "Solution" && isFundraisingDiv}
                {state.seekingFunding && fundraisingDiv}
              </div>
              <button
                style={{
                  width: "7rem",
                  backgroundColor: "#0C7283",
                  color: "#f3f3f3",
                }}
                disabled={
                  state.seekingFunding && (!state.amount || state.amount < 1)
                }
                className="btn btn-light mb-2 p-3"
                onClick={onSubmit}
              >
                Submit
              </button>
            </div>
            <div class="bg-light d-flex flex-row p-1 border-bottom"></div>
            <div class="card-body">
              <p class="text-muted m-0">Preview</p>
              <div>
                <Widget
                  src="${REPL_DEVHUB}/widget/devhub.entity.post.Post"
                  props={{
                    isPreview: true,
                    id: 0, // irrelevant
                    post: {
                      author_id: state.author_id,
                      likes: [],
                      snapshot: {
                        editor_id: state.editor_id,
                        labels: state.labelStrings,
                        post_type: state.postType,
                        name: state.name,
                        description: generateDescription(
                          state.description,
                          state.amount,
                          state.token,
                          state.supervisor,
                          state.seekingFunding
                        ),
                        github_link: state.githubLink,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);
