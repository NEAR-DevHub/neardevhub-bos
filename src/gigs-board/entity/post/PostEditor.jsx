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

const parentId = props.parentId ?? null;
const postId = props.postId ?? null;
const mode = props.mode ?? "Create";

const tags = (props.tags ?? props.labels ?? []).concat(
  props.referral ? [`referral:${props.referral}`] : []
);

State.init({
  fundraising: false,
  author_id: context.accountId,

  /**
   * A list of string tags.
   */
  tags,

  /**
   * Tags as a list of objects with field "name".
   */
  tagOptions: tags.map((tag) => ({ name: tag })),

  postType: props.postType ?? "Idea",
  name: props.name ?? "",
  description: props.description ?? "",
  amount: props.amount ?? props.requested_sponsorship_amount ?? "0",
  token: tokenMapping[props.token] ?? "USDT",
  supervisor: props.supervisor ?? props.requested_sponsor ?? "",
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

  Solution: [
    "name",
    "description",
    "requested_sponsorship_amount",
    "sponsorship_token",
    "requested_sponsor",
  ],

  Attestation: ["name", "description"],

  Sponsorship: [
    "name",
    "description",
    "amount",
    "sponsorship_token",
    "supervisor",
  ],

  Github: ["githubLink", "name", "description"],
}[state.postType];

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
};

