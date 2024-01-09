const Container = styled.div`
  .bg-dark-grey {
    background-color: #7e868c;
  }
  .text-white {
    color: white;
  }

  .py-3 {
    padding-block: 1.5rem !important;
  }

  .flex-item {
    flex: 1;
  }

  .text-small {
    font-size: 12px;
    font-weight: 400;
  }
`;

function convertYoctoToNear(yoctoNear) {
  return (
    <div className="d-flex gap-2 align-items-center">
      {Big(yoctoNear).div(Big(10).pow(24)).toFixed(3)}
      <img
        src="https://ipfs.near.social/ipfs/bafkreify3fv4w3yq2vmqe2nobsznpd4pdtkjolaia2c3wfx627zykxvmdi"
        height={15}
      />
    </div>
  );
}

const accountId = "devhub.near";
const res = fetch(`https://api.nearblocks.io/v1/account/${accountId}`);

if (res === null) {
  return <></>;
}

return (
  <Container className="d-flex flex-column gap-4">
    <div className="h4 bold mb-0">Treasury</div>
    <div className="bg-dark-grey text-white p-4 py-3 d-flex gap-2 align-items-center rounded-4">
      <div className="flex-item d-flex gap-2 align-items-center">
        <div className="h3 bold">{accountId}</div>
        <i
          class="bi bi-copy"
          onClick={() => clipboard.writeText(accountId)}
        ></i>
      </div>
      <div className="flex-item d-flex gap-4 text-small">
        <div>
          <p>Balance</p>
          <p className="h5 bold">
            {convertYoctoToNear(res.body?.account[0]?.amount)}
          </p>
        </div>
        <div>
          <p>Staked</p>
          <p className="h5 bold">
            {convertYoctoToNear(res.body?.account[0]?.locked)}
          </p>
        </div>
        <div>
          <p>Transactions</p>
          <p className="h5 bold">{}</p>
        </div>
      </div>
    </div>
  </Container>
);
