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

// Needed for context.accountId
const near_app_wallet_auth_key = JSON.parse(
  localStorage.getItem("near_app_wallet_auth_key")
);
if (near_app_wallet_auth_key) {
  localStorage.setItem(
    "near-social-vm:v01::accountId:",
    `"${near_app_wallet_auth_key.accountId}"`
  );
}
