const timelineStatus = props.timelineStatus;
const size = props.size ?? "md";

const getClassNameByStatus = () => {
  switch (timelineStatus) {
    case "DRAFT":
      return "grey";
    case "REVIEW":
      return "blue";
    case "APPROVED":
    case "APPROVED_CONDITIONALLY":
    case "FUNDED":
      return "green";
    case "PAYMENT_PROCESSING":
      return "orange";
    case "REJECTED":
    case "CANCELLED":
      return "warning";
    default:
      return "green";
  }
};

const Container = styled.div`
  font-size: ${({ size }) => {
    switch (size) {
      case "sm":
        return "10px";
      case "lg":
        return "14px";
      default:
        return "12px";
    }
  }};

  min-width: fit-content;

  .orange-tag {
    border: 1px solid #ff7a00 !important;
    color: #ff7a00 !important;
  }

  .warning-tag {
    border: 1px solid #f40303 !important;
    color: #f40303 !important;
  }

  .blue-tag {
    border: 1px solid #2c3e50 !important;
    color: #2c3e50 !important;
  }

  .grey-tag {
    border: 1px solid #979797 !important;
    color: #979797 !important;
  }

  .green-tag {
    border: 1px solid #04a46e !important;
    color: #04a46e !important;
  }

  .fw-bold {
    font-weight: 600 !important;
  }
`;

return (
  <Container size={size}>
    <div className={getClassNameByStatus() + "-tag fw-bold rounded-2 p-1 px-2"}>
      {(timelineStatus ?? "").replace("_", " ")}
    </div>
  </Container>
);
