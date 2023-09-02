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
      src={`${
        props.env !== "local"
          ? `${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.`
          : ""
      }${widgetName}`}
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

  return [
    "/#/",

    ...(props.env !== "local"
      ? [`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.`]
      : []),

    `${widgetName}${linkPropsQuery ? "?" : ""}${linkPropsQuery}`,
  ].join("");
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

if (is_edit_or_add_post_transaction) {
  return (
    <p class="text-secondary">
      Post {transaction_method_name == "edit_post" ? "edited" : "added"}{" "}
      successfully. Back to{" "}
      <a
        style={{
          color: "#3252A6",
        }}
        className="fw-bold"
        href={href("Post", { id: props.id })}
      >
        post
      </a>
    </p>
  );
} else {
  return widget("components.template.app-layout", {
    children: widget("entity.post.Post", {
      id: props.id,
      timestamp: props.timestamp,
      compareTimestamp: props.compareTimestamp,
      onDraftStateChange,
      draftState,
    }),
  });
}