const onSubmit = () => {
  let labels = state.tags;
  var body = {
    Comment: { description: state.description, comment_version: "V2" },
    Idea: {
      name: state.name,
      description: state.description,
      idea_version: "V1",
    },
    Solution: {
      name: state.name,
      description: state.description,
      requested_sponsor: state.supervisor,
      requested_sponsorship_amount: state.amount,
      sponsorship_token: tokenMapping[state.token],
      solution_version: "V2",
    },
    Attestation: {
      name: state.name,
      description: state.description,
      attestation_version: "V1",
    },
    Sponsorship: {
      name: state.name,
      description: state.description,
      supervisor: state.supervisor,
      amount: state.amount,
      sponsorship_token: tokenMapping[state.token],
      sponsorship_version: "V1",
    },
    Github: {
      name: state.name,
      description: state.description,
      github_version: "V0",
      github_link: state.githubLink,
    },
  }[state.postType];
  body["post_type"] = state.postType;
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

const normalizeTag = (tag) =>
  tag
    .replaceAll(/[- \.]/g, "_")
    .replaceAll(/[^\w]+/g, "")
    .replaceAll(/_+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase()
    .trim("-");

const checkTag = (tag) => {
  Near.asyncView(nearDevGovGigsContractAccountId, "is_allowed_to_use_labels", {
    editor: context.accountId,
    labels: [tag],
  }).then((allowed) => {
    if (allowed) {
      State.update({ warning: "" });
    } else {
      State.update({
        warning:
          'The tag "' +
          tag +
          '" is protected and can only be added by moderators',
      });
      return;
    }
  });
};

const setTags = (tagOptions) => {
  tagOptions = tagOptions.map((tagOption) => ({
    name: normalizeTag(tagOption.name),
  }));

  if (tagOptions.length < state.tagOptions.length) {
    const lastKnownTagList = new Set(state.tagOptions.map(({ name }) => name));

    for (const tag of tagOptions) {
      lastKnownTagList.delete(tag.name);
    }

    const protectedTag = lastKnownTagList.values().next().value;

    Near.asyncView(
      nearDevGovGigsContractAccountId,
      "is_allowed_to_use_labels",
      { editor: context.accountId, labels: [protectedTag] }
    ).then((allowed) =>
      State.update(
        allowed
          ? { tags: lastKnownTagList, tagOptions }
          : {
              warning: `The tag "${protectedTag}" is protected and can only be updated by moderators`,
            }
      )
    );
  } else {
    State.update({
      tags,

      tagOptions: tags.map((tagOption) => ({
        name: normalizeTag(tagOption.name),
      })),
    });
  }
};
const existingTags =
  Near.view(nearDevGovGigsContractAccountId, "get_all_allowed_labels", {
    editor: context.accountId,
  }) ?? [];

const tagEditor = (
  <div className="col-lg-12  mb-2">
    <span>Tags:</span>

    <Typeahead
      multiple
      labelKey="name"
      onInputChange={checkTag}
      onChange={setTags}
      options={existingTags.map((tag) => ({ name: tag }))}
      placeholder="near.social, widget, NEP, standard, protocol, tool"
      selected={state.tagOptions}
      positionFixed
      allowNew={(results, props) =>
        !new Set(existingTags).has(props.text) &&
        props.selected.filter((selected) => selected.name === props.text)
          .length == 0 &&
        Near.view(nearDevGovGigsContractAccountId, "is_allowed_to_use_labels", {
          editor: context.accountId,
          labels: [props.text],
        })
      }
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

const fundraisingToggle = (
  <div className="mb-2">
    <p className="fs-6 fw-bold mb-1">
      <span>Are you seeking funding for your solution?</span>
      <span className="text-muted fw-normal">(Optional)</span>
    </p>

    <div className="form-check form-check-inline">
      <label className="form-check-label">
        <button
          className="btn btn-light p-0"
          style={{
            backgroundColor: state.fundraising ? "#0C7283" : "inherit",
            color: "#f3f3f3",
            border: "solid #D9D9D9",
            borderRadius: "100%",
            height: "20px",
            width: "20px",
          }}
          onClick={() =>
            State.update((lastKnownState) => ({
              ...lastKnownState,
              fundraising: true,
            }))
          }
        />
        Yes
      </label>
    </div>

    <div className="form-check form-check-inline">
      <label className="form-check-label">
        <button
          className="btn btn-light p-0"
          style={{
            backgroundColor: !state.fundraising ? "#0C7283" : "inherit",
            color: "#f3f3f3",
            border: "solid #D9D9D9",
            borderRadius: "100%",
            height: "20px",
            width: "20px",
          }}
          onClick={() =>
            State.update((lastKnownState) => ({
              ...lastKnownState,
              fundraising: false,
            }))
          }
        />
        No
      </label>
    </div>
  </div>
);

return (
  <div className="card">
    <div className="card-header">
      {mode} {state.postType}
    </div>

    <div className="card-body">
      {state.warning && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          {state.warning}

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => State.update({ warning: "" })}
          />
        </div>
      )}

      {/* This statement around the githubLinkDiv creates a weird render bug
      where the title renders extra on state change. */}
      {fields.includes("githubLink") ? (
        <div className="row">
          {fields.includes("githubLink") && (
            <div className="col-lg-12  mb-2">
              <span>Github Issue URL:</span>

              <input
                type="text"
                value={state.githubLink}
                onChange={(event) =>
                  State.update((lastKnownState) => ({
                    ...lastKnownState,
                    githubLink: event.target.value,
                  }))
                }
              />
            </div>
          )}

          {tagEditor}
          {fields.includes("name") && nameDiv}
          {fields.includes("description") && callDescriptionDiv()}
        </div>
      ) : (
        <div className="row">
          {tagEditor}
          {fields.includes("name") && nameDiv}

          {fundraisingToggle}

          {fields.includes("amount") && (
            <div className="col-lg-6 mb-2">
              <span>Amount:</span>

              <input
                type="text"
                value={state.amount}
                onChange={(event) =>
                  State.update((lastKnownState) => ({
                    ...lastKnownState,
                    amount: event.target.value,
                  }))
                }
              />
            </div>
          )}

          {state.postType === "Sponsorship" && (
            <div className="col-lg-6 mb-2">
              <span>Currency</span>

              <select
                onChange={(event) =>
                  State.update((lastKnownState) => ({
                    ...lastKnownState,
                    token: event.target.value,
                  }))
                }
                className="form-select"
                aria-label="Default select"
              >
                <option selected value={"USDT"}>
                  USDT
                </option>

                <option value="NEAR">NEAR</option>
              </select>
            </div>
          )}

          {(fields.includes("supervisor") ||
            fields.includes("requested_sponsor")) && (
            <div className="col-lg-6 mb-2">
              <span>{`${
                state.postType === "Solution"
                  ? "Requested sponsor"
                  : "Supervisor"
              }:`}</span>

              <input
                type="text"
                value={state.supervisor}
                onChange={(event) =>
                  State.update((lastKnownState) => ({
                    ...lastKnownState,
                    supervisor: event.target.value,
                  }))
                }
              />
            </div>
          )}

          {fields.includes("description") && callDescriptionDiv()}

          {fields.includes("requested_sponsorship_amount") &&
            state.fundraising && (
              <div className="d-flex flex-column mb-2">
                <div className="col-lg-6  mb-2">
                  <span>Currency</span>

                  <select
                    onChange={(event) =>
                      State.update((lastKnownState) => ({
                        ...lastKnownState,
                        token: event.target.value,
                      }))
                    }
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option selected value="NEAR">
                      NEAR
                    </option>

                    <option value={"USDT"}>USDT</option>
                  </select>
                </div>

                <div className="col-lg-6 mb-2">
                  <span>Requested amount</span>
                  <span className="text-muted fw-normal">(Numbers only)</span>

                  <input
                    type="number"
                    value={parseInt(state.amount) > 0 ? state.amount : ""}
                    min={0}
                    onChange={(event) =>
                      State.update((lastKnownState) => ({
                        ...lastKnownState,

                        amount: Number(
                          event.target.value.toString().replace(/e/g, "")
                        ).toString(),
                      }))
                    }
                  />
                </div>

                <div className="col-lg-6 mb-2">
                  <p className="mb-1">
                    <span>Requested sponsor</span>
                    <span className="text-muted fw-normal">(Optional)</span>
                  </p>

                  <p
                    style={{ fontSize: "13px" }}
                    className="m-0 text-muted fw-light"
                  >
                    If you are requesting funding from a specific sponsor,
                    please enter their account ID.
                  </p>

                  <div className="input-group flex-nowrap">
                    <span className="input-group-text" id="addon-wrapping">
                      @
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter account ID"
                      value={state.supervisor}
                      onChange={(event) =>
                        State.update((lastKnownState) => ({
                          ...lastKnownState,
                          supervisor: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      )}

      <button
        style={{ width: "7rem", backgroundColor: "#0C7283", color: "#f3f3f3" }}
        disabled={state.fundraising && (!state.amount || state.amount < 1)}
        className="btn btn-light mb-2 p-3"
        onClick={onSubmit}
      >
        Submit
      </button>

      {disclaimer}
    </div>

    <div className="card-footer">
      <span>Preview:</span>

      {widget("entity.post.Post", {
        isPreview: true,
        id: 0, // irrelevant

        post: {
          author_id: state.author_id,
          likes: [],

          snapshot: {
            editor_id: state.editor_id,
            labels: state.tags,
            post_type: state.postType,
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
);
