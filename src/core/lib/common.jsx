function getDepositAmountForWriteAccess(userStorageDeposit) {
  const depositAmt =
    parseInt(userStorageDeposit?.available) > 2000
      ? Big(10).pow(22)
      : Big(10).pow(22);

  return depositAmt;
}

return { getDepositAmountForWriteAccess };
