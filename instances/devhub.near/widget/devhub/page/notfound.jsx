const { missing } = props;

const BannerWrapper = styled.div`
  margin-top: 3rem;
  background-color: #ffd2d2;
  .text-sm {
    font-size: 13px;
  }
`;

return (
  <div className="container-xl gap-3">
    <Widget src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`} />
    <BannerWrapper className="d-flex gap-3 align-items-center mb-4 p-3 rounded-3">
      <div>
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <div>
        <div className="fw-bold">Page not found! </div>
        <div className="text-sm">
          Please visit the{" "}
          <a
            href="?page=home"
            className="text-decoration-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Home Page
          </a>
          .
          {missing ? (
            <span>The {missing} prop is missing from the url</span>
          ) : (
            <span>
              We searched high and low but couldn't found what you're looking
              for.{" "}
            </span>
          )}
          .
        </div>
      </div>
    </BannerWrapper>
  </div>
);
