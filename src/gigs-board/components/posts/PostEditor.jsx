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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}

const WrapperWidget = ({ children, id }) => {
  const storageType = "local"; // Hard-coded storage type

  // This function handles the state change for the children widgets
  const handleStateChange = (key, value) => {
    // Use the unique identifier to create a unique storage key
    const storageKey = `${id}_${key}`;

    console.log(`Setting value for ${storageKey}: `, value); // Console log added here

    // Update the local storage with the new state
    localStorage.setItem(storageKey, JSON.stringify(value));
    console.log(`State saved in local storage for ${storageKey}`); // Console log added here
  };

  // This function initializes the state of the children widgets
  const initState = (key, defaultValue) => {
    // Use the unique identifier to create a unique storage key
    const storageKey = `${id}_${key}`;

    let storedValue = localStorage.getItem(storageKey);
    console.log(
      `Retrieved value from local storage for ${storageKey}: `,
      storedValue
    ); // Console log added here

    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (e) {
        console.error("Error parsing JSON from storage", e);
      }
    }
    return defaultValue;
  };

  // Render the children widgets and pass the state management functions as props
  return React.Children.map(children, (child) =>
    child && typeof child === "object"
      ? React.cloneElement(child, { handleStateChange, initState })
      : child
  );
};
/* END_INCLUDE: "common.jsx" */

const postType = props.postType ?? "Sponsorship";
const parentId = props.parentId ?? null;
const postId = props.postId ?? null;
const mode = props.mode ?? "Create";

const referralLabels = props.referral ? [`referral:${props.referral}`] : [];
const labelStrings = (props.labels ?? []).concat(referralLabels);
const labels = labelStrings.map((s) => {
  return { name: s };
});

const initState = props.initState;
const handleStateChange = props.handleStateChange;

initState({
  author_id: context.accountId,
  labels,
  labelStrings,
  postType,
  name: props.name ?? "",
  description: props.description ?? "",
  amount: props.amount ?? "0",
  token: props.token ?? "Near",
  supervisor: props.supervisor ?? "",
  githubLink: props.githubLink ?? "",
  warning: "",
});
const savedState = localStorage.getItem("widgetState");
if (savedState) {
  handleStateChange(JSON.parse(savedState));
}

let fields = {
  Comment: ["description"],
  Idea: ["name", "description"],
  Submission: ["name", "description"],
  Attestation: ["name", "description"],
  Sponsorship: [
    "name",
    "description",
    "amount",
    "sponsorship_token",
    "supervisor",
  ],
  Github: ["githubLink", "name", "description"],
}[postType];

// This must be outside onClick, because Near.view returns null at first, and when the view call finished, it returns true/false.
// If checking this inside onClick, it will give `null` and we cannot tell the result is true or false.
let grantNotify = Near.view("social.near", "is_write_permission_granted", {
  predecessor_id: nearDevGovGigsContractAccountId,
  key: context.accountId + "/index/notify",
});
if (grantNotify === null) {
  return;
}
const onClick = () => {
  let labels = state.labelStrings;
  var body = {
    Comment: { description: state.description, comment_version: "V2" },
    Idea: {
      name: state.name,
      description: state.description,
      idea_version: "V1",
    },
    Submission: {
      name: state.name,
      description: state.description,
      submission_version: "V1",
    },
    Attestation: {
      name: state.name,
      description: state.description,
      attestation_version: "V1",
    },
    Sponsorship: {
      name: state.name,
      description: state.description,
      amount: state.amount,
      sponsorship_token: state.token,
      supervisor: state.supervisor,
      sponsorship_version: "V1",
    },
    Github: {
      name: state.name,
      description: state.description,
      github_version: "V0",
      github_link: state.githubLink,
    },
  }[postType];
  body["post_type"] = postType;
  if (!context.accountId) {
    return;
  }
  let txn = [];
  if (mode == "Create") {
    txn.push({
      contractName: nearDevGovGigsContractAccountId,
      methodName: "add_post",
      args: {
        parent_id: parentId,
        labels,
        body,
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
        body,
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

const githubLinkDiv = fields.includes("githubLink") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Github Issue URL:
      <input
        type="text"
        value={state.githubLink}
        onChange={(event) => State.update({ githubLink: event.target.value })}
      />
    </div>
  </WrapperWidget>
) : null;

const nameDiv = fields.includes("name") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Name:
      <input
        type="text"
        value={state.name}
        onChange={(event) => State.update({ name: event.target.value })}
      />
    </div>
  </WrapperWidget>
) : null;

const descriptionDiv = fields.includes("description") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Description:
      <textarea
        rows="5"
        value={state.description}
        onChange={(event) => State.update({ description: event.target.value })}
      />
    </div>
  </WrapperWidget>
) : null;

const amountDiv = fields.includes("amount") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Amount:
      <input
        type="text"
        value={state.amount}
        onChange={(event) => State.update({ amount: event.target.value })}
      />
    </div>
  </WrapperWidget>
) : null;

const tokenDiv = fields.includes("sponsorship_token") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Token:
      <input
        type="text"
        value={state.token}
        onChange={(event) => State.update({ token: event.target.value })}
      />
    </div>
  </WrapperWidget>
) : null;

const supervisorDiv = fields.includes("supervisor") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Supervisor:
      <input
        type="text"
        value={state.supervisor}
        onChange={(event) => State.update({ supervisor: event.target.value })}
      />
    </div>
  </WrapperWidget>
) : null;

