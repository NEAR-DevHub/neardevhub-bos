import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  // Define an option and provide a default value.
  // We can later override it in the config.
  account: ["devhub.near", { option: true }],
  proposalAuthorAccountId: ["megha19.near", { option: true }],
  linksTestProposalId: [1, { option: true }],
  linksTestCommentAuthorId: ["theori.near", { option: true }],
  linksTestCommentBlockHeight: [121684702, { option: true }],
});
