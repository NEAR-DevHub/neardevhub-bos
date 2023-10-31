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
  State.update({ text: value, showAccountAutocomplete });
}

function autoCompleteAccountId(id) {
  let description = state.description.replace(/[\s]{0,1}@[^\s]*$/, "");
  description = `${description} @${id}`.trim() + " ";
  State.update({ description, showAccountAutocomplete: false });
}
/* END_INCLUDE: "core/lib/autocomplete" */

const postType = props.postType ?? "Sponsorship";
const parentId = props.parentId ?? null;
const postId = props.postId ?? null;
const mode = props.mode ?? "Create";

const referralLabels = props.referral ? [`referral:${props.referral}`] : [];
const labelStrings = (props.labels ?? []).concat(referralLabels);
const labels = labelStrings.map((s) => {
  return { name: s };
});

initState({
  seekingFunding: false,
  author_id: context.accountId,
  // Should be a list of objects with field "name".
  labels,
  // Should be a list of labels as strings.
  // Both of the label structures should be modified together.
  labelStrings,
  postType,
  name: props.name ?? "",
  description: props.description ?? "",
  amount: props.amount ?? "0",
  token: props.token ?? "USDT",
  supervisor: props.supervisor ?? "neardevdao.near",
  githubLink: props.githubLink ?? "",
  warning: "",
  draftStateApplied: false,
});

if (!state.draftStateApplied && props.draftState) {
  State.update({ ...props.draftState, draftStateApplied: true });
}

let fields = {
  Comment: ["description"],
  Idea: ["name", "description"],
  Submission: ["name", "description", "fund_raising"],
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

const tokenMapping = {
  NEAR: "NEAR",
  USDT: {
    NEP141: {
      address: "usdt.tether-token.near",
    },
  },
  USDC: {
    NEP141: {
      address:
        "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    },
  },
};

const onSubmit = () => {
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
      description: generateDescription(
        state.description,
        state.amount,
        state.token,
        state.supervisor,
        state.seekingFunding
      ),
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
      sponsorship_token: tokenMapping[state.token],
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
    props.onDraftStateChange(
      Object.assign({}, state, { parent_post_id: parentId })
    );
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
    props.onDraftStateChange(
      Object.assign({}, state, { edit_post_id: postId })
    );
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
);

const githubLinkDiv = (
  <div className="col-lg-12  mb-2">
    Github Issue URL:
    <input
      type="text"
      value={state.githubLink}
      onChange={(event) => State.update({ githubLink: event.target.value })}
    />
  </div>
);

const nameDiv = (
  <div className="col-lg-6  mb-2">
    Title:
    <input
      type="text"
      value={state.name}
      onChange={(event) => State.update({ name: event.target.value })}
    />
  </div>
);

const amountDiv = (
  <div className="col-lg-6  mb-2">
    Amount:
    <input
      type="text"
      value={state.amount}
      onChange={(event) => State.update({ amount: event.target.value })}
    />
  </div>
);

const tokenDiv = (
  <div className="col-lg-6 mb-2">
    Currency
    <select
      onChange={(event) => State.update({ token: event.target.value })}
      class="form-select"
      aria-label="Select currency"
      value={state.token}
    >
      <option value="USDT">USDT</option>
      <option value="NEAR">NEAR</option>
      <option value="USDC">USDC</option>
    </select>
  </div>
);

const supervisorDiv = (
  <div className="col-lg-6 mb-2">
    Supervisor:
    <input
      type="text"
      value={state.supervisor}
      onChange={(event) => State.update({ supervisor: event.target.value })}
    />
  </div>
);

const callDescriptionDiv = () => {
  return (
    <div className="col-lg-12  mb-2">
      Description:
      <br />
      {widget("components.molecule.markdown-editor", {
        data: { handler: state.handler, content: state.description },
        onChange: (content) => {
          State.update({ description: content, handler: "update" });
          textareaInputHandler(content);
        },
      })}
      {autocompleteEnabled && state.showAccountAutocomplete && (
        <AutoComplete>
          <Widget
            src="near/widget/AccountAutocomplete"
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
};

const disclaimer = (
  <p>
    <i>
      * Note, all projects that were granted sponsorships are required to pass
      KYC to receive the funding.
    </i>
  </p>
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
    <div className="col-lg-6 mb-2">
      Currency
      <select
        onChange={(event) => State.update({ token: event.target.value })}
        class="form-select"
        aria-label="Select currency"
        value={state.token}
      >
        <option value="USDT">USDT</option>
        <option value="NEAR">NEAR</option>
        <option value="USDC">USDC</option>
      </select>
    </div>
    <div className="col-lg-6 mb-2">
      Requested amount
      <span class="text-muted fw-normal">(Numbers Only)</span>
      <input
        type="number"
        value={parseInt(state.amount) > 0 ? state.amount : ""}
        min={0}
        onChange={(event) => {
          State.update({
            amount: Number(
              event.target.value.toString().replace(/e/g, "")
            ).toString(),
          });
        }}
      />
    </div>
    <div className="col-lg-6 mb-2">
      <p class="mb-1">
        Requested sponsor
        <span class="text-muted fw-normal">(Optional)</span>
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

const renamedPostType = postType == "Submission" ? "Solution" : postType;
// Below there is a weird code with fields.includes("githubLink") ternary operator.
// This is to hack around rendering bug of near.social.
return (
  <div className="card">
    <div className="card-header">
      {mode} {renamedPostType}
    </div>

    <div class="card-body">
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
      {/* This statement around the githubLinkDiv creates a weird render bug 
      where the title renders extra on state change. */}
      {fields.includes("githubLink") ? (
        <div className="row">
          {fields.includes("githubLink") && githubLinkDiv}
          {labelEditor}
          {fields.includes("name") && nameDiv}
          {fields.includes("description") && callDescriptionDiv()}
        </div>
      ) : (
        <div className="row">
          {labelEditor}
          {fields.includes("name") && nameDiv}
          {fields.includes("amount") && amountDiv}
          {fields.includes("sponsorship_token") && tokenDiv}
          {fields.includes("supervisor") && supervisorDiv}
          {fields.includes("description") && callDescriptionDiv()}
          {fields.includes("fund_raising") && isFundraisingDiv}
          {state.seekingFunding &&
            fields.includes("fund_raising") &&
            fundraisingDiv}
        </div>
      )}
      <button
        style={{
          width: "7rem",
          backgroundColor: "#0C7283",
          color: "#f3f3f3",
        }}
        disabled={state.seekingFunding && (!state.amount || state.amount < 1)}
        className="btn btn-light mb-2 p-3"
        onClick={onSubmit}
      >
        Submit
      </button>
      {disclaimer}
    </div>
    <div class="card-footer">
      Preview:
      {widget("entity.post.Post", {
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
            description:
              postType == "Submission"
                ? generateDescription(
                    state.description,
                    state.amount,
                    state.token,
                    state.supervisor,
                    state.seekingFunding
                  )
                : state.description,
            amount: state.amount,
            sponsorship_token: state.token,
            supervisor: state.supervisor,
            github_link: state.githubLink,
          },
        },
      })}
    </div>
  </div>
);
