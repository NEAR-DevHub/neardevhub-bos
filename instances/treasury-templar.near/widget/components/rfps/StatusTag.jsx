const { RFP_TIMELINE_STATUS } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/core.common`
) || { RFP_TIMELINE_STATUS: {} };

const timelineStatus = props.timelineStatus;
const size = props.size ?? "md";

const getClassNameByStatus = () => {
  switch (timelineStatus) {
    case RFP_TIMELINE_STATUS.CANCELLED:
      return "grey";
    case RFP_TIMELINE_STATUS.PROPOSAL_SELECTED:
      return "green";
    case RFP_TIMELINE_STATUS.EVALUATION:
      return "orange";
    default:
      return "black";
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

  .black-tag {
    border: 1px solid #000 !important;
    color: #000 !important;
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
