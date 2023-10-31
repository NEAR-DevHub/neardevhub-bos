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
/* INCLUDE: "core/lib/draftstate" */
const DRAFT_STATE_STORAGE_KEY = "POST_DRAFT_STATE";
let is_edit_or_add_post_transaction = false;
let transaction_method_name;

if (props.transactionHashes) {
  const transaction = fetch("https://rpc.mainnet.near.org", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "tx",
      params: [props.transactionHashes, context.accountId],
    }),
  });
  transaction_method_name =
    transaction?.body?.result?.transaction?.actions[0].FunctionCall.method_name;

  is_edit_or_add_post_transaction =
    transaction_method_name == "add_post" ||
    transaction_method_name == "edit_post";

  if (is_edit_or_add_post_transaction) {
    Storage.privateSet(DRAFT_STATE_STORAGE_KEY, undefined);
  }
}

const onDraftStateChange = (draftState) =>
  Storage.privateSet(DRAFT_STATE_STORAGE_KEY, JSON.stringify(draftState));
let draftState;
try {
  draftState = JSON.parse(Storage.privateGet(DRAFT_STATE_STORAGE_KEY));
} catch (e) {}
/* END_INCLUDE: "core/lib/draftstate" */

const activeOptionStyle = {
  backgroundColor: "#0C7283",
  color: "#f3f3f3",
};

const postTypeOptions = {
  Idea: {
    name: "Idea",
    icon: "bi-lightbulb",

    description:
      "Get feedback from the community about a problem, opportunity, or need.",
  },

  Solution: {
    name: "Solution",
    icon: "bi-rocket",

    description:
      "Provide a specific proposal or implementation to an idea, optionally requesting funding. If your solution relates to an existing idea, please reply to the original post with a solution.",
  },
};

const CreatePage = ({ transactionHashes }) => {
  const recoveredPostType = Storage.privateGet("post_type");

  const initialState = {
    post_type: recoveredPostType ?? postTypeOptions.Idea.name,
  };

  State.init(initialState);

  const stateReset = () => {
    Storage.privateSet("post_type", null);
    State.update(initialState);
  };

  if (typeof transactionHashes === "string") stateReset();

  if (recoveredPostType !== null) {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      post_type: recoveredPostType,
    }));
  }

  const typeSwitch = (optionName) => {
    State.update((lastKnownState) => ({
      ...lastKnownState,
      post_type: optionName,
    }));

    Storage.privateSet("post_type", optionName);
  };

  return widget("components.template.app-layout", {
    children: (
      <div
        className="d-flex flex-column gap-4 p-4 bg-light"
        data-bs-parent={`#accordion${postId}`}
        id={`${state.post_type}_post_spawner`}
      >
        {transactionHashes ? (
          <>
            <p
              className="d-flex flex-column justify-content-center align-items-center gap-3"
              style={{ height: 480 }}
            >
              <span>Post created successfully.</span>

              <a
                style={{ backgroundColor: "#3252A6" }}
                className="btn fw-bold"
                href={href("Feed")}
              >
                Back to feed
              </a>
            </p>

            {widget("entity.post.PostEditor", {
              className: "d-none",
              transactionHashes,
            })}
          </>
        ) : (
          <>
            <div className="d-flex flex-column gap-3 w-100">
              <p className="card-title fw-bold fs-6">
                What do you want to create?
              </p>

              <div className="d-flex gap-3">
                {Object.values(postTypeOptions).map((option) => (
                  <button
                    className={`btn btn-${
                      state.post_type === option.name
                        ? "primary"
                        : "outline-secondary"
                    }`}
                    data-testid={`btn-${option.name.toLowerCase()}`}
                    key={option.name}
                    onClick={() => typeSwitch(option.name)}
                    style={
                      state.post_type === option.name ? activeOptionStyle : null
                    }
                    type="button"
                  >
                    <i className={`bi ${option.icon}`} />
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>

              <p className="text-muted w-75">
                {postTypeOptions[state.post_type].description}
              </p>
            </div>

            {widget("entity.post.PostEditor", {
              mode: "Create",
              onCancel: stateReset,
              parent_id: null,
              post_type: state.post_type,
              transactionHashes,
            })}
          </>
        )}
      </div>
    ),
  });
};

return CreatePage(props);
