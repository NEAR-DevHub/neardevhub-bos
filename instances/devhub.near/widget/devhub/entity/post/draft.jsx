const DRAFT_STATE_STORAGE_KEY = "POST_DRAFT_STATE";

const onDraftStateChange = (draftState) =>
  Storage.privateSet(DRAFT_STATE_STORAGE_KEY, JSON.stringify(draftState));
let draftState;
try {
  draftState = JSON.parse(Storage.privateGet(DRAFT_STATE_STORAGE_KEY));
} catch (e) {}

return { DRAFT_STATE_STORAGE_KEY, draftState, onDraftStateChange };
