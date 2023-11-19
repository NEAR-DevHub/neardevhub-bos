import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui-js";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";

const selector = await setupWalletSelector({
  network: "mainnet",
  modules: [setupMyNearWallet(), setupHereWallet()],
});

const modal = setupModal(selector, {
  contractId: "social.near",
});

document
  .getElementById("openWalletSelectorButton")
  .addEventListener("click", () => modal.show());
