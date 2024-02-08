const timelineStatus = props.timelineStatus;
const size = props.size ?? "md";

const getClassNameByStatus = () => {
  switch (timelineStatus) {
    case "DRAFT":
      return "grey";
    case "REVIEW":
      return "grey";
    case "APPROVED":
    case "PAYMENT_PROCESSING":
    case "APPROVED_CONDITIONALLY":
    case "FUNDED":
      return "green";
    case "REJECTED":
      return "green";
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

  .warning-tag {
    border: 1px solid #f40303 !important;
    color: #f40303 !important;
  }

  .grey-tag {
    border: 1px solid #555555 !important;
    color: #555555 !important;
  }

  .green-tag {
    border: 1px solid #04a46e !important;
    color: #04a46e !important;
  }
`;

return (
  <Container size={size}>
    <div className={getClassNameByStatus() + "-tag rounded-2 p-1"}>
      {timelineStatus}
    </div>
  </Container>
);