const labelDiv = fields.includes("labels") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Labels:
      <input
        type="text"
        value={state.labelStrings.join(",")}
        onChange={(event) => {
          let labels = event.target.value.split(",");
          labels = labels.map((o) => {
            o = o.trim();
            checkLabel(o);
            return { name: o };
          });
          State.update({ labels, labelStrings: event.target.value.split(",") });
        }}
      />
    </div>
  </WrapperWidget>
) : null;

const postTypeDiv = fields.includes("post_type") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Post Type:
      <select
        value={state.postType}
        onChange={(event) => State.update({ postType: event.target.value })}
      >
        <option value="Proposal">Proposal</option>
        <option value="Issue">Issue</option>
        <option value="Grant">Grant</option>
      </select>
    </div>
  </WrapperWidget>
) : null;

const grantNotifyDiv = fields.includes("grantNotify") ? (
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Grant Notify:
      <input
        type="checkbox"
        checked={state.grantNotify}
        onChange={(event) =>
          State.update({ grantNotify: event.target.checked })
        }
      />
    </div>
  </WrapperWidget>
) : null;

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
  <WrapperWidget>
    <div className="col-lg-12  mb-2">
      Labels:
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
  </WrapperWidget>
);

const updateStateAndSaveToLocalStorage = (newState) => {
  handleStateChange(newState);
  localStorage.setItem("widgetState", JSON.stringify(State.get()));
};

// Then replace all State.update calls in your code with updateStateAndSaveToLocalStorage:
// Example:
updateStateAndSaveToLocalStorage({ name: this.state.target.value });

// const githubLinkDiv = fields.includes("githubLink") ? (
//   <WrapperWidget id={props.text} storageType={localStorage} children={props}>
//     <div className="col-lg-12  mb-2">
//       Github Issue URL:
//       <input
//         type="text"
//         value={state.githubLink}
//         onChange={(event) => State.update({ githubLink: event.target.value })}
//       />
//     </div>
//   </WrapperWidget>
// ) : null;

// const nameDiv = fields.includes("name") ? (
//   <WrapperWidget id={props.text} storageType={localStorage} children={props}>
//     <div className="col-lg-6  mb-2">
//       Title:
//       <input
//         type="text"
//         value={state.name}
//         onChange={(event) => State.update({ name: event.target.value })}
//       />
//     </div>
//   </WrapperWidget>
// ) : null;

// const descriptionDiv = fields.includes("description") ? (
//   <WrapperWidget id={props.text} storageType={localStorage} children={props}>
//     <div className="col-lg-12  mb-2">
//       Description:
//       <br />
//       <textarea
//         value={state.description}
//         type="text"
//         rows={6}
//         className="form-control"
//         onChange={(event) => State.update({ description: event.target.value })}
//       />
//     </div>
//   </WrapperWidget>
// ) : null;

// const amountDiv = fields.includes("amount") ? (
//   <WrapperWidget id={props.text} storageType={localStorage} children={props}>
//     <div className="col-lg-6  mb-2">
//       Amount:
//       <input
//         type="text"
//         value={state.amount}
//         onChange={(event) => State.update({ amount: event.target.value })}
//       />
//     </div>
//   </WrapperWidget>
// ) : null;

// const tokenDiv = fields.includes("sponsorship_token") ? (
//   <WrapperWidget id={props.text} storageType={localStorage} children={props}>
//     <div className="col-lg-6  mb-2">
//       Tokens:
//       <input
//         type="text"
//         value={state.token}
//         onChange={(event) => State.update({ token: event.target.value })}
//       />
//     </div>
//   </WrapperWidget>
// ) : null;

// const supervisorDiv = fields.includes("supervisor") ? (
//   <WrapperWidget id={props.text} storageType={localStorage} children={props}>
//     <div className="col-lg-6 mb-2">
//       Supervisor:
//       <input
//         type="text"
//         value={state.supervisor}
//         onChange={(event) => State.update({ supervisor: event.target.value })}
//       />
//     </div>
//   </WrapperWidget>
// ) : null;

const disclaimer = (
  <p>
    <i>
      * Note, all projects that were granted sponsorships are required to pass
      KYC to receive the funding.
    </i>
  </p>
);

const renamedPostType = postType == "Submission" ? "Solution" : postType;
// Below there is a weird code with fields.includes("githubLink") ternary operator.
// This is to hack around rendering bug of near.social.
return (
  <WrapperWidget>
    <div className="card">
      <div className="card-header">
        {mode} {renamedPostType}
      </div>

      <div class="card-body">
        {state.warning ? (
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
        ) : (
          <></>
        )}
        {fields.includes("githubLink") ? (
          <div className="row">
            {githubLinkDiv}
            {labelEditor}
            {nameDiv}
            {descriptionDiv}
          </div>
        ) : (
          <div className="row">
            {labelEditor}
            {nameDiv}
            {amountDiv}
            {tokenDiv}
            {supervisorDiv}
            {descriptionDiv}
          </div>
        )}

        <a className="btn btn-outline-primary mb-2" onClick={onClick}>
          Submit
        </a>
        {disclaimer}
      </div>
      <div class="card-footer">
        Preview:
        {widget("components.posts.Post", {
          isPreview: true,
          id: 0, // irrelevant
          post: {
            author_id: state.author_id,
            likes: [],
            snapshot: {
              editor_id: state.editor_id,
              labels: state.labelStrings,
              post_type: postType,
              name: state.name,
              description: state.description,
              amount: state.amount,
              sponsorship_token: state.token,
              supervisor: state.supervisor,
              github_link: state.githubLink,
            },
          },
        })}
      </div>
    </div>
  </WrapperWidget>
);
