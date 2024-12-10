const { getGlobalLabels } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };

return {
  portalName: "Templar",
  contract: "${REPL_TREASURY_TEMPLAR_CONTRACT}",
  proposalFeedIndexerQueryName: "",
  rfpFeedIndexerQueryName: "",
  indexerHasuraRole: "",
  isInfra: true,
  aavailableCategoryOptions: getGlobalLabels(),
};
