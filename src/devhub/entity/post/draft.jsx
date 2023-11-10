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

return { DRAFT_STATE_STORAGE_KEY, draftState, onDraftStateChange };
