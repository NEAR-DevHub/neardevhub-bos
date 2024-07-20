const Container = styled.div`
  height: 60vh;
  .card-custom {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: white;
  }

  @media screen and (max-width: 768px) {
    .card-custom {
      margin: 2rem;
    }
  }

  .bg-grey {
    background-color: #f3f3f2;
  }

  .cursor {
    cursor: pointer;
  }

  .black-btn {
    background-color: #000 !important;
    border: none;
    color: white;
    &:active {
      color: white;
    }
  }
`;

return (
  <Container className="d-flex justify-content-center align-items-center w-100">
    <div class="card-custom">
      <div class="card-body p-4 d-flex flex-column gap-2 justify-content-center align-items-center">
        <i class="bi bi-person-circle h2"></i>
        <div className="h5">Not Logged in</div>
        <p className="text-muted text-center">
          You must log in to create or interact with proposals.
        </p>
        <div className="d-flex gap-2 align-items-center justify-content-end mt-2">
          <Link to="https://near.org/signin">
            <Widget
              src={"${REPL_EVENTS}/widget/devhub.components.molecule.Button"}
              props={{
                classNames: { root: "btn-outline-secondary" },
                label: "Sign In",
              }}
            />
          </Link>
          <Link to="https://near.org/signup">
            <Widget
              src={"${REPL_EVENTS}/widget/devhub.components.molecule.Button"}
              props={{
                classNames: { root: "black-btn" },
                label: "Create Account",
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  </Container>
);
