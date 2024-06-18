// https://docs.rs/near-sdk/latest/near_sdk/env/constant.STORAGE_PRICE_PER_BYTE.html
const STORAGE_PRICE_PER_BYTE = "10000000000000000000";
// https://github.com/NearSocial/social-db/blob/d28c647252ce25a06c70c3b7f4930ccdcd217fd9/contract/src/account.rs#L8C5-L8C50
const MIN_STORAGE_BYTES = "2000";
const MIN_STORAGE_COST = Big(STORAGE_PRICE_PER_BYTE).times(MIN_STORAGE_BYTES);

// in case the user is new and doesn't have min storage cost, increasing the deposit
function getDepositAmountForWriteAccess(userStorageDeposit) {
  const depositAmt = Big(userStorageDeposit?.available).gt(MIN_STORAGE_COST)
    ? Big(10).pow(22)
    : Big(MIN_STORAGE_COST).plus(Big(10).pow(22));

  return depositAmt;
}

function readableDate(timestamp) {
  var a = new Date(timestamp);
  var options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  };
  return a.toLocaleString("en-US", options) + " UTC";
}

return { getDepositAmountForWriteAccess, readableDate };
