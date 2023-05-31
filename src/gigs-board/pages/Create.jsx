/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

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

initState({
  seekingFunding: false,
  //
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
  token: props.token ?? "NEAR",
  supervisor: props.supervisor ?? "neardevgov.near",
  githubLink: props.githubLink ?? "",
  warning: "",
});

// This must be outside onClick, because Near.view returns null at first, and when the view call finished, it returns true/false.
// If checking this inside onClick, it will give `null` and we cannot tell the result is true or false.
let grantNotify = Near.view("social.near", "is_write_permission_granted", {
  predecessor_id: nearDevGovGigsContractAccountId,
  key: context.accountId + "/index/notify",
});
if (grantNotify === null) {
  return;
}

const onSubmit = () => {
  let labels = state.labelStrings;

  let body = {
    name: state.name,
    description: generateDescription(
      state.description,
      state.amount,
      state.token,
      state.supervisor
    ),
  };

  if (state.postType === "Solution") {
    body = {
      ...body,
      post_type: "Submission",
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
      contractName: nearDevGovGigsContractAccountId,
      methodName: "add_post",
      args: {
        parent_id: parentId,
        labels,
        body: body,
      },
      deposit: Big(10).pow(21).mul(2),
      gas: Big(10).pow(12).mul(100),
    });
  } else if (mode == "Edit") {
    txn.push({
      contractName: nearDevGovGigsContractAccountId,
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
          predecessor_id: nearDevGovGigsContractAccountId,
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
  Near.asyncView(nearDevGovGigsContractAccountId, "is_allowed_to_use_labels", {
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
    Near.asyncView(
      nearDevGovGigsContractAccountId,
      "is_allowed_to_use_labels",
      { editor: context.accountId, labels: [removed] }
    ).then((allowed) => {
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
  Near.view(nearDevGovGigsContractAccountId, "get_all_allowed_labels", {
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
          Near.view(
            nearDevGovGigsContractAccountId,
            "is_allowed_to_use_labels",
            { editor: context.accountId, labels: [props.text] }
          )
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
    <textarea
      value={state.description}
      type="text"
      rows={6}
      className="form-control"
      onChange={(event) => State.update({ description: event.target.value })}
    />
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
        aria-label="Default select example"
      >
        <option selected value="NEAR">
          NEAR
        </option>
        <option value="USDC">USDC</option>
        <option value="USD">USD</option>
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

function generateDescription(text, amount, token, supervisor) {
  const funding = `###### Requested amount: ${amount} ${token}\n###### Requested sponsor: @${supervisor}\n`;
  if (amount > 0 && token && supervisor) return funding + text;
  return text;
}

return (
  <div class="bg-light d-flex flex-column flex-grow-1">
    {widget("components.layout.Banner")}
    <div class="mx-5 mb-5">
      <div aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a
              style={{
                color: "#3252A6",
              }}
              className="fw-bold"
              href={href("Feed")}
            >
              DevHub
            </a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Create new
          </li>
        </ol>
      </div>
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
            {widget("components.posts.Post", {
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
                    state.supervisor
                  ),
                  github_link: state.githubLink,
                },
              },
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);
