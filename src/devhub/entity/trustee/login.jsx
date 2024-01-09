const Container = styled.div`
  width: 80vw;
  .card-custom {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: white;
  }

  .bg-grey {
    background-color: #f3f3f2;
  }

  .cursor {
    cursor: pointer;
  }
`;

return (
  <Container className="d-flex justify-content-center align-items-center h-100">
    <div class="card-custom">
      <div class="card-body p-4 d-flex flex-column gap-2 justify-content-center align-items-center">
        <i class="bi bi-person-circle"></i>
        <div className="h5">Login Below</div>
        <div
          onClick={() => props.setIsTrustee(true)}
          className="rounded-4 bg-grey p-2 text-center d-flex gap-2 flex-row justify-content-center align-items-center cursor"
          style={{ width: 230 }}
        >
          <i class="bi bi-fingerprint"></i>
          <span>Connect Wallet</span>
        </div>
      </div>
    </div>
  </Container>
);
