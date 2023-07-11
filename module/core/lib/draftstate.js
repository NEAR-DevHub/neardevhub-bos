const DRAFT_STATE_STORAGE_KEY = "POST_DRAFT_STATE";
if (props.transactionHashes) {
  Storage.privateSet(DRAFT_STATE_STORAGE_KEY, undefined);
}

const onDraftStateChange = (draftState) =>
  Storage.privateSet(DRAFT_STATE_STORAGE_KEY, JSON.stringify(draftState));
let draftState;
try {
  draftState = JSON.parse(Storage.privateGet(DRAFT_STATE_STORAGE_KEY));
} catch (e) {}
