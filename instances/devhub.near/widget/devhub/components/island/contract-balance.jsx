const { accountId, dark } = props;

const [remainingBalance, setRemainingBalance] = useState("2");

function stringToNear(yoctoString) {
  const paddedYoctoString = yoctoString.padStart(25, "0");
  const integerPart = paddedYoctoString.slice(0, -24) || "0";
  const fractionalPart = paddedYoctoString.slice(-24, -18);
  return parseFloat(`${integerPart}.${fractionalPart}`);
}

asyncFetch("${REPL_RPC_URL}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "dontcare",
    method: "query",
    params: {
      request_type: "view_account",
      finality: "final",
      account_id: accountId,
    },
  }),
})
  .then(({ body: data }) => {
    const storageUsage = data.result?.storage_usage || 0;
    const yoctoString = data.result?.amount || "0";
    const usageCostNear = storageUsage * 0.00001;
    const nearAmount = stringToNear(yoctoString);
    const remainingStorageCostNear = nearAmount - usageCostNear;
    setRemainingBalance(remainingStorageCostNear.toFixed(2));
  })
  .catch((error) => console.error(error));

return (
  <div
    data-testid="contract-balance-wrapper"
    className={dark ? "text-white" : "text-black"}
  >
    {parseFloat(remainingBalance) < 2 ? (
      <span data-testid="contract-balance">
        Remaining Balance: {remainingBalance}
      </span>
    ) : null}
  </div>
);
